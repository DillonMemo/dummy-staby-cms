import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
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
  Segmented,
  Select,
  Skeleton,
  Tooltip,
  Upload,
} from 'antd'
import { omit, pick } from 'lodash'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getError } from '../../Common/commonFn'
import FileButton from '../../components/FileButton'

/** components */
import Layout from '../../components/Layout'
import LoadingOverlay from '../../components/LoadingOverlay'

/** graphql */
import {
  EditVodMutation,
  EditVodMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  FindVodByIdQuery,
  FindVodByIdQueryVariables,
  GetLivesQuery,
  GetLivesQueryVariables,
  MemberType,
  RatioType,
  TranscodeStatus,
  VodLinkInfo,
  VodStatus,
} from '../../generated'
import { EDIT_VOD_MUTATION } from '../../graphql/mutations'
import { FIND_MEMBERS_BY_TYPE_QUERY, GET_LIVES_QUERY, VOD_QUERY } from '../../graphql/queries'

/** utils */
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { ShareInfo, ShareInfoGrid, SkeletonStyle } from '../live/createLive'
import { ImgType, ProgressType, VodCreateForm, VodInfo } from './createVod'

type Props = styleMode

interface VodEditForm extends VodCreateForm {
  vodStatus: VodStatus
}

interface EditVodInfo extends VodInfo, Pick<VodLinkInfo, 'transcodeStatus'> {
  isEdit: boolean
  copyVideo?: File
  copyImage?: File
}

const VodDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push, query } = useRouter()

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
  const [vodInfo, setVodInfo] = useState<EditVodInfo[]>([])
  const [shareInfo, setShareInfo] = useState<ShareInfo[]>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 100 },
  ])

  const {
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<VodEditForm>({
    mode: 'onChange',
  })

  const { data: vodData, loading: isVodLoading } = useQuery<
    FindVodByIdQuery,
    FindVodByIdQueryVariables
  >(VOD_QUERY, {
    variables: {
      vodInput: {
        vodId: (query.id as string) || '',
      },
    },
    onCompleted: (data: FindVodByIdQuery) => {
      if (data.findVodById.ok) {
        const shareInfo = data.findVodById.vod?.vodShareInfo.memberShareInfo.map((info) =>
          omit(info, ['__typename'])
        )

        if (shareInfo) setShareInfo(shareInfo)
      }
    },
  })
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
  const [editVod] = useMutation<EditVodMutation, EditVodMutationVariables>(EDIT_VOD_MUTATION)

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
   * VOD를 수정하는 이벤트 핸들러 입니다
   * @param {EditVodInfo} item 아이템 객체
   * @param {number} index 배열 인덱스 번호
   * @param type 수정 상태
   * @returns
   */
  const onEditVod = (item: EditVodInfo, index: number, type: 'SAVE' | 'EDIT' | 'CLOSE') => () => {
    if (type !== 'SAVE') {
      delete item.copyImage
      delete item.copyVideo
      setVodInfo((prev) => [
        ...prev.slice(0, index),
        {
          ...prev[index],
          isEdit: !prev[index].isEdit,
        },
        ...prev.slice(index + 1, prev.length),
      ])
    } else {
      setVodInfo((prev) => [
        ...prev.slice(0, index),
        {
          ...prev[index],
          isEdit: !prev[index].isEdit,
          ...(item.copyImage && { image: item.copyImage }),
          ...(item.copyVideo && { video: item.copyVideo }),
        },
        ...prev.slice(index + 1, prev.length),
      ])
    }
  }

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

      console.log('submit', getValues(), vodInfo, shareInfo)

      setTimeout(() => {
        setLoading((prev) => ({ ...prev, isUploading: false }))
      }, 1000)
    } catch (error) {
      getError(error)
    }
  }

  useEffect(() => {
    if (!isVodLoading) {
      const vodInfo: EditVodInfo[] =
        vodData?.findVodById.vod?.vodLinkInfo.map((vod) => ({
          video: vod.linkPath,
          image: vod.introImageName,
          transcodeStatus: vod.transcodeStatus,
          isEdit: false,
        })) || []

      vodInfo && setVodInfo(vodInfo)
    }
  }, [isVodLoading])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'Vod 관리' : 'Vod Edit'}</h2>
          <ol>
            <li>
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: '/vod/vods',
                  query: { ...omit(query, 'id') },
                }}
                as={'/vod/vods'}
                locale={locale}>
                <a>{locale === 'ko' ? 'Vod' : 'Vod'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Vod 관리' : 'Vod Edit'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            {!isMemberLoading && !isLiveLoading && !isVodLoading ? (
              <Form name="editVodForm" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Controller
                    control={control}
                    key={vodData?.findVodById.vod?.vodStatus}
                    defaultValue={vodData?.findVodById.vod?.vodStatus}
                    name="vodStatus"
                    render={({ field: { value, onChange } }) => (
                      <Segmented
                        options={[
                          {
                            label: locale === 'ko' ? '등록대기' : VodStatus.Wait,
                            value: VodStatus.Wait,
                            disabled: true,
                          },
                          {
                            label: locale === 'ko' ? '판매가능' : VodStatus.Available,
                            value: VodStatus.Available,
                            disabled:
                              vodData?.findVodById.vod?.vodStatus === VodStatus.Fail ||
                              vodData?.findVodById.vod?.vodStatus === VodStatus.Delete,
                          },
                          {
                            label: locale === 'ko' ? '판매중' : VodStatus.Active,
                            value: VodStatus.Active,
                            disabled:
                              vodData?.findVodById.vod?.vodStatus === VodStatus.Fail ||
                              vodData?.findVodById.vod?.vodStatus === VodStatus.Delete,
                          },
                          {
                            label: locale === 'ko' ? '실패' : VodStatus.Fail,
                            value: VodStatus.Fail,
                            disabled: vodData?.findVodById.vod?.vodStatus !== VodStatus.Fail,
                          },
                        ]}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  {vodData?.findVodById.vod?.vodStatus === VodStatus.Delete && (
                    <p>
                      <small style={{ color: 'red' }}>
                        {locale === 'ko'
                          ? '삭제한 VOD는 수정이 불가능 합니다'
                          : 'Deleted VOD is edit unavailable'}
                      </small>
                    </p>
                  )}
                </div>
                <div className="form-grid col-4 gap-1 mt-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                      <Controller
                        control={control}
                        key={vodData?.findVodById.vod?.title}
                        defaultValue={vodData?.findVodById.vod?.title}
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
                        key={vodData?.findVodById.vod?.paymentAmount}
                        defaultValue={vodData?.findVodById.vod?.paymentAmount}
                        name="paymentAmount"
                        rules={{
                          required: true,
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
                        key={vodData?.findVodById.vod?.vodRatioType}
                        defaultValue={vodData?.findVodById.vod?.vodRatioType}
                        name="vodRatioType"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목 입니다'
                              : 'This input is required',
                        }}
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
                        key={vodData?.findVodById.vod?.liveId}
                        defaultValue={vodData?.findVodById.vod?.liveId || ''}
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
                        key={vodData?.findVodById.vod?.mainImageName}
                        defaultValue={vodData?.findVodById.vod?.mainImageName}
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
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
                            {value && (
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
                                  src={
                                    thumbnailImg.src ||
                                    `https://image.staby.co.kr/${
                                      process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
                                    }/going/vod/${vodData?.findVodById.vod?._id}/main/${value}`
                                  }
                                  preview={{
                                    visible: thumbnailImg.isVisible,
                                    src:
                                      thumbnailImg.src ||
                                      `https://image.staby.co.kr/${
                                        process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
                                      }/going/vod/${vodData?.findVodById.vod?._id}/main/${value}`,
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
                      <List
                        className="vodInfoList"
                        locale={{
                          emptyText: locale === 'ko' ? '추가된 파일이 없습니다' : 'No file data',
                        }}
                        dataSource={vodInfo}
                        renderItem={(item, index) => (
                          <List.Item
                            key={`vod-list-${index}`}
                            style={{ justifyContent: 'space-between', padding: '0 0.625rem' }}>
                            <div className={`empty ${item.isEdit && 'isEdit'}`}>
                              {item.isEdit ? (
                                <>
                                  <Button
                                    onClick={onEditVod(item, index, 'SAVE')}
                                    icon={<CheckOutlined style={{ fontSize: 16 }} />}
                                  />
                                  <Button
                                    onClick={onEditVod(item, index, 'CLOSE')}
                                    icon={<CloseOutlined style={{ fontSize: 16 }} />}
                                  />
                                </>
                              ) : (
                                <Button
                                  onClick={onEditVod(item, index, 'EDIT')}
                                  icon={<EditOutlined style={{ fontSize: 16 }} />}
                                />
                              )}
                            </div>
                            <div style={{ flex: '0 35%' }}>
                              {item.isEdit && item.transcodeStatus === TranscodeStatus.Fail ? (
                                <FileButton
                                  className="fileLabel"
                                  id={`videoFile-${index}`}
                                  name={`videoFile-${index}`}
                                  accept="video/mp4"
                                  paragraph={{
                                    first: 'Select Video',
                                    second:
                                      item.video instanceof File
                                        ? item.video.name
                                        : item.copyVideo instanceof File
                                        ? item.copyVideo.name
                                        : item.video,
                                  }}
                                  onChange={(event) => {
                                    const target = event.target as HTMLInputElement
                                    if (target.files && target.files.length > 0) {
                                      setVodInfo((prev) => [
                                        ...prev.slice(0, index),
                                        {
                                          ...prev[index],
                                          copyVideo: (target.files as FileList)[0],
                                        },
                                        ...prev.slice(index + 1, prev.length),
                                      ])
                                    }
                                  }}
                                />
                              ) : (
                                <>{item.video instanceof File ? item.video.name : item.video}</>
                              )}
                            </div>
                            <div style={{ flex: '0 35%' }}>
                              {item.isEdit ? (
                                <FileButton
                                  className="fileLabel"
                                  id={`imageFile-${index}`}
                                  name={`imageFile-${index}`}
                                  accept=".png, .jpeg, .jpg"
                                  paragraph={{
                                    first: 'Select Image',
                                    second:
                                      item.image instanceof File
                                        ? item.image.name
                                        : item.copyImage instanceof File
                                        ? item.copyImage.name
                                        : item.image,
                                  }}
                                  onChange={(event) => {
                                    const target = event.target as HTMLInputElement
                                    if (target.files && target.files.length > 0) {
                                      setVodInfo((prev) => [
                                        ...prev.slice(0, index),
                                        {
                                          ...prev[index],
                                          copyImage: (target.files as FileList)[0],
                                        },
                                        ...prev.slice(index + 1, prev.length),
                                      ])
                                    }
                                  }}
                                />
                              ) : (
                                <>{item.image instanceof File ? item.image.name : item.image}</>
                              )}
                            </div>
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
                        key={vodData?.findVodById.vod?.content}
                        defaultValue={vodData?.findVodById.vod?.content || ''}
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
                      <span>{locale == 'ko' ? '지분' : 'Share'}</span>
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
                        vodInfo.length < 1 ||
                        vodData?.findVodById.vod?.vodStatus === VodStatus.Delete
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
                <div className="form-grid col-3 merge gap-1 mt-1">
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '10rem' }}
                  />
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '10rem' }}
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

export default VodDetail
