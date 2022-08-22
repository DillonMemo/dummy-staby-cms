import { useMutation, useQuery } from '@apollo/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import {
  Badge,
  Button,
  DatePicker,
  Image,
  Input,
  InputNumber,
  Progress,
  Select,
  Skeleton,
  Tooltip,
  Upload,
} from 'antd'
import moment from 'moment'
import {
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { CSSProperties, Fragment, useState } from 'react'
import styled from 'styled-components'
import { delay, omit, pick } from 'lodash'
import { toast } from 'react-toastify'
import mongoose from 'mongoose'

/** components */
import Layout from '../../components/Layout'

/** graphql */
import {
  ChannelStatusMutation,
  ChannelStatusMutationVariables,
  CreateLiveMutation,
  CreateLiveMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  LiveChannelsQuery,
  LiveChannelsQueryVariables,
  LiveLinkInfo,
  MemberShareInfo,
  MemberType,
  RatioType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY, LIVE_CHANNELS } from '../../graphql/queries'
import { CHANNEL_STATUS_MUTATION, CREATE_LIVE_MUTATION } from '../../graphql/mutations'

/** utils */
import { delayedEntryTimeArr, getError, nowDateStr } from '../../Common/commonFn'
import { Edit, Form, MainWrapper, md, styleMode } from '../../styles/styles'
import { S3 } from '../../lib/awsClient'
import LoadingOverlay from '../../components/LoadingOverlay'

type Props = styleMode

export interface LiveCreateForm {
  title: string
  hostName: string
  paymentAmount: number
  liveRatioType: RatioType
  livePreviewDate: Date
  delayedEntryTime: number
  liveThumbnail: string
  content: string
  share: ShareInfo
}

export type PreviewImgType = {
  isVisible: boolean
  src?: string
  progress: number
  status: 'active' | 'success' | 'exception' | 'normal'
}
export type LiveInfo = Pick<LiveLinkInfo, 'linkPath' | 'listingOrder'> & {
  checked: boolean
  code: string
}
export type ShareInfo = Pick<
  MemberShareInfo,
  'memberId' | 'nickName' | 'priorityShare' | 'directShare'
>

const createLive: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    isUploading: false,
    isProcessing: false,
  })
  const [previewImg, setPreviewImg] = useState<PreviewImgType>({
    isVisible: false,
    progress: 0,
    status: 'normal',
  })
  const [liveInfo, setLiveInfo] = useState<LiveInfo[]>([])
  const [shareInfo, setShareInfo] = useState<ShareInfo[]>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 100 },
  ])

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LiveCreateForm>({ mode: 'onChange' })

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
  /** TheO 채널 목록 쿼리 */
  const { data: liveChannelsData, loading: isChannelLoading } = useQuery<
    LiveChannelsQuery,
    LiveChannelsQueryVariables
  >(LIVE_CHANNELS)
  const [createLive, { loading: isCreateLiveLoading }] = useMutation<
    CreateLiveMutation,
    CreateLiveMutationVariables
  >(CREATE_LIVE_MUTATION)
  /** 채널별 상태 정보 뮤테이션 */
  const [channelStatus, { loading: isChannelStatusLoading }] = useMutation<
    ChannelStatusMutation,
    ChannelStatusMutationVariables
  >(CHANNEL_STATUS_MUTATION)

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
   * 라이브 삭제 버튼 클릭 이벤트 핸들러 입니다.
   * @param {number} index row index number
   * @returns 라이브 삭제 성공 여부를 반환
   */
  const onDeleteLive = (index: number) => () =>
    setLiveInfo((prev) => [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)])

  /**
   * 지분 삭제 버튼 클릭 이벤트 핸들러 입니다.
   * @param {number} index
   * @returns 지분 삭제 성공 여부를 반환
   */
  const onDeleteShare = (index: number) => () =>
    setShareInfo((prev) => [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)])

  /**
   * 채널 추가 이벤트 핸들러 입니다.
   * @param {string} value select option value
   */
  const onChangeChannel = async (value: string) => {
    try {
      const { data } = await channelStatus({
        variables: {
          channelStatusInput: {
            channelId: value,
          },
        },
      })

      if (!data?.channelStatus.ok) {
        const message =
          locale === 'ko' ? data?.channelStatus.error?.ko : data?.channelStatus.error?.en
        throw new Error(message)
      } else {
        setLiveInfo((prev) => [
          ...prev,
          {
            listingOrder: prev.length,
            linkPath: value,
            checked: !(
              data.channelStatus.code === 'stopped' || data.channelStatus.code === 'stopping'
            ),
            code: data.channelStatus.code || 'unauthorized',
          },
        ])
      }
    } catch (error) {
      getError(error)
    }
  }

  /**
   * 최종 저장 버튼 이벤트 핸들러
   */
  const onSubmit = () => {
    setLoading((prev) => ({ ...prev, isUploading: true }))
    const { liveThumbnail, livePreviewDate } = getValues()

    if (moment(livePreviewDate) <= moment().endOf('hour'))
      return toast.error(
        locale === 'ko'
          ? 'Live 시작 예정 시간이 현재시간이거나 이전시간 입니다'
          : 'The scheduled time to start the live is the current time or the previous time',
        {
          theme: localStorage.theme || 'light',
          autoClose: 750,
          onClose: () => {
            setValue('livePreviewDate', new Date())
            setLoading({ isUploading: false, isProcessing: false })
          },
        }
      )
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

    // Thumbnail 이미지 업로드
    const objectId = new mongoose.Types.ObjectId().toString()
    let mainImgFileName = ''

    if ((liveThumbnail as any).file.originFileObj instanceof File) {
      const file = (liveThumbnail as any).file.originFileObj as File
      const fileExtension = file.name.split('.')[file.name.split('.').length - 1]
      const fileName = `${objectId}_main_${nowDateStr}.${fileExtension}`

      mainImgFileName = `${
        process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
      }/going/live/${objectId}/main/${fileName}`

      process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
        S3.upload(
          {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: mainImgFileName,
            Body: (liveThumbnail as any).file.originFileObj,
            ACL: 'public-read',
          },
          (error: Error) => {
            if (error) {
              return toast.error(
                locale === 'ko'
                  ? `파일 업로드 오류: ${error}`
                  : `There was an error uploading your file: ${error}`,
                {
                  theme: localStorage.theme || 'light',
                  autoClose: 750,
                  onClose: () => setLoading({ isUploading: false, isProcessing: false }),
                }
              )
            }

            return delay(() => {
              setLoading({ isUploading: false, isProcessing: true })
              onMutation(objectId, fileName)
            }, 750)
            // return
          }
        ).on('httpUploadProgress', (progress) => {
          const progressPercentage = Math.round((progress.loaded / progress.total) * 100)

          if (progressPercentage < 100) {
            setPreviewImg((prev) => ({ ...prev, status: 'active', progress: progressPercentage }))
          } else if (progressPercentage === 100) {
            setPreviewImg((prev) => ({
              ...prev,
              status: 'success',
              progress: progressPercentage,
            }))
          }
        })
    }
  }

  /**
   * graphql 호출 이벤트 핸들러 입니다.
   * @param {String} _id entity id
   * @param {String} fileName upload file name
   * @return mutation 호출 성공 여부를 반환 합니다
   */
  const onMutation = async (_id: string, fileName: string) => {
    try {
      const {
        delayedEntryTime,
        hostName,
        liveRatioType,
        livePreviewDate,
        content,
        paymentAmount,
        title,
      } = getValues()

      const { data } = await createLive({
        variables: {
          createLiveInput: {
            _id,
            mainImageName: fileName,
            delayedEntryTime,
            hostName,
            liveRatioType,
            liveLinkInfo: liveInfo.map((info) => omit(info, ['checked', 'code'])),
            liveShareInfo: {
              liveId: _id,
              memberShareInfo: shareInfo,
            },
            livePreviewDate: new Date(livePreviewDate),
            content,
            paymentAmount,
            title,
          },
        },
      })

      if (!data?.createLive.ok) {
        const message = locale === 'ko' ? data?.createLive.error?.ko : data?.createLive.error?.en
        throw new Error(message)
      } else {
        setLoading({ isUploading: false, isProcessing: false })
        toast.success(locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 750,
          onClose: () => push('/live/lives'),
        })
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
          <h2>{locale === 'ko' ? 'Live 추가' : 'Live Create'}</h2>
          <ol>
            <li>
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link href="/live/lives" locale={locale}>
                <a>{locale === 'ko' ? 'Live' : 'Live'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Live 추가' : 'Create Live'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            {!isMemberLoading && !isChannelLoading ? (
              <Form name="createLiveForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid col-3 gap-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                      <Controller
                        control={control}
                        name="title"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
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
                      <span>{locale === 'ko' ? '주최자' : 'HostName'}</span>
                      <Controller
                        control={control}
                        name="hostName"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            className="input"
                            placeholder={locale === 'ko' ? '주최자 입력' : 'Enter the hostName'}
                            value={value}
                            onChange={onChange}
                            maxLength={50}
                          />
                        )}
                      />
                      {errors.hostName?.message && (
                        <div className="form-message">
                          <span>{errors.hostName.message}</span>
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
                </div>
                <div className="form-grid col-3 gap-1 mt-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                      <Controller
                        control={control}
                        name="liveRatioType"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
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
                      {errors.liveRatioType?.message && (
                        <div className="form-message">
                          <span>{errors.liveRatioType.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-item">
                    <div className="form-group">
                      <span>
                        {locale === 'ko' ? 'Live 시작 예정 시간' : 'Live estimated start date'}
                      </span>
                      <Controller
                        control={control}
                        name="livePreviewDate"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            disabledDate={(current) => current && current <= moment().endOf('hour')}
                            showTime={{ defaultValue: moment('00:00', 'HH:mm'), format: 'HH:mm' }}
                            value={moment(value).isValid() ? moment(value) : undefined}
                            onChange={onChange}
                            allowClear
                          />
                        )}
                      />
                      {errors.livePreviewDate?.message && (
                        <div className="form-message">
                          <span>{errors.livePreviewDate.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>
                        {locale === 'ko' ? '시작 후 구매가능 시간' : 'Set the purchase time'}
                      </span>
                      <Controller
                        control={control}
                        name="delayedEntryTime"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            value={value}
                            onChange={onChange}
                            placeholder={
                              locale === 'ko'
                                ? '라이브 시작 시간 이후'
                                : 'After the live start time'
                            }>
                            <Select.Option value={0} key={'start'}>
                              {locale === 'ko' ? '구매불가' : 'Unable to purchase'}
                            </Select.Option>
                            {delayedEntryTimeArr.map((time, index) => (
                              <Select.Option value={time} key={index}>
                                {time}
                                {locale === 'ko' ? '분' : 'min'}
                              </Select.Option>
                            ))}
                            <Select.Option value={999} key={'end'}>
                              {locale === 'ko' ? '라이브 종료까지' : 'Until the end of the live'}
                            </Select.Option>
                          </Select>
                        )}
                      />
                      {errors.delayedEntryTime?.message && (
                        <div className="form-message">
                          <span>{errors.delayedEntryTime.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-grid col-3 merge gap-1 mt-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                      <Controller
                        control={control}
                        name="liveThumbnail"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Upload
                              name="liveThumbnail"
                              showUploadList={false}
                              maxCount={1}
                              accept=".jpg, .png, .jpeg"
                              onChange={(target) => {
                                if (target.file.originFileObj instanceof File) {
                                  const src = URL.createObjectURL(target.file.originFileObj)

                                  setPreviewImg((prev) => ({ ...prev, src }))
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
                                    setPreviewImg((prev) => ({ ...prev, isVisible: true }))
                                  }>
                                  {locale === 'ko' ? '이미지 미리보기' : 'Show image preview'}
                                </Button>
                                <Image
                                  width={200}
                                  style={{ display: 'none' }}
                                  src={previewImg.src}
                                  preview={{
                                    visible: previewImg.isVisible,
                                    src: previewImg.src,
                                    onVisibleChange: (bol) =>
                                      setPreviewImg((prev) => ({ ...prev, isVisible: bol })),
                                  }}
                                />
                              </>
                            )}
                          </>
                        )}
                      />
                      {errors.liveThumbnail?.message && (
                        <div className="form-message">
                          <span>{errors.liveThumbnail.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-item">
                    <div className="form-group">
                      <InlineFlexContainer>
                        <span>
                          Live&nbsp;
                          <Tooltip
                            title={
                              <small>
                                {locale === 'ko'
                                  ? '※ live는 최대 8개까지 추가할 수 있습니다.'
                                  : '※ Can add up to 8 Live.'}
                              </small>
                            }
                            placement="right">
                            <QuestionCircleOutlined style={{ cursor: 'help', fontSize: 12 }} />
                          </Tooltip>
                        </span>
                      </InlineFlexContainer>
                    </div>
                    <LiveInfoGrid>
                      <div className="header">
                        <div>&nbsp;</div>
                        <div>{locale === 'ko' ? '채널' : 'Channel'}</div>
                        <div>{locale === 'ko' ? '경로' : 'Path'}</div>
                        <div className="controller-content">
                          {locale === 'ko' ? '채널 상태' : 'Channel Status'}{' '}
                        </div>
                      </div>
                      {liveInfo.map((info, index) => (
                        <div key={`ch-${index}`}>
                          <div>
                            <Button
                              onClick={onDeleteLive(index)}
                              icon={<DeleteOutlined style={{ fontSize: 16 }} />}
                            />
                          </div>
                          <div>
                            <small>CH {index + 1}</small>
                          </div>
                          <div>
                            <span>
                              {
                                liveChannelsData?.liveChannels.liveChannels?.find(
                                  (channel) => channel.channelId === info.linkPath
                                )?.name
                              }
                            </span>
                          </div>
                          <div className="controller-content">
                            <Badge
                              className="channel-status"
                              {...(info.code === 'stopped'
                                ? { status: 'error', text: <span>{info.code}</span> }
                                : info.code === 'playing'
                                ? { status: 'processing', text: <span>{info.code}</span> }
                                : info.code === 'waiting'
                                ? { status: 'success', text: <span>{info.code}</span> }
                                : { status: 'warning', text: <span>{info.code}</span> })}
                            />
                          </div>
                        </div>
                      ))}
                      {liveInfo.length < 8 && (
                        <div>
                          <div></div>
                          <div>
                            <small>CH {liveInfo.length + 1}</small>
                          </div>
                          <div>
                            <Select
                              className="live-channels"
                              placeholder={locale === 'ko' ? '라이브 선택' : 'Choose Live'}
                              bordered={false}
                              loading={isChannelStatusLoading}
                              disabled={isChannelStatusLoading}
                              value={null}
                              onChange={onChangeChannel}
                              style={{ width: '100%' }}>
                              {liveChannelsData?.liveChannels.liveChannels
                                ?.map((channel) => pick(channel, ['channelId', 'name']))
                                .sort((x, y) => {
                                  const a = x.name.toUpperCase(),
                                    b = y.name.toUpperCase()

                                  return a === b ? 0 : a > b ? 1 : -1
                                })
                                .map((channel, index) => (
                                  <Select.Option
                                    key={`channel-${index}`}
                                    value={channel.channelId}
                                    // disabled={
                                    //   liveInfo.findIndex(
                                    //     (info) => info.linkPath === channel.channelId
                                    //   ) !== -1
                                    // }
                                  >
                                    {channel.name}
                                  </Select.Option>
                                ))}
                            </Select>
                          </div>
                          <div>
                            {liveInfo.length < 1 && (
                              <div className="form-message">
                                <small>
                                  {locale === 'ko'
                                    ? '최소 1개 채널은 필수 입니다'
                                    : 'At least 1 channel is required'}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </LiveInfoGrid>
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
                      <InlineFlexContainer>
                        <span>{locale === 'ko' ? '지분' : 'Share'}</span>
                      </InlineFlexContainer>
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
                          {!info.memberId && (
                            <div className="form-message">
                              <span>
                                {locale === 'ko'
                                  ? '위 항목은 필수 항목입니다'
                                  : 'This input is required'}
                              </span>
                            </div>
                          )}
                        </Fragment>
                      ))}
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
                      disabled={
                        Object.keys(errors).length > 0 ||
                        shareInfo.findIndex((info) => !info.memberId) !== -1 ||
                        liveInfo.length < 1
                      }
                      loading={isCreateLiveLoading}>
                      {locale === 'ko' ? '저장' : 'Save'}
                    </Button>
                  </div>
                </div>
              </Form>
            ) : (
              <Form>
                <div>
                  <Skeleton.Button active style={{ minWidth: '13rem' }} />
                </div>
                <div className="form-grid col-3 gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                </div>
                <div className="form-grid col-3 gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                </div>
                <div className="form-grid col-3 merge gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '10rem' }}
                  />
                </div>
                <div className="form-grid col-3 merge gap-1 mt-1">
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '15rem' }}
                  />
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '8rem' }}
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
                percent={previewImg.progress}
                size="small"
                status={previewImg.status}
              />
            </div>
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

export const SkeletonStyle: CSSProperties = { width: '100%', minHeight: '3.714rem' }

export const InlineFlexContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 0.5rem;

  ${md} {
    padding: 1rem 0;
  }
`

export const LiveInfoGrid = styled.div`
  > div.header {
    > div {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      &.controller-content {
        margin-right: 1rem;

        ${md} {
          display: block;
          text-align: end;
          margin-right: 0.625rem;
        }
      }
    }
  }
  > div:not(.ant-skeleton) {
    min-height: 2rem;
    line-height: 1.5715;
    display: grid;
    grid-template-columns: 2rem 5rem 1fr 1fr;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.border};

    ${md} {
      grid-template-columns: 2rem 2.25rem 2fr 1fr;
    }

    .controller-content {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      ${md} {
        gap: 1rem;
      }

      .ant-skeleton-badge {
        width: 5rem;

        ${md} {
          width: 4rem;
        }
      }
    }
  }

  > div.ant-skeleton {
    margin: 0.75rem 0;
    padding: 0 0.5rem;
  }
`

export const ShareInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 10rem 1fr 1fr auto;
  align-items: center;
  gap: 0.5rem;

  min-height: 2rem;
  line-height: 1.5715;
  margin-top: 0.6725rem;

  ${md} {
    grid-template-columns: 1fr;
    gap: 0;
  }

  & + & {
    margin-top: 0.6725rem;
  }

  .controller-content {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;

    .ant-select {
      width: 100%;
    }
  }

  .ant-input-number-group-wrapper {
    ${md} {
      margin-top: 0.5rem;
    }
    .ant-input-number {
      .ant-input-number-input {
        border-radius: 0;
      }
    }
    .ant-input-number-wrapper.ant-input-number-group {
      .ant-input-number-group-addon {
        &:first-child {
          min-width: 8rem;
          border-top-left-radius: 0.428rem;
          border-bottom-left-radius: 0.428rem;
        }

        &:last-child {
          border-top-right-radius: 0.428rem;
          border-bottom-right-radius: 0.428rem;
        }
      }
    }
  }
`

export default createLive
