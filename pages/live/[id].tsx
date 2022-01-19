import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, DatePicker, Input, notification, Popover, Radio, Select, Upload } from 'antd'

import { UploadChangeParam } from 'antd/lib/upload'
import { UploadRequestOption } from 'rc-upload/lib/interface'

import Link from 'next/link'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import TextArea from 'rc-textarea'
import moment from 'moment'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import ImgCrop from 'antd-img-crop'
import { useLazyQuery, useMutation } from '@apollo/client'
import { DELETE_LIVE_MUTATION, EDIT_LIVE_MUTATION } from '../../graphql/mutations'
import {
  DeleteLiveMutation,
  DeleteLiveMutationVariables,
  EditLiveMutation,
  EditLiveMutationVariables,
  FindLiveByIdQuery,
  FindLiveByIdQueryVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  LiveStatus,
  MemberType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY, LIVE_QUERY } from '../../graphql/queries'

import { S3 } from '../../lib/awsClient'
import { delayedEntryTimeArr, nowDateStr, onDeleteBtn, shareCheck } from '../../Common/commonFn'
import { omit } from 'lodash'

type Props = styleMode

export interface LiveCreateForm {
  title: string
  hostName: string
  paymentAmount: number
  livePreviewDate: Date | any
  liveThumbnail: string
  delayedEntryTime: number
  content?: string
  share: ShareInfo
}

export type ShareInfo = {
  memberId: string
  nickName: string
  priorityShare: number
  directShare: number
}

export type MainImgInfo = {
  fileInfo: Blob | string
  mainImg?: string | any
}

export type LiveInfoArr = {
  listingOrder?: number
  linkPath?: string | null
}

const ShareWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
`

const ImgUploadBtnWrap = styled.div`
  position: relative;

  .uploadBtn {
    position: absolute;
    width: 100%;
    height: 2.714rem;
    top: 5px;
    right: 0px;
    z-index: 2;
  }
