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
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY } from '../../graphql/queries'

/** utils */
import { S3 } from '../../lib/awsClient'
import * as mongoose from 'mongoose'
import { delayedEntryTimeArr, nowDateStr, onDeleteBtn, shareCheck } from '../../Common/commonFn'

type Props = styleMode

export interface LiveCreateForm {
  title: string
  hostName: string
  paymentAmount: number
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

const CreateLive: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const [liveInfoArr, setLiveInfoArr] = useState<Array<LiveInfoArr>>([
    { listingOrder: 0, linkPath: '' },
  ]) //링크 관리
  const [mainImgInfo, setMainImgInfo] = useState<MainImgInfo>({ mainImg: '', fileInfo: '' }) //mainImg 관리
  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [isAuto, setIsAuto] = useState('Auto') //라이브 링크 자동생성 수동생성

  const [createLive] = useMutation<CreateLiveMutation, CreateLiveMutationVariables>(
    CREATE_LIVE_MUTATION
  )

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
      const { title, hostName, paymentAmount, delayedEntryTime, livePreviewDate, content } =
        getValues()

      //memberShareData 유효성 확인, 100이 되야한다.
      if (!shareCheck(memberShareInfo, locale)) {
        return
      }

      //메인 이미지 s3 업로드
      //아이디 생성
      const id = new mongoose.Types.ObjectId() as any

      let mainImgFileName = '' //메인 썸네일
      const nowDate = `${id.toString()}_main_${nowDateStr}.png`
      //MainThumbnail upload
      //cn
      if (mainImgInfo.fileInfo instanceof File) {
        mainImgFileName = `${
          process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
        }/going/live/${id.toString()}/main/${nowDate}`
        process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
          (await S3.upload({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: mainImgFileName,
            Body: mainImgInfo.fileInfo,
            ACL: 'public-read',
          }).promise())
      }
      mainImgFileName = `${nowDate}`

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
        notification.error({
          message,
        })
        throw new Error(message)
      } else {
        notification.success({
          message: locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed',
        })

        setTimeout(() => {
          window.location.href = '/live/lives'
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
        <Upload
          accept="image/*"
          multiple={false}
          customRequest={customRequest}
          onChange={onProfileChange}
          showUploadList={false}>
          <Button>{locale === 'ko' ? '사진 업로드' : 'Upload a photo'}</Button>
        </Upload>
        <Button onClick={onRemoveProfileClick}>
          {locale === 'ko' ? '사진 삭제' : 'Remove photo'}
        </Button>
      </Wrapper>
    )
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
              <div className="form-item">
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

              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                  <Controller
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
                    <span>{errors.livePreviewDate.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
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
              <div className="form-item">
                <div className="form-group">
                  <span>Live {locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                  <Controller
                    control={control}
                    name="liveThumbnail"
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
                        />
                      </ImgUploadBtnWrap>
                    )}
                  />
                </div>
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
                          <em className="fontSize12 mrT5">Ch{index + 1}</em>
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
                  {liveInfoArr.length < 8 && (
                    <Button className="thumbnailAddBtn" onClick={() => onAddLive('live')}>
                      {locale === 'ko' ? '추가' : 'Add'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="form-item">
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
              <div className="form-item">
                <div className="form-group">
                  {/* onChange 로직 변경, onChange 마다 리렌더링하게 되고있음.추후 로직 수정. _승철 */}
                  <span>
                    {locale === 'ko' ? '지분' : 'Share'} (회원, 우선분배 지분, 직분배 지분)
                  </span>
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
              <div className="form-item">
                <div className="button-group">
                  <Button type="primary" role="button" htmlType="submit" className="submit-button">
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
