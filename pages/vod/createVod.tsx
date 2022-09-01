import { DeleteOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@apollo/client'
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
import mongoose from 'mongoose'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { nowDateStr } from '../../Common/commonFn'

/** components */
import Layout from '../../components/Layout'
import LoadingOverlay from '../../components/LoadingOverlay'
import VodUploadContainer from '../../components/vod/VodUploadContainer'

/** graphql */
import { GetLivesQuery, GetLivesQueryVariables, RatioType } from '../../generated'
import { GET_LIVES_QUERY } from '../../graphql/queries'
import { S3 } from '../../lib/awsClient'

/** utils */
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { ShareInfo, SkeletonStyle } from '../live/createLive'

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
  const { locale } = useRouter()

  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    isUploading: false,
    isProcessing: false,
  })
  const [progress, setProgress] = useState<ProgressType>({
    progress: 0,
    status: 'normal',
  })
  const [thumbnailImg, setThumbnailImg] = useState<ImgType>({
    isVisible: false,
  })
  const [vodInfo, setVodInfo] = useState<VodInfo[]>([])

  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<VodCreateForm>({ mode: 'onChange' })

  const { data: liveData, loading: isLiveLoading } = useQuery<
    GetLivesQuery,
    GetLivesQueryVariables
  >(GET_LIVES_QUERY)

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
   * 최종 저장 버튼 이벤트 핸들러
   */
  const onSubmit = () => {
    setLoading((prev) => ({ ...prev, isUploading: true }))
    const { mainThumbnail } = getValues()

    const objectId = new mongoose.Types.ObjectId().toString()
    /** File 업로드 영역 - 1 */
    if ((mainThumbnail as any).file.originFileObj instanceof File) {
      const file = (mainThumbnail as any).file.originFileObj as File
      const fileExtension = file.name.split('.')[file.name.split('.').length - 1]
      const fileName = `${objectId}_main_${nowDateStr}.${fileExtension}`
      console.log(file)

      process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
        S3.upload({
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: `${
            process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
          }/going/vod/${objectId}/main/${fileName}`,
          Body: file,
          ACL: 'public-read',
        }).on('httpUploadProgress', (progress) => {
          // do something...
        })
    }
    /** File 업로드 영역 - 2 */
    vodInfo.forEach((info, index) => {
      if (info.video instanceof File && info.image instanceof File) {
        const { video, image } = info
        const [videoFileExtension, imageFileExtension] = [
          video.name.split('.')[video.name.split('.').length - 1],
          image.name.split('.')[image.name.split('.').length - 1],
        ]
        const [videoFileName, imageFileName] = [
          `${objectId}_${index + 1}_${nowDateStr}.${videoFileExtension}`,
          `${objectId}_intro_${index + 1}_${nowDateStr}.${imageFileExtension}`,
        ]

        console.log(videoFileExtension, imageFileExtension)
      }
    })

    setTimeout(() => setLoading((prev) => ({ ...prev, isUploading: false })), 20000)
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
            {!isLiveLoading ? (
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
                          <List.Item>
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

                <div className="form-item">
                  <div className="button-group">
                    <Link href="/live/lives" locale={locale}>
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
                      disabled={Object.keys(errors).length > 0}>
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
      <LoadingOverlay states={loading}>
        <div className="container">
          {loading.isUploading && (
            <div className="progress">
              <Progress
                type="circle"
                percent={progress.progress}
                size="small"
                status={progress.status}
              />
            </div>
          )}
        </div>
      </LoadingOverlay>
    </Layout>
  )
}

export default CreateVod