`

const LiveDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const router = useRouter()
  const { locale } = useRouter()
  const [liveInfoArr, setLiveInfoArr] = useState<Array<LiveInfoArr>>([
    { listingOrder: 0, linkPath: '' },
  ]) //링크 관리
  const [mainImgInfo, setMainImgInfo] = useState<MainImgInfo>({ mainImg: '', fileInfo: '' }) //mainImg 관리
  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [isAuto, setIsAuto] = useState('Auto') //라이브 링크 자동생성 수동생성

  const {
    getValues,
    formState: { errors },
    control,
  } = useForm<LiveCreateForm>({
    mode: 'onChange',
  })

  const liveStatus = ['Hide', 'Display', 'Active', 'Finish'] //라이브 상태

  //현재 라이브 아이디
  const liveId = router.query.id ? router.query.id?.toString() : ''

  //지분 설정을 위한 멤버 쿼리
  const [getMember, { data: memberData }] = useLazyQuery<
    FindMembersByTypeQuery,
    FindMembersByTypeQueryVariables
  >(FIND_MEMBERS_BY_TYPE_QUERY)

  //라이브 쿼리
  const [getLive, { data: liveData, refetch: refreshMe }] = useLazyQuery<
    FindLiveByIdQuery,
    FindLiveByIdQueryVariables
  >(LIVE_QUERY)

  //라이브 상태
  const [statusRadio, setStatusRadio] = useState(
    liveData?.findLiveById.live ? liveData?.findLiveById.live.liveStatus : 'Hide'
  )

  //인풋 상태
  const [isInputDisabled, setIsInputDisabled] = useState(false)

  const onCompleted = async (data: EditLiveMutation) => {
    const {
      editLive: { ok },
    } = data

    if (ok && liveData && refreshMe) {
      await refreshMe()
    }
  }

  const [editLive, { loading: editLoading }] = useMutation<
    EditLiveMutation,
    EditLiveMutationVariables
  >(EDIT_LIVE_MUTATION, { onCompleted })

  const [deleteLive] = useMutation<DeleteLiveMutation, DeleteLiveMutationVariables>(
    DELETE_LIVE_MUTATION
  )

  //라이브 삭제
  const liveDelete = async () => {
    const { data } = await deleteLive({
      variables: {
        deleteLiveInput: {
          liveId,
        },
      },
    })

    if (!data?.deleteLive.ok) {
      const message = locale === 'ko' ? data?.deleteLive.error?.ko : data?.deleteLive.error?.en
      notification.error({
        message,
      })
      throw new Error(message)
    } else {
      notification.success({
        message: locale === 'ko' ? '삭제가 완료 되었습니다.' : 'Has been completed',
      })

      setTimeout(() => {
        window.location.href = '/live/lives'
      }, 500)
    }
  }

  //라이브 채널 추가 버튼
  const onAddLive = (type: string) => {
    if (type === 'live') {
      const live = {
        listingOrder: 0,
        linkPath: '',
      }
      if (liveInfoArr.length < 8) {
        setLiveInfoArr(() => liveInfoArr.concat(live))
      }
      return
    }

    if (type === 'member') {
      const member = {
        memberId: '',
        nickName: '',
        priorityShare: 0,
        directShare: 0,
      }
      setMemberShareInfo(() => memberShareInfo.concat(member))

      return
    }
  }

  const onSubmit = async () => {
    try {
      const { title, hostName, paymentAmount, delayedEntryTime, livePreviewDate, content } =
        getValues()

      //memberShareData 유효성 확인, 100이 되야한다.
      if (!shareCheck(memberShareInfo, locale)) {
        return
      }

      //메인 이미지 s3 업로드
      const id = liveData?.findLiveById.live ? liveData?.findLiveById.live?._id : ''
      let mainImgFileName = '' //메인 썸네일
      const nowDate = `${id.toString()}_main_${nowDateStr}.png`

      mainImgFileName = `${
        process.env.NODE_ENV === 'development' ? 'dev' : 'dev'
      }/going/live/${id.toString()}/main/${nowDate}`

      //MainThumbnail upload
      if (mainImgInfo.fileInfo instanceof File) {
        process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
          (await S3.upload({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: mainImgFileName,
            Body: mainImgInfo.fileInfo,
            ACL: 'public-read',
          }).promise())

        mainImgFileName = nowDate
      } else {
        mainImgFileName = `${liveData?.findLiveById.live?.mainImageName}`
      }

      //라이브 채널 링크 배열
      const liveLinkArr = []
      for (let i = 0; i < liveInfoArr.length; i++) {
        const liveUrlInput: HTMLInputElement | null = document.querySelector(
          `input[name=liveUrl_${i}]`
        )
        if (liveUrlInput) {
          liveLinkArr.push({
            listingOrder: i + 1,
            linkPath: isAuto ? liveUrlInput.value.replace(`{LIVEID}`, id) : liveUrlInput.value, //자동생성인 경우 Replace, 수동생성인 경우 value 값을 그대로 넣어준다.})
          })
        }
      }

      const { data } = await editLive({
        variables: {
          editLiveInput: {
            _id: id,
            mainImageName: mainImgFileName,
            liveStatus: (LiveStatus as any)[statusRadio],
            delayedEntryTime,
            hostName,
            liveLinkInfo: liveLinkArr,
            liveShareInfo: {
              liveId: id,
              memberShareInfo,
            },
            livePreviewDate: livePreviewDate
              ? new Date(livePreviewDate._d)
              : liveData?.findLiveById.live?.livePreviewDate,
            content,
            paymentAmount: parseFloat(paymentAmount.toString()),
            title,
          },
        },
      })
      if (!data?.editLive.ok) {
        const message = locale === 'ko' ? data?.editLive.error?.ko : data?.editLive.error?.en
        notification.error({
          message,
        })
        throw new Error(message)
      } else {
        notification.success({
          message: locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed',
        })
        setTimeout(() => {
          location.reload()
        }, 500)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * @returns {Promise<void>} JSX element를 리턴 합니다.
   */
  const renderPopoverContent = () => {
    const Wrapper = styled.div`
      display: inline-flex;
      button {
        border: 1px solid ${({ theme }) => theme.border};
      }
    `
    /**
     * upload file change 이전에 해당 함수를 실행합니다.
     * @param {UploadRequestOption} params 커스텀 요청 옵션
     */

    const customRequest = async ({ file, onError, onSuccess }: UploadRequestOption) => {
      try {
        const defineOnSuccess = onSuccess as any
        if (file instanceof File) {
          const src: string = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file as Blob)
            reader.onload = () => resolve(reader.result as string)
          })
          //const profileNode: HTMLElement | null = dom

          if (src) {
            //profileNode.src = src
            defineOnSuccess(file)
          } else {
            throw new Error('not found profileNode or src or originFileObj')
          }
        } else {
          throw new Error('not found file')
        }
      } catch (error: any) {
        console.error(error)
        onError && onError(error)
      }
    }

    /**
     * upload > customRequest > onProfileChange 순서의 함수 로직입니다.
     * @param {UploadChangeParam} params file Obj를 가져옵니다.
     */
    const onProfileChange = ({ file }: UploadChangeParam) => {
      const fileInput: HTMLInputElement | null = document.querySelector('input[name=mainImgInput]')

      if (file.originFileObj && fileInput) {
        setMainImgInfo({ fileInfo: file.originFileObj, mainImg: file.originFileObj.name })
        fileInput.value = file.originFileObj.name
      }
    }
    /**
     * profile을 비우는 클릭 이벤트 핸들러 입니다.
     */
    const onRemoveProfileClick = () => {
      const fileInput: HTMLInputElement | null = document.querySelector('input[name=mainImgInput]')

      if (fileInput) {
        setMainImgInfo({ fileInfo: '', mainImg: '' })
        fileInput.value = ''
      }
    }

    return (
      <Wrapper>
        <ImgCrop
          shape="rect"
          modalTitle={locale === 'ko' ? '이미지 편집' : 'Edit image'}
          modalOk={locale === 'ko' ? '확인' : 'OK'}
          modalCancel={locale === 'ko' ? '취소' : 'Cancel'}
          aspect={1 / 1.25}>
          <Upload
            accept="image/*"
            multiple={false}
            customRequest={customRequest}
            onChange={onProfileChange}
            showUploadList={false}>
            <Button>{locale === 'ko' ? '사진 업로드' : 'Upload a photo'}</Button>
          </Upload>
        </ImgCrop>
        <Button onClick={onRemoveProfileClick}>
          {locale === 'ko' ? '사진 삭제' : 'Remove photo'}
        </Button>
      </Wrapper>
    )
  }

  useEffect(() => {
    getMember({
      variables: {
        membersByTypeInput: {
          memberType: MemberType.Business,
        },
      },
    })
  }, [memberData])

  useEffect(() => {
    getLive({
      variables: {
        liveInput: {
          liveId,
        },
      },
    })

    if (
      liveData?.findLiveById.ok &&
      liveData?.findLiveById.live?.liveLinkInfo &&
      liveData?.findLiveById.live?.liveShareInfo.memberShareInfo
    ) {
      const infoResult = liveData?.findLiveById.live?.liveLinkInfo.map((data) => {
        return omit(data, ['playingImageName', '__typename'])
      }) //liveInfoArr result
      const result = liveData?.findLiveById.live?.liveShareInfo.memberShareInfo.map((data) => {
        return omit(data, ['__typename'])
      }) //memberShareInfo result

      setMainImgInfo({
        ...mainImgInfo,
        mainImg: liveData?.findLiveById.live?.mainImageName,
      })
      setLiveInfoArr(infoResult)
      setMemberShareInfo(result)
      setIsInputDisabled(liveData?.findLiveById.live?.liveStatus !== 'HIDE' && true)
    }
  }, [liveData])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'Live 관리' : 'Live Edit'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Live' : 'Live'}</li>
            <li>{locale === 'ko' ? 'Live 관리' : 'Live Edit'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form name="createLiveForm">
              <Radio.Group
                defaultValue={liveData?.findLiveById.live?.liveStatus
                  .toLowerCase()
                  .replace(/^./, liveData?.findLiveById.live?.liveStatus[0].toUpperCase())}
                key={liveData?.findLiveById.live?.liveStatus}
                buttonStyle="solid">
                {liveStatus.map((data, i) => {
                  return (
                    <Radio.Button
                      key={i}
                      value={data}
                      onChange={() => setStatusRadio(data)}
                      disabled={data === 'Hide' && isInputDisabled}>
                      {data}
                    </Radio.Button>
                  )
                })}
              </Radio.Group>
              <div className="form-item">
                <div className="form-group">
                  <span>Title</span>
                  <Controller
                    key={liveData?.findLiveById.live?.title}
                    defaultValue={liveData?.findLiveById.live?.title}
                    control={control}
                    name="title"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="Please enter the title."
                        value={value}
                        onChange={onChange}
                        disabled={isInputDisabled}
                        maxLength={100}
                      />
                    )}
                  />
                </div>
                {errors.title?.message && (
                  <div className="form-message">
                    <span>{errors.title.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>HostName</span>
                  <Controller
                    key={liveData?.findLiveById.live?.hostName}
                    defaultValue={liveData?.findLiveById.live?.hostName}
                    control={control}
                    name="hostName"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="Please enter the hostName."
                        value={value}
                        onChange={onChange}
                        disabled={isInputDisabled}
                        maxLength={20}
                      />
                    )}
                  />
                </div>
                {errors.hostName?.message && (
                  <div className="form-message">
                    <span>{errors.hostName.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>Price</span>
                  <Controller
                    key={liveData?.findLiveById.live?.paymentAmount}
                    defaultValue={liveData?.findLiveById.live?.paymentAmount}
                    control={control}
                    name="paymentAmount"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        type="number"
                        className="input"
                        placeholder="Please enter the paymentAmount."
                        value={value}
                        onChange={onChange}
                        disabled={isInputDisabled}
                      />
                    )}
                  />
                </div>

                {errors.paymentAmount?.message && (
                  <div className="form-message">
                    <span>{errors.paymentAmount.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>Estimated start date</span>
                  <Controller
                    control={control}
                    name="livePreviewDate"
                    key={liveData?.findLiveById.live?.livePreviewDate}
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        key={liveData?.findLiveById.live?.livePreviewDate}
                        defaultValue={moment(
                          liveData?.findLiveById.live?.livePreviewDate
                            .toString()
                            .replace('T', ',')
                            .substring(0, 19),
                          'YYYY-MM-DD,HH:mm'
                        )}
                        showTime={{
                          defaultValue: moment('00:00', 'HH:mm'),
                          format: 'HH:mm',
                        }}
                        value={value}
                        onChange={onChange}
                        disabled={isInputDisabled}
                      />
                    )}
                  />
                </div>
                {errors.livePreviewDate?.message && (
                  <div className="form-message">
                    <span>{errors.livePreviewDate.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>Set the purchase time</span>
                  <Controller
                    control={control}
                    name="delayedEntryTime"
                    key={liveData?.findLiveById.live?.delayedEntryTime}
                    defaultValue={liveData?.findLiveById.live?.delayedEntryTime}
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Select
                          value={value}
                          onChange={onChange}
                          disabled={isInputDisabled}
                          placeholder="라이브 시작 시간 이후">
                          <Select.Option value={0} key={0}>
                            구매불가
                          </Select.Option>
                          {delayedEntryTimeArr.map((data, index) => {
                            return (
                              <Select.Option value={data} key={index}>
                                {data}분
                              </Select.Option>
                            )
                          })}
                          <Select.Option value={999} key={999}>
                            라이브 종료까지
                          </Select.Option>
                        </Select>
                      </>
                    )}
                  />
                </div>
                {errors.delayedEntryTime?.message && (
                  <div className="form-message">
                    <span>{errors.delayedEntryTime.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Live Thumbnail</span>
                  <Controller
                    key={liveData?.findLiveById.live?.mainImageName}
                    defaultValue={liveData?.findLiveById.live?.mainImageName?.toString()}
                    control={control}
                    name="liveThumbnail"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { onChange } }) => (
                      <ImgUploadBtnWrap className="profile-edit">
                        <Popover
                          className="profile-edit-popover uploadBtn"
                          content={renderPopoverContent}
                          trigger="click"
                          placement="bottomRight"
                        />
                        <Input
                          className="input"
                          name="mainImgInput"
                          placeholder="Please upload img. only png or jpg"
                          value={mainImgInfo.mainImg}
                          onChange={onChange}
                          disabled={isInputDisabled}
                        />
                      </ImgUploadBtnWrap>
                    )}
                  />
                </div>
                {errors.liveThumbnail?.message && (
                  <div className="form-message">
                    <span>{errors.liveThumbnail.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>
                    Live
                    <span style={{ color: '#ada7a7' }}>
                      {locale === 'ko'
                        ? ' ※live는 최대 7개까지 추가할 수 있습니다. '
                        : ' ※Up to eight live can be uploaded. '}
                    </span>
                    <Radio.Group
                      defaultValue={'Auto'}
                      buttonStyle="solid"
                      disabled={isInputDisabled}>
                      <Radio.Button value="Auto" onChange={() => setIsAuto('Auto')}>
                        자동생성
                      </Radio.Button>
                      <Radio.Button value="Manual" onChange={() => setIsAuto('Manual')}>
                        수동생성
                      </Radio.Button>
                    </Radio.Group>
                  </span>
                  {liveInfoArr.map((data, index) => {
                    return (
                      <div key={index}>
                        <div>
                          <em className="fontSize12 mrT5">Ch{index + 1}</em>
                          {index >= 1 && (
                            <Button
                              className="delectBtn"
                              onClick={() => onDeleteBtn(index, setLiveInfoArr, liveInfoArr)}>
                              삭제
                            </Button>
                          )}
                        </div>
                        <Input
                          key={data.linkPath}
                          className="input"
                          name={`liveUrl_${index}`}
                          placeholder="Please upload the video.(only mp4)"
                          disabled={isAuto === 'Auto' ? true : false}
                          defaultValue={data.linkPath || `live/{LIVEID}_${index + 1}`}
                        />
                      </div>
                    )
                  })}
                  {liveInfoArr.length < 7 && (
                    <Button
                      className="thumbnailAddBtn"
                      onClick={() => onAddLive('live')}
                      disabled={isInputDisabled}>
                      {locale === 'ko' ? '추가' : 'Add'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Content</span>
                  <Controller
                    control={control}
                    name="content"
                    key={liveData?.findLiveById.live?.content}
                    defaultValue={liveData?.findLiveById.live?.content?.toString()}
                    render={({ field: { value, onChange } }) => (
                      <TextArea
                        key={liveData?.findLiveById.live?.content}
                        className="input ant-input"
                        placeholder="Please upload content."
                        maxLength={1000}
                        value={value}
                        onChange={onChange}
                        defaultValue={liveData?.findLiveById.live?.content?.toString()}
                        disabled={isInputDisabled}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  {/* onChange 로직 변경, onChange 마다 리렌더링하게 되고있음.추후 로직 수정. _승철 */}
                  <span>Share</span>
                  {memberShareInfo.map((data, index) => {
                    return (
                      <div key={index}>
                        <div>
                          <em className="fontSize12 mrT5">{index + 1}</em>
                          {index >= 1 && (
                            <Button
                              className="delectBtn"
                              onClick={() =>
                                onDeleteBtn(index, setMemberShareInfo, memberShareInfo)
                              }>
                              삭제
                            </Button>
                          )}
                        </div>
                        <ShareWrap>
                          <Controller
                            control={control}
                            name="share"
                            rules={{
                              required: '위 항목은 필수 항목입니다.',
                            }}
                            render={() => (
                              <>
                                <Select
                                  defaultValue={memberShareInfo[0].nickName}
                                  value={memberShareInfo[index].nickName}
                                  onChange={(value) =>
                                    setMemberShareInfo(
                                      memberShareInfo.map((data, i) => {
                                        return i === index
                                          ? {
                                              ...data,
                                              memberId: value.toString().split('/')[0],
                                              nickName: value.toString().split('/')[1],
                                            }
                                          : data
                                      })
                                    )
                                  }
                                  className={`member_${index}`}
                                  disabled={isInputDisabled}>
                                  {memberData?.findMembersByType.members.map((data, i) => {
                                    return (
                                      <Select.Option
                                        value={data._id + '/' + data.nickName}
                                        key={`type-${i}`}>
                                        {data.nickName}
                                      </Select.Option>
                                    )
                                  })}
                                </Select>
                                <Input
                                  type="number"
                                  className="input"
                                  name={`priorityShare_${index}`}
                                  placeholder="priorityShare"
                                  value={memberShareInfo[index].priorityShare}
                                  onChange={(e) =>
                                    setMemberShareInfo(
                                      memberShareInfo.map((data, i) => {
                                        return i === index
                                          ? { ...data, priorityShare: parseInt(e.target.value) }
                                          : data
                                      })
                                    )
                                  }
                                  disabled={isInputDisabled}
                                />
                                <Input
                                  className="input"
                                  type="number"
                                  name={`directShare_${index}`}
                                  placeholder="directShare"
                                  value={memberShareInfo[index].directShare}
                                  disabled={isInputDisabled}
                                  onChange={(e) =>
                                    setMemberShareInfo(
                                      memberShareInfo.map((data, i) => {
                                        return i === index
                                          ? { ...data, directShare: parseInt(e.target.value) }
                                          : data
                                      })
                                    )
                                  }
                                />
                              </>
                            )}
                          />
                        </ShareWrap>
                      </div>
                    )
                  })}
                  {errors.liveThumbnail?.message && (
                    <div className="form-message">
                      <span>{errors.liveThumbnail.message}</span>
                    </div>
                  )}
                  <Button
                    className="thumbnailAddBtn"
                    onClick={() => onAddLive('member')}
                    disabled={isInputDisabled}>
                    {locale === 'ko' ? '추가' : 'Add'}
                  </Button>
                </div>
              </div>
              <div className="form-item">
                <div className="button-group">
                  <Button
                    type="primary"
                    role="button"
                    className="submit-button"
                    loading={editLoading}
                    onClick={onSubmit}>
                    {locale === 'ko' ? '수정' : 'Edit'}
                  </Button>
                  <Button
                    type="primary"
                    role="button"
                    htmlType="button"
                    className="submit-button"
                    loading={editLoading}
                    onClick={liveDelete}
                    style={{ marginLeft: '10px' }}>
                    {locale === 'ko' ? '삭제' : 'Remove'}
                  </Button>
                </div>
              </div>
            </Form>
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}
export default LiveDetail
