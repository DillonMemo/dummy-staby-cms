import {
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Image,
  Input,
  InputNumber,
  List,
  Progress,
  Select,
  Skeleton,
  Tooltip,
  Upload,
} from 'antd'
import { delay, pick } from 'lodash'
import mongoose from 'mongoose'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getError, nowDateStr } from '../../Common/commonFn'

/** components */
import Layout from '../../components/Layout'
import LoadingOverlay from '../../components/LoadingOverlay'
import VodUploadContainer from '../../components/vod/VodUploadContainer'

/** graphql */
import {
  CreateVodMutation,
  CreateVodMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  GetLivesQuery,
  GetLivesQueryVariables,
  MemberType,
  RatioType,
  VodLinkInfo,
} from '../../generated'
import { CREATE_VOD_MUTATION } from '../../graphql/mutations'
import { FIND_MEMBERS_BY_TYPE_QUERY, GET_LIVES_QUERY } from '../../graphql/queries'
import { S3 } from '../../lib/awsClient'

/** utils */
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { ShareInfo, ShareInfoGrid, SkeletonStyle } from '../live/createLive'

type Props = styleMode

export interface VodCreateForm {
  title: string
  paymentAmount: number
  vodRatioType: RatioType
  mainThumbnail: string
  content: string
  share: ShareInfo
  liveId: string
}

export type ProgressType = {
  progress: number
  status: 'active' | 'success' | 'exception' | 'normal'
}

export type ImgType = {
  isVisible: boolean
  src?: string
}

export type VodInfo = {
  video: File | string
  image: File | string
}

