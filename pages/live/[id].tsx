import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, DatePicker, Input, Radio, Select } from 'antd'

import Link from 'next/link'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import TextArea from 'rc-textarea'
import moment from 'moment'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMutation, useQuery } from '@apollo/client'
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
  RatioType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY, LIVE_QUERY } from '../../graphql/queries'

import {
  DATE_FORMAT,
  delayedEntryTimeArr,
  liveImgCheckExtension,
  onDeleteBtn,
  shareCheck,
} from '../../Common/commonFn'
import { omit } from 'lodash'
import { CopyOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import ChangeFileInput from '../../components/ChangeFileInput'

type Props = styleMode

export interface LiveCreateForm {
  title: string
  hostName: string
  liveRatioType: RatioType
  paymentAmount: number
  livePreviewDate: Date | any
  liveThumbnail: string
  delayedEntryTime: number
  content?: string
  share: ShareInfo
  liveThumnailRemove: boolean
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

// const ImgInputWrap = styled.div`
//   position: relative;

//   .delectBtn {
//     position: absolute;
//     width: 50px;
//     height: 30px;
//     line-height: 30px;
//     margin: 0;
//     top: 50%;
//     right: 7px;
//     transform: translateY(-50%);
//     background-color: #bbbbbb !important;
//   }

//   .hidden {
//     position: absolute;
//     visibility: hidden;
//     opacity: 0;
//   }
// `

const LiveDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload, query, push } = useRouter()
  const [liveInfoArr, setLiveInfoArr] = useState<Array<LiveInfoArr>>([
    { listingOrder: 0, linkPath: '' },
  ]) //링크 관리
  const [mainImgInfo, setMainImgInfo] = useState<MainImgInfo>({ mainImg: '', fileInfo: '' }) //mainImg 관리

  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [isAuto, setIsAuto] = useState('Auto') //라이브 링크 자동생성 수동생성
  //라이브 상태
  const [statusRadio, setStatusRadio] = useState('')

  const {
    getValues,
    watch,
    formState: { errors },
    control,
  } = useForm<LiveCreateForm>({
    mode: 'onChange',
  })

  // const watchLiveThumnailRemove = watch('liveThumnailRemove', false)
  const liveStatus = ['Hide', 'Display', 'Active', 'Finish'] //라이브 상태

  //현재 라이브 아이디
  const liveId = query.id ? query.id?.toString() : ''

  //지분 설정을 위한 멤버 쿼리
  const { data: memberData } = useQuery<FindMembersByTypeQuery, FindMembersByTypeQueryVariables>(
    FIND_MEMBERS_BY_TYPE_QUERY,
    {
      variables: {
        membersByTypeInput: {
          memberType: MemberType.Business,
        },
      },
    }
  )

  //라이브 쿼리
  const {
    data: liveData,
    refetch: refreshMe,
    loading: isLiveIdLoading,
  } = useQuery<FindLiveByIdQuery, FindLiveByIdQueryVariables>(LIVE_QUERY, {
    variables: { liveInput: { liveId } },
    onCompleted: (data: FindLiveByIdQuery) => {
      if (data.findLiveById.ok) {
        const infoResult = data?.findLiveById.live?.liveLinkInfo.map((data) => {
          return omit(data, ['playingImageName', '__typename'])
        }) //liveInfoArr result
        const result = data?.findLiveById.live?.liveShareInfo.memberShareInfo.map((data) => {
          return omit(data, ['__typename'])
        }) //memberShareInfo result

        setMainImgInfo({
          ...mainImgInfo,
          mainImg: data?.findLiveById.live?.mainImageName,
        })
        setLiveInfoArr(infoResult as any)
        setMemberShareInfo(result as any)
        // setIsInputDisabled(liveData?.findLiveById.live?.liveStatus !== 'HIDE' && true)
        setStatusRadio(
          data?.findLiveById.live?.liveStatus ? data?.findLiveById.live?.liveStatus : 'HIDE'
        )
      }
    },
  })

  //인풋 상태
  // const [isInputDisabled, setIsInputDisabled] = useState(false)

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

  const requiredText =
    locale === 'ko' ? '위 항목은 필수 항목입니다.' : 'The above items are mandatory.'

  //라이브 삭제
  const liveDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const { data } = await deleteLive({
        variables: {
          deleteLiveInput: {
            liveId,
          },
        },
      })

      if (!data?.deleteLive.ok) {
        const message = locale === 'ko' ? data?.deleteLive.error?.ko : data?.deleteLive.error?.en
        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '삭제가 완료 되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 500,
          onClose: () => push('/live/lives'),
        })
      }
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
      const {
        title,
        hostName,
        liveRatioType,
        paymentAmount,
        delayedEntryTime,
        livePreviewDate,
        content,
      } = getValues()

      //memberShareData 유효성 확인, 100이 되야한다.
      if (!shareCheck(memberShareInfo, locale)) {
        return
      }

      //메인 이미지 s3 업로드
      const id = liveData?.findLiveById.live ? liveData?.findLiveById.live?._id : ''
      let mainImgFileName = '' //메인 썸네일

      const liveImgInput: HTMLInputElement | null =
        document.querySelector(`input[name=liveThumbnail]`)

      //MainThumbnail upload
      //이미지 확장자 체크
      if (liveImgInput && liveImgInput?.files && liveImgInput?.files[0] instanceof File) {
        const imgCheck = await liveImgCheckExtension(liveImgInput, id, locale, 'live')

        if (!imgCheck) {
          return
        } else {
          mainImgFileName = imgCheck
        }
      } else {
        //mainImgInfo.fileInfo 이 file이 아닌경우
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
            liveRatioType,
            liveStatus: (LiveStatus as any)[statusRadio]
              ? (LiveStatus as any)[statusRadio]
              : liveData?.findLiveById.live?.liveStatus,
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
        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 500,
          onClose: () => reload(),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 라이브 주소 복사
   */

  const liveAddrCopy = (text: string) => {
    const copyText = text

    //createInput.select()
    //document.execCommand('copy')
    navigator.clipboard.writeText(copyText).catch((err) => {
      console.error('Something went wrong', err)
    })
  }

  /**
   * statusRadio Btn disabled 처리
   */
  const inputDisabled = (liveStatus: string, radioData: string) => {
    switch (liveStatus) {
      case 'HIDE':
        if (radioData === 'Finish') return true
        break
      case 'DISPLAY':
        if (radioData === 'Finish' || radioData === 'Hide') return true
        break
      case 'ACTIVE':
        if (radioData === 'Display' || radioData === 'Hide') return true
        break
      case 'FINISH':
        return true
        break
      default:
        return false
        break
    }
  }

  useEffect(() => {
    // eslint-disable-next-line no-console
    const subscription = watch(() => {
      return
    })
    return () => subscription.unsubscribe()
  }, [watch])

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
            {isLiveIdLoading || (
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
                        disabled={inputDisabled(
                          liveData?.findLiveById.live?.liveStatus || 'HIDE',
                          data
                        )}>
                        {data}
                      </Radio.Button>
                    )
                  })}
                </Radio.Group>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '제목' : 'Title'} </span>
                    <Controller
                      key={liveData?.findLiveById.live?.title}
                      defaultValue={liveData?.findLiveById.live?.title}
                      control={control}
                      name="title"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className="input"
                          placeholder="Please enter the title."
                          value={value}
                          onChange={onChange}
                          // disabled={isInputDisabled}
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
                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '호스트' : 'HostName'}</span>
                    <Controller
                      key={liveData?.findLiveById.live?.hostName}
                      defaultValue={liveData?.findLiveById.live?.hostName}
                      control={control}
                      name="hostName"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className="input"
                          placeholder="Please enter the hostName."
                          value={value}
                          onChange={onChange}
                          // disabled={isInputDisabled}
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

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                    <Controller
                      key={liveData?.findLiveById.live?.paymentAmount}
                      defaultValue={liveData?.findLiveById.live?.paymentAmount}
                      control={control}
                      name="paymentAmount"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          type="number"
                          className="input"
                          placeholder="Please enter the paymentAmount."
                          value={value}
                          onKeyPress={(e) => {
                            if (e.key === '.' || e.key === 'e' || e.key === '+' || e.key === '-') {
                              e.preventDefault()
                              return false
                            }
                          }}
                          onChange={onChange}
                          // disabled={isInputDisabled}
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

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                    <Controller
                      key={liveData?.findLiveById.live?.liveRatioType}
                      control={control}
                      name="liveRatioType"
                      rules={{ required: requiredText }}
                      defaultValue={liveData?.findLiveById.live?.liveRatioType}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <Select
                            defaultValue={liveData?.findLiveById.live?.liveRatioType}
                            value={value}
                            onChange={onChange}
                            // disabled={isInputDisabled}
                          >
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
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>{locale === 'ko' ? 'Live 시작 예정 시간' : 'Estimated start date'}</span>
                    <Controller
                      control={control}
                      name="livePreviewDate"
                      key={liveData?.findLiveById.live?.livePreviewDate}
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          key={liveData?.findLiveById.live?.livePreviewDate}
                          defaultValue={moment(
                            DATE_FORMAT('YYYY-MM-DD', liveData?.findLiveById.live?.livePreviewDate),
                            'YYYY-MM-DD,HH:mm'
                          )}
                          showTime={{
                            defaultValue: moment('00:00', 'HH:mm'),
                            format: 'HH:mm',
                          }}
                          value={value}
                          onChange={onChange}
                          // disabled={isInputDisabled}
                        />
                      )}
                    />
                  </div>
                  {errors.livePreviewDate?.message && (
                    <div className="form-message">
                      <span>{errors.livePreviewDate.message.toString()}</span>
                    </div>
                  )}
                </div>

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>
                      {locale === 'ko' ? '시작 후 구매가능 시간' : 'Set the purchase time'}
                    </span>
                    <Controller
                      control={control}
                      name="delayedEntryTime"
                      key={liveData?.findLiveById.live?.delayedEntryTime}
                      defaultValue={liveData?.findLiveById.live?.delayedEntryTime}
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <Select
                            value={value}
                            onChange={onChange}
                            // disabled={isInputDisabled}
                            placeholder={
                              locale === 'ko' ? '시작 후 구매가능 시간' : 'Set the purchase time'
                            }>
                            <Select.Option value={0} key={0}>
                              {locale === 'ko' ? '구매불가' : 'Unable to purchase'}
                            </Select.Option>
                            {delayedEntryTimeArr.map((data, index) => {
                              return (
                                <Select.Option value={data} key={index + 1}>
                                  {data}
                                  {locale === 'ko' ? '분' : 'min'}
                                </Select.Option>
                              )
                            })}
                            <Select.Option value={999} key={999}>
                              {locale === 'ko' ? '라이브 종료까지' : 'Until the end of the live'}
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
                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>Live {locale === 'ko' ? '이미지' : 'Thumbnail'}</span>

                    <Controller
                      key={liveData?.findLiveById.live?.mainImageName}
                      defaultValue={liveData?.findLiveById.live?.mainImageName?.toString()}
                      control={control}
                      name="liveThumbnail"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { onChange, value } }) => (
                        // <ImgInputWrap>
                        //   {watchLiveThumnailRemove ? (
                        //     <Input
                        //       className="input"
                        //       type="file"
                        //       name="liveThumbnail"
                        //       placeholder="Please upload img. only png or jpg"
                        //       onChange={onChange}
                        //     />
                        //   ) : (
                        //     <Input
                        //       className="input"
                        //       name="mainImgInput"
                        //       value={mainImgInfo.mainImg}
                        //       disabled={true}
                        //     />
                        //   )}

                        //   <input
                        //     type="checkbox"
                        //     id="liveThumnailRemove"
                        //     className="delectBtn hidden"
                        //     {...register('liveThumnailRemove')}
                        //   />
                        //   <label className="delectBtn" htmlFor="liveThumnailRemove">
                        //     {watchLiveThumnailRemove ? '취소' : '변경'}
                        //   </label>
                        // </ImgInputWrap>
                        <ChangeFileInput src={value} onChange={onChange} name="liveThumbnail" />
                      )}
                    />
                  </div>
                  {errors.liveThumbnail?.message && (
                    <div className="form-message">
                      <span>{errors.liveThumbnail.message}</span>
                    </div>
                  )}
                </div>
                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>
                      Live
                      <span style={{ color: '#ada7a7' }}>
                        {locale === 'ko'
                          ? ' ※live는 최대 8개까지 추가할 수 있습니다. '
                          : ' ※Up to eight live can be uploaded. '}
                      </span>
                      <Radio.Group
                        defaultValue={'Auto'}
                        buttonStyle="solid"
                        // disabled={isInputDisabled}
                      >
                        <Radio.Button value="Auto" onChange={() => setIsAuto('Auto')}>
                          {locale === 'ko' ? '자동생성' : 'Automatic generation'}
                        </Radio.Button>
                        <Radio.Button value="Manual" onChange={() => setIsAuto('Manual')}>
                          {locale === 'ko' ? '수동생성' : 'Manual generation'}
                        </Radio.Button>
                      </Radio.Group>
                    </span>
                    {liveInfoArr.map((data, index) => {
                      return (
                        <div key={index}>
                          <div>
                            <em className="fontSize12 mrT5">
                              Ch{index + 1}
                              <CopyOutlined
                                onClick={() =>
                                  liveAddrCopy(`rtmp://stream.stabygo.com:1935/${data.linkPath}`)
                                }
                                style={{ marginLeft: '7px', fontSize: '15px' }}
                              />
                            </em>
                            {index >= 1 && (
                              <Button
                                className="delectBtn"
                                onClick={() => onDeleteBtn(index, setLiveInfoArr, liveInfoArr)}
                                // disabled={isInputDisabled}
                              >
                                {locale === 'ko' ? '삭제' : 'Delete'}
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
                    {liveInfoArr.length < 9 && (
                      <Button
                        className="thumbnailAddBtn"
                        onClick={() => onAddLive('live')}
                        // disabled={isInputDisabled}
                        // disabled={isAuto === 'Auto' ? true : false}
                      >
                        {locale === 'ko' ? '추가' : 'Add'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '내용' : 'Content'}</span>
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
                          // disabled={isInputDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="form-item mt-harf">
                  <div className="form-group">
                    {/* onChange 로직 변경, onChange 마다 리렌더링하게 되고있음.추후 로직 수정.  */}
                    <span>{locale === 'ko' ? '지분 - 우선환수, 직분배' : 'Share'}</span>
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
                                {locale === 'ko' ? '삭제' : 'Delete'}
                              </Button>
                            )}
                          </div>
                          <ShareWrap>
                            <Controller
                              control={control}
                              name="share"
                              rules={{
                                required: requiredText,
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
                                    // disabled={isInputDisabled}
                                  >
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
                                    // disabled={isInputDisabled}
                                  />
                                  <Input
                                    className="input"
                                    type="number"
                                    name={`directShare_${index}`}
                                    placeholder="directShare"
                                    value={memberShareInfo[index].directShare}
                                    // disabled={isInputDisabled}
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
                      // disabled={isInputDisabled}
                    >
                      {locale === 'ko' ? '추가' : 'Add'}
                    </Button>
                  </div>
                </div>
                <div className="form-item mt-harf">
                  <div className="button-group">
                    <Link href="/live/lives">
                      <a>
                        <Button className="submit-button" type="primary" role="button">
                          목록
                        </Button>
                      </a>
                    </Link>
                    <Button
                      type="primary"
                      role="button"
                      className="submit-button ml-harf"
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
            )}
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}
export default LiveDetail
