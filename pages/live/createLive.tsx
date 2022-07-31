import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, DatePicker, Input, InputNumber, Radio, Select } from 'antd'

import Link from 'next/link'
import { toast } from 'react-toastify'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import TextArea from 'rc-textarea'
import moment from 'moment'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CREATE_LIVE_MUTATION } from '../../graphql/mutations'
import {
  CreateLiveMutation,
  CreateLiveMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  MemberType,
  RatioType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY } from '../../graphql/queries'

/** utils */
import * as mongoose from 'mongoose'
import {
  delayedEntryTimeArr,
  liveImgCheckExtension,
  onDeleteBtn,
  shareCheck,
} from '../../Common/commonFn'

type Props = styleMode

export interface LiveCreateForm {
  title: string
  hostName: string
  paymentAmount: number
  liveRatioType: RatioType
  livePreviewDate: Date | any
  liveThumbnail: string
  delayedEntryTime: number
  content: string
  share: ShareInfo
}

export type ShareInfo = {
  memberId: string
  priorityShare: number
  directShare: number
  nickName: string
}

export type MainImgInfo = {
  fileInfo: Blob | string
  mainImg?: string
}

export type LiveInfoArr = {
  listingOrder: number
  linkPath: string
}

const ShareWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
`

const CreateLive: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()
  const [liveInfoArr, setLiveInfoArr] = useState<Array<LiveInfoArr>>([
    { listingOrder: 0, linkPath: '' },
  ]) //링크 관리

  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [isAuto, setIsAuto] = useState('Auto') //라이브 링크 자동생성 수동생성

  const [createLive, { loading: isCreateLiveLoading }] = useMutation<
    CreateLiveMutation,
    CreateLiveMutationVariables
  >(CREATE_LIVE_MUTATION, {
    onError: (error) => {
      toast.error(error.message, {
        theme: localStorage.theme || 'light',
      })
    },
  })

  const [getMember, { data: memberData }] = useLazyQuery<
    FindMembersByTypeQuery,
    FindMembersByTypeQueryVariables
  >(FIND_MEMBERS_BY_TYPE_QUERY)

  const requiredText =
    locale === 'ko' ? '위 항목은 필수 항목입니다.' : 'The above items are mandatory.'

  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LiveCreateForm>({
    mode: 'onChange',
  })

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
        liveRatioType,
        hostName,
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
      //아이디 생성
      const id = new mongoose.Types.ObjectId() as any
      let mainImgFileName = '' //메인 썸네일

      //이미지 확장자 체크

      const liveImgInput: HTMLInputElement | null =
        document.querySelector(`input[name=liveThumbnail]`)
      const imgCheck = await liveImgCheckExtension(liveImgInput, id, locale, 'live')

      if (!imgCheck) {
        return
      } else {
        mainImgFileName = `${imgCheck}`
      }

      //라이브 채널 링크 배열
      const liveLinkArr = []
      for (let i = 0; i < liveInfoArr.length; i++) {
        const liveUrlInput: HTMLInputElement | null = document.querySelector(
          `input[name=liveUrl_${i}]`
        )
        let liveUrlInputValue = ''
        if (liveUrlInput) {
          liveUrlInputValue = liveUrlInput.value
          liveLinkArr.push({
            listingOrder: i + 1,
            linkPath: isAuto ? liveUrlInputValue.replace(`{LIVEID}`, id) : liveUrlInputValue, //자동생성인 경우 Replace, 수동생성인 경우 value 값을 그대로 넣어준다.})
          })
        }
      }

      const { data } = await createLive({
        variables: {
          createLiveInput: {
            _id: id,
            mainImageName: mainImgFileName,
            delayedEntryTime,
            hostName,
            liveRatioType,
            liveLinkInfo: liveLinkArr,
            liveShareInfo: {
              liveId: id,
              memberShareInfo,
            },
            livePreviewDate: new Date(livePreviewDate._d),
            content,
            paymentAmount: parseFloat(paymentAmount.toString()),
            title,
          },
        },
      })
      if (!data?.createLive.ok) {
        const message = locale === 'ko' ? data?.createLive.error?.ko : data?.createLive.error?.en
        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 750,
          onClose: () => push('/live/lives'),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await getMember({
          variables: {
            membersByTypeInput: {
              memberType: MemberType.Business,
            },
          },
        })
      } catch (error) {
        console.error(error)
      }
    }

    fetch()
  }, [memberData])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'Live 추가' : 'Live Create'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Live' : 'Live'}</li>
            <li>{locale === 'ko' ? 'Live 추가' : 'Live Create'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form name="createLiveForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '제목' : 'Title'} </span>
                  <Controller
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
              <div className="form-item mt-half">
                <div className="form-group">
                  <span>{locale === 'ko' ? '호스트' : 'HostName'}</span>
                  <Controller
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
                        maxLength={50}
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

              <div className="form-item mt-half">
                <div className="form-group">
                  <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                  <Controller
                    control={control}
                    name="paymentAmount"
                    defaultValue={0}
                    rules={{
                      required: true,
                      min: {
                        value: 0,
                        message:
                          locale === 'ko'
                            ? '0 ~ 65535까지 입력 가능합니다.'
                            : 'You can enter from 0 to 65535.',
                      },
                      max: {
                        value: 65535,
                        message:
                          locale === 'ko'
                            ? '0 ~ 65535까지 입력 가능합니다.'
                            : 'You can enter from 0 to 65535.',
                      },
                    }}
                    render={({ field: { value, onChange } }) => (
                      <InputNumber
                        className="input"
                        placeholder="Please enter the paymentAmount."
                        value={value}
                        max={65535}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        onKeyPress={(e) => {
                          if (e.key === '.' || e.key === 'e' || e.key === '+' || e.key === '-') {
                            e.preventDefault()
                            return false
                          }
                        }}
                        onChange={onChange}
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

              <div className="form-item mt-half">
                <div className="form-group">
                  <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                  <Controller
                    control={control}
                    name="liveRatioType"
                    rules={{ required: requiredText }}
                    defaultValue={RatioType.Horizontal}
                    render={({ field: { value, onChange } }) => (
                      <>
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
                      </>
                    )}
                  />
                </div>
                {errors.liveRatioType?.message && (
                  <div className="form-message">
                    <span>{errors.liveRatioType.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item mt-half">
                <div className="form-group">
                  <span>{locale === 'ko' ? 'Live 시작 예정 시간' : 'Estimated start date'}</span>
                  <Controller
                    control={control}
                    name="livePreviewDate"
                    rules={{
                      required: requiredText,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        //disabledDate={(current) => current && current <= moment().endOf('day')}
                        showTime={{ defaultValue: moment('00:00', 'HH:mm'), format: 'HH:mm' }}
                        value={value}
                        onChange={onChange}
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

              <div className="form-item mt-half">
                <div className="form-group">
                  <span>{locale === 'ko' ? '시작 후 구매가능 시간' : 'Set the purchase time'}</span>
                  <Controller
                    control={control}
                    name="delayedEntryTime"
                    rules={{
                      required: requiredText,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Select
                          value={value}
                          onChange={onChange}
                          placeholder="라이브 시작 시간 이후">
                          <Select.Option value={0} key={9999}>
                            {locale === 'ko' ? '구매불가' : 'Unable to purchase'}
                          </Select.Option>
                          {delayedEntryTimeArr.map((data, index) => {
                            return (
                              <Select.Option value={data} key={index}>
                                {data}
                                {locale === 'ko' ? '분' : 'min'}
                              </Select.Option>
                            )
                          })}
                          <Select.Option value={999} key={9999}>
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
              <div className="form-item mt-half">
                <div className="form-group">
                  <span>Live {locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                  <Controller
                    control={control}
                    name="liveThumbnail"
                    rules={{
                      required: requiredText,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        className="input"
                        type="file"
                        value={value}
                        name="liveThumbnail"
                        placeholder="Please upload img. only png or jpg"
                        onChange={onChange}
                      />
                    )}
                  />
                </div>

                {errors.liveThumbnail?.message && (
                  <div className="form-message">
                    <span>{errors.liveThumbnail.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item mt-half">
                <div className="form-group">
                  <span>
                    Live
                    <span style={{ color: '#ada7a7' }}>
                      {locale === 'ko'
                        ? ' ※live는 최대 8개까지 추가할 수 있습니다. '
                        : ' ※Up to eight live can be uploaded. '}
                    </span>
                    <Radio.Group defaultValue={'Auto'} buttonStyle="solid">
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
                          <em className="fontSize12 mt-half">Ch{index + 1}</em>
                          {index >= 1 && (
                            <Button
                              className="delectBtn"
                              onClick={() => onDeleteBtn(index, setLiveInfoArr, liveInfoArr)}>
                              {locale === 'ko' ? '삭제' : 'Delete'}
                            </Button>
                          )}
                        </div>
                        <Input
                          className="input"
                          name={`liveUrl_${index}`}
                          placeholder="Please upload the video.(only mp4)"
                          disabled={isAuto === 'Auto' ? true : false}
                          defaultValue={`live/{LIVEID}_${index + 1}`}
                        />
                      </div>
                    )
                  })}
                  {liveInfoArr.length < 9 && (
                    <Button className="thumbnailAddBtn" onClick={() => onAddLive('live')}>
                      {locale === 'ko' ? '추가' : 'Add'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="form-item mt-half">
                <div className="form-group">
                  <span>{locale === 'ko' ? '내용' : 'Content'}</span>
                  <Controller
                    control={control}
                    name="content"
                    render={({ field: { value, onChange } }) => (
                      <TextArea
                        className="input ant-input"
                        placeholder="Please upload content."
                        maxLength={1000}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-item mt-half">
                <div className="form-group">
                  {/* onChange 로직 변경, onChange 마다 리렌더링하게 되고있음.추후 로직 수정. _승철 */}
                  <span>{locale === 'ko' ? '지분 - 우선환수, 직분배' : 'Share'}</span>
                  {memberShareInfo.map((data, index) => {
                    return (
                      <div key={index}>
                        <div>
                          <em className="fontSize12 mt-half">{index + 1}</em>
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
                                  className={`member_${index}`}>
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
                                />
                                <Input
                                  className="input"
                                  type="number"
                                  name={`directShare_${index}`}
                                  placeholder="directShare"
                                  value={memberShareInfo[index].directShare}
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
                  <Button className="thumbnailAddBtn" onClick={() => onAddLive('member')}>
                    {locale === 'ko' ? '추가' : 'Add'}
                  </Button>
                </div>
              </div>
              <div className="form-item mt-half">
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
                    htmlType="submit"
                    className="submit-button ml-harf"
                    disabled={Object.keys(errors).includes('paymentAmount')}
                    loading={isCreateLiveLoading}>
                    {locale === 'ko' ? '저장' : 'save'}
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
export default CreateLive