const CreateVod: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()

  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    isUploading: false,
    isProcessing: false,
  })
  const [thumbnailProgress, setThumbnailProgress] = useState<ProgressType>({
    progress: 0,
    status: 'normal',
  })
  const [imageProgress, setImageProgress] = useState<ProgressType>({
    progress: 0,
    status: 'normal',
  })
  const [videoProgress, setVideoProgress] = useState<ProgressType>({
    progress: 0,
    status: 'normal',
  })
  const [thumbnailImg, setThumbnailImg] = useState<ImgType>({
    isVisible: false,
  })
  const [vodInfo, setVodInfo] = useState<VodInfo[]>([])
  const [shareInfo, setShareInfo] = useState<ShareInfo[]>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 100 },
  ])

  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<VodCreateForm>({ mode: 'onChange' })

  const { data: memberData, loading: isMemberLoading } = useQuery<
    FindMembersByTypeQuery,
    FindMembersByTypeQueryVariables
  >(FIND_MEMBERS_BY_TYPE_QUERY, {
    variables: {
      membersByTypeInput: {
        memberType: MemberType.Business,
      },
    },
  })

  const { data: liveData, loading: isLiveLoading } = useQuery<
    GetLivesQuery,
    GetLivesQueryVariables
  >(GET_LIVES_QUERY)

  const [createVod] = useMutation<CreateVodMutation, CreateVodMutationVariables>(
    CREATE_VOD_MUTATION
  )

  /**
   * 추가 버튼 클릭 이벤트 핸들러 입니다.
   * @returns 추가 성공 여부를 반환
   */
  const onAddMember = () =>
    setShareInfo((prev) => [
      ...prev,
      { memberId: '', nickName: '', priorityShare: 0, directShare: 100 },
    ])

  /**
   * 자식 컴포넌트에서 추가 이벤트 발생시 부모의 상태 관리 이벤트 핸들러 입니다
   * @param {File} video - 파일
   * @param {File} image - 파일
   */
  const onVodChange = (video: VodInfo['video'], image: VodInfo['image']) =>
    setVodInfo((prev) => [...prev, { video, image }])

  /**
   * VOD 삭제 버튼 클릭 이벤트 핸들러
   * @param {number} index row index number
   */
  const onDeleteVod = (index: number) => () =>
    setVodInfo((prev) => [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)])

  /**
   * 지분 삭제 버튼 클릭 이벤트 핸들러 입니다.
   * @param {number} index
   * @returns 지분 삭제 성공 여부를 반환
   */
  const onDeleteShare = (index: number) => () =>
    setShareInfo((prev) => [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)])

  /**
   * 최종 저장 버튼 이벤트 핸들러
   */
  const onSubmit = () => {
    try {
      setLoading((prev) => ({ ...prev, isUploading: true }))
      const { mainThumbnail } = getValues()

      const [priorityShareSum, directShareSum] = [
        shareInfo.reduce(
          (prev, current) => (prev ? prev + current.priorityShare : 0 + current.priorityShare),
          0
        ),
        shareInfo.reduce(
          (prev, current) => (prev ? prev + current.directShare : 0 + current.directShare),
          0
        ),
      ]

      if (!(priorityShareSum === 100 || priorityShareSum === 0)) {
        return toast.error(
          locale === 'ko'
            ? '우선환수 지분은 총합이 100 또는 0 이어야 합니다'
            : 'Priority share sum is 100 or 0',
          {
            theme: localStorage.theme || 'light',
            autoClose: 750,
            onClose: () => setLoading({ isUploading: false, isProcessing: false }),
          }
        )
      }
      if (directShareSum !== 100) {
        return toast.error(
          locale === 'ko' ? '직분배 지분은 총합이 100 이어야 합니다' : 'Direct share sum is 100',
          {
            theme: localStorage.theme || 'light',
            autoClose: 750,
            onClose: () => setLoading({ isUploading: false, isProcessing: false }),
          }
        )
      }

      const objectId = new mongoose.Types.ObjectId().toString()
      /** File 업로드 영역 - 1 */
      if ((mainThumbnail as any).file.originFileObj instanceof File) {
        const file = (mainThumbnail as any).file.originFileObj as File
        const fileExtension = file.name.split('.')[file.name.split('.').length - 1]
        const fileName = `${objectId}_main_${nowDateStr}.${fileExtension}`

        process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
          S3.upload(
            {
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Key: `${
                process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
              }/going/vod/${objectId}/main/${fileName}`,
              Body: file,
              ACL: 'public-read',
            },
            (error) => {
              if (error) {
                return toast.error(
                  locale === 'ko'
                    ? `파일 업로드 오류: ${error.message}`
                    : `There was an error uploading your file: ${error.message}`,
                  {
                    theme: localStorage.theme || 'light',
                    autoClose: 750,
                    onClose: () => setLoading({ isUploading: false, isProcessing: false }),
                  }
                )
              }

              return delay(() => {
                onUploading(objectId, fileName)
              }, 750)
            }
          ).on('httpUploadProgress', (progress) => {
            const progressPercentage = Math.round((progress.loaded / progress.total) * 100)

            if (progressPercentage < 100) {
              setThumbnailProgress((prev) => ({
                ...prev,
                progress: progressPercentage,
                status: 'active',
              }))
            } else if (progressPercentage === 100) {
              setThumbnailProgress((prev) => ({
                ...prev,
                status: 'success',
                progress: progressPercentage,
              }))
            }
          })
      }
    } catch (error) {
      getError(error)
    }
  }

  /** File 업로드 영역 - 2 */
  const onUploading = async (objectId: string, thumbnailName: string) => {
    try {
      let imageCount = 0,
        videoCount = 0,
        num = 0,
        imageInfo: string[] = [],
        videoInfo: string[] = []
      for (const info of vodInfo) {
        info.image instanceof File && imageCount++
        info.video instanceof File && videoCount++
      }

      await Promise.all(
        vodInfo.map(async (info, index) => {
          if (info.image instanceof File) {
            const image = info.image,
              imageFileExtension = image.name.split('.')[image.name.split('.').length - 1],
              imageFileName = `${objectId}_intro_${index + 1}_${nowDateStr}.${imageFileExtension}`
            imageInfo = [...imageInfo, imageFileName]

            process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
              (await S3.upload({
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                Key: `${
                  process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
                }/going/vod/${objectId}/intro/${imageFileName}`,
                Body: image,
                ACL: 'public-read',
              })
                .promise()
                .then(() => {
                  const percentage = Math.round(100 / imageCount)
                  setImageProgress((prev) => {
                    const calcPercentage = prev.progress + percentage
                    if (calcPercentage < 95) {
                      return { ...prev, progress: calcPercentage, status: 'active' }
                    } else {
                      return {
                        ...prev,
                        progress: calcPercentage + (100 - calcPercentage),
                        status: 'success',
                      }
                    }
                  })
                })
                .catch((error) =>
                  toast.error(
                    locale === 'ko'
                      ? `VOD image 파일 업로드 오류: ${error}`
                      : `There was an error uploading your VOD image file: ${error}`,
                    {
                      theme: localStorage.theme || 'light',
                      autoClose: 750,
                      onClose: () => setLoading({ isUploading: false, isProcessing: false }),
                    }
                  )
                ))
          }
        })
      )

      await Promise.all(
        vodInfo.map(async (info, index) => {
          if (info.video instanceof File) {
            const video = info.video,
              videoFileExtension = video.name.split('.')[video.name.split('.').length - 1],
              videoFileName = `${objectId}_${index + 1}_${nowDateStr}.${videoFileExtension}`
            videoInfo = [...videoInfo, videoFileName]

            process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME &&
              S3.upload(
                {
                  Bucket: process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME,
                  Key: `${
                    process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
                  }/going/vod/${objectId}/${videoFileName}`,
                  Body: video,
                  ACL: 'bucket-owner-read',
                },
                (error, _) => {
                  if (error) {
                    return toast.error(
                      locale === 'ko'
                        ? `VOD video 파일 업로드 오류: ${error}`
                        : `There was an error uploading your VOD video file: ${error}`,
                      {
                        theme: localStorage.theme || 'light',
                        autoClose: 750,
                        onClose: () => setLoading({ isUploading: false, isProcessing: false }),
                      }
                    )
                  }

                  num = num + 1
                  if (videoCount === num) {
                    return delay(() => {
                      setLoading({ isUploading: false, isProcessing: true })
                      onMutation(objectId, thumbnailName, imageInfo, videoInfo) // add filename
                    }, 750)
                  } else {
                    return num
                  }
                }
              ).on('httpUploadProgress', (progress_) => {
                const progressPercentage = Math.round((progress_.loaded / progress_.total) * 100)
                const quarterPercentage = Math.round(progressPercentage / videoCount)
                const quarter = Math.round(100 / videoCount)
                // console.log(progressPercentage, quarterPercentage, quarter)

                if (progressPercentage < 100) {
                  setVideoProgress((prev) => {
                    if (prev.progress < quarterPercentage) {
                      // console.log('1', num, quarterPercentage)
                      return {
                        ...prev,
                        progress: num === 0 ? quarterPercentage : quarter * num + quarterPercentage,
                        status: 'active',
                      }
                    } else if (prev.progress === quarter) {
                      // console.log('2', prev.progress + 1)
                      return {
                        ...prev,
                        progress: prev.progress + 1,
                        status: 'active',
                      }
                    } else if (prev.progress > quarter) {
                      // console.log('3', num, quarter * num + quarterPercentage, prev.progress)
                      return {
                        ...prev,
                        progress:
                          num === 0
                            ? quarter + 1
                            : prev.progress > quarter * num + quarterPercentage
                            ? prev.progress
                            : quarter * num + quarterPercentage,
                        status: 'active',
                      }
                    } else {
                      // console.log('4', prev.progress, quarter)
                      return {
                        ...prev,
                      }
                    }
                  })
                } else if (progressPercentage === 100) {
                  if (videoCount % num === 1) {
                    setVideoProgress((prev) => ({
                      ...prev,
                      progress: progressPercentage,
                      status: 'success',
                    }))
                  } else if (num === 0 && vodInfo.length === 1) {
                    // VOD를 한개만 업로드 할 경우 99% > 100%로 전환
                    setVideoProgress((prev) => ({
                      ...prev,
                      progress: progressPercentage,
                      status: 'success',
                    }))
                  } else {
                    setVideoProgress((prev) => ({ ...prev }))
                  }
                }
              })
          }
        })
      )
    } catch (error) {
      getError(error)
    }
  }

  const onMutation = async (
    _id: string,
    thumbnail: string,
    imageInfo: string[],
    videoInfo: string[]
  ) => {
    try {
      const vodLinkInfo: Pick<VodLinkInfo, 'listingOrder' | 'linkPath' | 'introImageName'>[] = []
      if (imageInfo.length === videoInfo.length) {
        for (let i = 0; i < imageInfo.length; i++) {
          vodLinkInfo.push({
            listingOrder: i + 1,
            linkPath: videoInfo[i],
            introImageName: imageInfo[i],
          })
        }

        // result
        const { liveId, content, paymentAmount, title, vodRatioType } = getValues()

        const { data } = await createVod({
          variables: {
            createVodInput: {
              _id,
              mainImageName: thumbnail,
              vodLinkInfo,
              vodShareInfo: {
                vodId: _id,
                memberShareInfo: shareInfo,
              },
              ...(liveId && { liveId }),
              content,
              paymentAmount,
              title,
              vodRatioType,
            },
          },
        })

        if (!data?.createVod.ok) {
          const message = locale === 'ko' ? data?.createVod.error?.ko : data?.createVod.error?.en
          throw new Error(message)
        } else {
          setLoading({ isUploading: false, isProcessing: false })
          toast.success(locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed', {
            theme: localStorage.theme || 'light',
            autoClose: 750,
            onClose: () => push('/vod/vods'),
          })
        }
      } else {
        throw new Error(
          locale === 'ko'
            ? '선택된 이미지와 비디오의 비율이 일치 하지 않습니다'
            : 'The ratio of the selected image to the video does not match'
        )
      }
    } catch (error) {
      getError(error, true)
      setLoading((prev) => ({ ...prev, isProcessing: false }))
    }
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'Vod 추가' : 'Live Create'}</h2>
          <ol>
            <li>
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link href="/vod/vods" locale={locale}>
                <a>{locale === 'ko' ? 'Vod' : 'Vod'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Vod 추가' : 'Vod Create'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            {!isMemberLoading && !isLiveLoading ? (
              <Form name="createVodForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid col-4 gap-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                      <Controller
                        control={control}
                        name="title"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목 입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            className="input"
                            placeholder={locale === 'ko' ? '제목 입력' : 'Enter the title'}
                            value={value}
                            onChange={onChange}
                            maxLength={100}
                          />
                        )}
                      />
                      {errors.title?.message && (
                        <div className="form-message">
                          <span>{errors.title.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                      <Controller
                        control={control}
                        name="paymentAmount"
                        defaultValue={0}
                        rules={{
                          required:
                            locale === 'ko'
                              ? '0 ~ 65535까지 필수 입력 입니다'
                              : 'You can enter from 0 to 65535',
                          min: {
                            value: 0,
                            message:
                              locale === 'ko'
                                ? '0 ~ 65535까지 입력 가능 합니다'
                                : 'You can enter from 0 to 65535',
                          },
                          max: {
                            value: 65535,
                            message:
                              locale === 'ko'
                                ? '0 ~ 65535까지 입력 가능 합니다'
                                : 'You can enter from 0 to 65535',
                          },
                        }}
                        render={({ field: { value, onChange } }) => (
                          <InputNumber
                            className="input"
                            placeholder={locale === 'ko' ? '가격 입력' : 'Enter the paymentAmount'}
                            value={value}
                            max={65535}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            onInput={
                              (text) => text.replace(/[^0-9.]/g, '') /*.replace(/(\..*)\./g, '$1')*/
                            }
                            onChange={onChange}
                          />
                        )}
                      />
                      {errors.paymentAmount?.message && (
                        <div className="form-message">
                          <span>{errors.paymentAmount.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                      <Controller
                        control={control}
                        name="vodRatioType"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목 입니다'
                              : 'This input is required',
                        }}
                        defaultValue={RatioType.Horizontal}
                        render={({ field: { value, onChange } }) => (
                          <Select value={value} onChange={onChange}>
                            {Object.keys(RatioType).map((data, index) => (
                              <Select.Option value={data.toUpperCase()} key={`type-${index}`}>
                                {locale === 'ko'
                                  ? data.toUpperCase() === RatioType.Horizontal
                                    ? '가로'
                                    : data.toUpperCase() === RatioType.Vertical
                                    ? '세로'
                                    : data
                                  : data}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.vodRatioType?.message && (
                        <div className="form-message">
                          <span>{errors.vodRatioType.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>
                        Live&nbsp;
                        <Tooltip
                          title={
                            <small>
                              {locale === 'ko'
                                ? '※ 이전 라이브에서 편집되어진 VOD일 경우.'
                                : 'If the VOD was edited from the previous live.'}{' '}
                            </small>
                          }
                          placement="right">
                          <QuestionCircleOutlined style={{ cursor: 'help', fontSize: 12 }} />
                        </Tooltip>
                      </span>
                      <Controller
                        control={control}
                        name="liveId"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            allowClear
                            showSearch
                            showArrow={false}
                            optionFilterProp="children"
                            value={value}
                            onChange={onChange}>
                            {liveData?.getLives.lives.map((live, index) => (
                              <Select.Option key={`live-${index}`} value={live._id}>
                                {live.title}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid col-3 merge gap-1 mt-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                      <Controller
                        control={control}
                        name="mainThumbnail"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목 입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Upload
                              name="mainThumbnail"
                              showUploadList={false}
                              maxCount={1}
                              accept=".jpg, .png, .jpeg"
                              onChange={(target) => {
                                if (target.file.originFileObj instanceof File) {
                                  const src = URL.createObjectURL(target.file.originFileObj)

                                  setThumbnailImg((prev) => ({ ...prev, src }))
                                }
                                return onChange(target)
                              }}
                              style={{ width: '100%' }}>
                              <Button
                                icon={<UploadOutlined />}
                                className="mt-half"
                                style={{ width: '100%' }}>
                                {locale === 'ko' ? '파일 선택 (최대: 1)' : 'Select File (Max: 1)'}
                              </Button>
                            </Upload>
                            {value && (value as any).fileList.length > 0 && (
                              <>
                                <Button
                                  type="primary"
                                  className="mt-half"
                                  onClick={() =>
                                    setThumbnailImg((prev) => ({ ...prev, isVisible: true }))
                                  }>
                                  {locale === 'ko' ? '이미지 미리보기' : 'Show image preview'}
                                </Button>
                                <Image
                                  width={200}
                                  style={{ display: 'none' }}
                                  src={thumbnailImg.src}
                                  preview={{
                                    visible: thumbnailImg.isVisible,
                                    src: thumbnailImg.src,
                                    onVisibleChange: (bol) =>
                                      setThumbnailImg((prev) => ({ ...prev, isVisible: bol })),
                                  }}
                                />
                              </>
                            )}
                          </>
                        )}
                      />
                      {errors.mainThumbnail?.message && (
                        <div className="form-message">
                          <span>{errors.mainThumbnail.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>
                        VOD&nbsp;
                        <Tooltip
                          title={
                            <small>
                              {locale === 'ko'
                                ? ' ※vod 최대 8개까지 추가할 수 있습니다. '
                                : ' ※Up to eight live can be uploaded. '}
                            </small>
                          }
                          placement="right">
                          <QuestionCircleOutlined style={{ cursor: 'help', fontSize: 12 }} />
                        </Tooltip>
                      </span>
                      <VodUploadContainer vodInfo={vodInfo} onVodChange={onVodChange} />
                      <List
                        className="vodInfoList"
                        locale={{
                          emptyText: locale === 'ko' ? '추가된 파일이 없습니다' : 'No file data',
                        }}
                        dataSource={vodInfo}
                        renderItem={(item, index) => (
                          <List.Item key={`vod-list-${index}`}>
                            <Button
                              onClick={onDeleteVod(index)}
                              icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                            />
                            <small>
                              {item.video instanceof File ? item.video.name : item.video}
                            </small>
                            <small>
                              {item.image instanceof File ? item.image.name : item.image}
                            </small>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid col-3 merge gap-1 mt-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '내용' : 'Content'}</span>
                      <Controller
                        control={control}
                        name="content"
                        render={({ field: { value, onChange } }) => (
                          <Input.TextArea
                            className="input"
                            placeholder={locale === 'ko' ? '내용 입력' : 'Please enter content'}
                            maxLength={1000}
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '지분' : 'Share'}</span>
                      <Button
                        type="dashed"
                        htmlType="button"
                        onClick={onAddMember}
                        style={{ width: '100%' }}>
                        <PlusOutlined />
                        {locale === 'ko' ? '추가' : 'Add'}
                      </Button>
                      {shareInfo.map((info, index) => (
                        <Fragment key={index}>
                          <ShareInfoGrid>
                            <div className="controller-content">
                              {shareInfo.length > 1 && shareInfo.length - 1 === index && (
                                <Button
                                  onClick={onDeleteShare(index)}
                                  icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                                />
                              )}
                              <Select
                                value={info.memberId}
                                onChange={(value) => {
                                  const { nickName, _id: memberId } = pick(
                                    memberData?.findMembersByType.members.find(
                                      (member) => member._id === value
                                    ),
                                    ['_id', 'nickName']
                                  )
                                  if (nickName && memberId) {
                                    setShareInfo((prev) => [
                                      ...prev.slice(0, index),
                                      { ...prev[index], nickName, memberId },
                                      ...prev.slice(index + 1, prev.length),
                                    ])
                                  } else {
                                    toast.error(
                                      locale === 'ko'
                                        ? '지분 회원 정보가 잘못 되었습니다'
                                        : 'Undefined share member info',
                                      {
                                        theme: localStorage.theme || 'light',
                                        autoClose: 750,
                                      }
                                    )
                                  }
                                }}>
                                {memberData?.findMembersByType.members.map((data, index) => (
                                  <Select.Option key={`member-${index}`} value={data._id}>
                                    {data.nickName}
                                  </Select.Option>
                                ))}
                              </Select>
                            </div>
                            <InputNumber
                              min={0}
                              max={100}
                              defaultValue={info.priorityShare}
                              onChange={(value: number) =>
                                setShareInfo((prev) => [
                                  ...prev.slice(0, index),
                                  { ...prev[index], priorityShare: value },
                                  ...prev.slice(index + 1, prev.length),
                                ])
                              }
                              onKeyPress={(e) => {
                                if (
                                  e.key === '.' ||
                                  e.key === 'e' ||
                                  e.key === '+' ||
                                  e.key === '-'
                                ) {
                                  e.preventDefault()
                                  return false
                                }
                              }}
                              addonBefore={locale === 'ko' ? '우선환수' : 'priority share'}
                              addonAfter={`%`}
                            />
                            <InputNumber
                              min={0}
                              max={100}
                              defaultValue={info.directShare}
                              onChange={(value: number) =>
                                setShareInfo((prev) => [
                                  ...prev.slice(0, index),
                                  { ...prev[index], directShare: value },
                                  ...prev.slice(index + 1, prev.length),
                                ])
                              }
                              onKeyPress={(e) => {
                                if (
                                  e.key === '.' ||
                                  e.key === 'e' ||
                                  e.key === '+' ||
                                  e.key === '-'
                                ) {
                                  e.preventDefault()
                                  return false
                                }
                              }}
                              addonBefore={locale === 'ko' ? '직분배' : 'direct share'}
                              addonAfter={`%`}
                            />
                          </ShareInfoGrid>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-item">
                  <div className="button-group">
                    <Link href="/vod/vods" locale={locale}>
                      <a>
                        <Button className="submit-button" type="primary" role="button">
                          {locale === 'ko' ? '목록' : 'List'}
                        </Button>
                      </a>
                    </Link>

                    <Button
                      type="primary"
                      role="button"
                      htmlType="submit"
                      className="submit-button"
                      disabled={
                        Object.keys(errors).length > 0 ||
                        shareInfo.findIndex((info) => !info.memberId) !== -1 ||
                        vodInfo.length < 1
                      }>
                      {locale === 'ko' ? '저장' : 'Save'}
                    </Button>
                  </div>
                </div>
              </Form>
            ) : (
              <Form>
                <div className="form-grid col-4 gap-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                </div>
                <div className="form-grid col-3 merge gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '15rem' }}
                  />
                </div>
                <div className="form-item">
                  <div className="button-group">
                    <Skeleton.Button size="large" active />
                    <Skeleton.Button size="large" active />
                  </div>
                </div>
              </Form>
            )}
          </Edit>
        </div>
      </MainWrapper>
      <LoadingOverlay states={loading} direction="column">
        <div className="container">
          {loading.isUploading && (
            <>
              <div className="progress">
                <small>Thumbnail</small>
                <Progress
                  type="line"
                  percent={thumbnailProgress.progress}
                  size="small"
                  status={thumbnailProgress.status}
                />
              </div>
              <div className="progress">
                <small>VOD images</small>
                <Progress
                  type="line"
                  percent={imageProgress.progress}
                  size="small"
                  status={imageProgress.status}
                />
              </div>
              <div className="progress">
                <small>VOD videos</small>
                <Progress
                  type="line"
                  percent={videoProgress.progress}
                  size="small"
                  status={videoProgress.status}
                />
              </div>
            </>
          )}
          {loading.isProcessing && (
            <div className="letter-holder">
              <div className="l-1 letter">L</div>
              <div className="l-2 letter">o</div>
              <div className="l-3 letter">a</div>
              <div className="l-4 letter">d</div>
              <div className="l-5 letter">i</div>
              <div className="l-6 letter">n</div>
              <div className="l-7 letter">g</div>
              <div className="l-8 letter">.</div>
              <div className="l-9 letter">.</div>
              <div className="l-10 letter">.</div>
            </div>
          )}
        </div>
      </LoadingOverlay>
    </Layout>
  )
}

export default CreateVod
