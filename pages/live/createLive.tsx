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
import { CREATE_LIVE_MUTATION } from '../../graphql/mutations'
import {
  CreateLiveMutation,
  CreateLiveMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  MemberType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY } from '../../graphql/queries'

type Props = styleMode

export interface LiveCreateForm {
  title: string
  hostName: string
  paymentAmount: number
  livePreviewDate: Date | any
  liveThumbnail: string
  delayedEntryTime: number | string
  content: string
  share: ShareInfo
}

export type ShareInfo = {
  memberId: string
  priorityShare: number
  directShare: number
}

export type MainImgInfo = {
  fileInfo: Blob | string
  mainImg?: string
}

export type LiveLinkInfo = {
  linkPath?: string
  listingOrder: number
  playingImageName?: string
}

export type LiveInfoArr = {
  playingImg?: string
  fileInfo: Blob | string
}

export type FormParam = {
  id: string
  paths: Array<string>
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
  const delayedEntryTimeArr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] //라이브 시작 후 결제 가능 시간
  const [liveInfoArr, setLiveInfoArr] = useState<Array<LiveInfoArr>>([
    { playingImg: '', fileInfo: '' },
  ]) //링크, playing 이미지 관리
  const [mainImgInfo, setMainImgInfo] = useState<MainImgInfo>({ mainImg: '', fileInfo: '' }) //mainImg 관리
  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [isAuto, setIsAuto] = useState('Auto') //라이브 링크 자동생성 수동생성

  const [createLive] = useMutation<CreateLiveMutation, CreateLiveMutationVariables>(
    CREATE_LIVE_MUTATION
  )

  const [getMember, { data: memberData }] = useLazyQuery<
    FindMembersByTypeQuery,
    FindMembersByTypeQueryVariables
  >(FIND_MEMBERS_BY_TYPE_QUERY)

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
        fileInfo: '',
        playingImg: '',
      }
      if (liveInfoArr.length < 8) {
        setLiveInfoArr(() => liveInfoArr.concat(live))
      }
      return
    }

    if (type === 'member') {
      const member = {
        memberId: '',
        priorityShare: 0,
        directShare: 0,
      }
      setMemberShareInfo(() => memberShareInfo.concat(member))

      return
    }
  }
  //라이브 채널,share 삭제 버튼
  const onDeleteLive = (type: string, index: number) => {
    if (type === 'live') {
      setLiveInfoArr(
        liveInfoArr.filter((data, i) => {
          return i !== index
        })
      )
      return
    }
    if (type === 'member') {
      setMemberShareInfo(
        memberShareInfo.filter((data, i) => {
          return i !== index
        })
      )
      return
    }
  }

  const onSubmit = async () => {
    try {
      const { title, hostName, paymentAmount, delayedEntryTime, livePreviewDate } = getValues()
      //라이브 채널 링크 배열
      const liveLinkArr: Array<LiveLinkInfo> = []

      //라이브 이후 구매시간 설정
      let setDelayedEntryTime = new Date(livePreviewDate._d)
      if (delayedEntryTime === 'notAvailable') {
        //구매 불가
        setDelayedEntryTime = new Date('1895-12-17T03:24:00')
      } else if (delayedEntryTime === 'end') {
        //라이브 종료시까지
        setDelayedEntryTime = new Date('9999-12-31T23:24:00')
      } else {
        setDelayedEntryTime.setMinutes(
          setDelayedEntryTime.getMinutes() + parseInt(delayedEntryTime.toString())
        )
      }

      //memberShareData 유효성 확인, 100이 되야한다.
      let priorityShare = 0
      let directShare = 0

      for (let i = 0; i < memberShareInfo.length; i++) {
        priorityShare += memberShareInfo[i].priorityShare
        directShare += memberShareInfo[i].directShare
      }

      if (priorityShare !== 100 || directShare !== 100) {
        notification.error({
          message:
            locale === 'ko' ? '지분분배의 총합은 100이 되어야 합니다.' : 'Has been completed',
        })
        return
      }

      //liveLinkInfo 빈 데이터
      if (liveInfoArr) {
        for (let j = 0; j < liveInfoArr.length; j++) {
          liveLinkArr.push({ listingOrder: j, linkPath: '' })
        }
      }

      const { data } = await createLive({
        variables: {
          createLiveInput: {
            delayedEntryTime: setDelayedEntryTime,
            hostName,
            liveLinkInfo: liveLinkArr,
            liveShareInfo: memberShareInfo,
            livePreviewDate: new Date(livePreviewDate._d),
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
        //파일 이미지 전송
        try {
          const formData = new FormData()
          const params: FormParam = {
            id: data.createLive.liveId, // string > Live ID
            paths: [], // string[] > 채널 링크
          }
          //live Ch value 변경-liveID를 추가한다.
          if (data.createLive.liveId) {
            for (let j = 0; j < liveInfoArr.length; j++) {
              const liveUrlInput: HTMLInputElement | null = document.querySelector(
                `input[name=liveUrl_${j}]`
              )
              if (liveUrlInput) {
                const nowDate = new Date()
                //date format YYMMDD_HHMMSSnpm
                const nowDateStr = `_${nowDate.getFullYear().toString().padStart(4, '0')}${(
                  nowDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, '0')}${nowDate.getDate().toString().padStart(2, '0')}_${nowDate
                  .getHours()
                  .toString()
                  .padStart(2, '0')}${nowDate.getMinutes().toString().padStart(2, '0')}${nowDate
                  .getSeconds()
                  .toString()
                  .padStart(2, '0')}`

                const liveUrlInputValue = liveUrlInput.value + nowDateStr

                //자동생성인 경우 Replace, 수동생성인 경우 value 값을 그대로 넣어준다.
                params.paths.push(
                  isAuto
                    ? liveUrlInputValue.replace(`{LIVEID}`, data.createLive.liveId)
                    : liveUrlInputValue
                )
              }
            }
          }

          formData.append('json', JSON.stringify(params))
          //맨 처음 전송 데이터는 메인 이미지를 보내야 한다.
          formData.append('files', mainImgInfo.fileInfo)
          // 이미지 파일이 여러개면 formData를 여러번 선언 해야 합니다.
          for (let i = 0; i < liveInfoArr.length; i++) {
            if (liveInfoArr[i].fileInfo) {
              formData.append('files', liveInfoArr[i].fileInfo)
            } else {
              //이미지 파일이 없는 경우 new Blob 으로 처리
              const emptyBlob = new Blob()
              formData.append('files', emptyBlob)
            }
          }

          await (
            await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/uploads/live`, {
              method: 'POST',
              body: formData,
            })
          ).json()
        } catch (error) {
          console.error(error)
        }

        notification.success({
          message: locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * @returns {Promise<void>} JSX element를 리턴 합니다.
   */
  const renderPopoverContent = (type: string, index?: number) => {
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
      const fileInput: HTMLInputElement | null = document.querySelector(
        type === 'playing' ? `input[name=playImgUrl_${index}]` : 'input[name=mainImgInput]'
      )

      if (file.originFileObj && fileInput) {
        //playing img 인 경우와 mainImg인 경우 로직 따로 처리
        if (type === 'playing') {
          setLiveInfoArr(
            liveInfoArr.map((data, i) => {
              return i === index && file.originFileObj
                ? { ...data, fileInfo: file.originFileObj, playingImg: file.originFileObj.name }
                : data
            })
          )
        }

        if (type === 'main') {
          setMainImgInfo({ fileInfo: file.originFileObj, mainImg: file.originFileObj.name })
        }

        fileInput.value = file.originFileObj.name
      }
    }
    /**
     * profile을 비우는 클릭 이벤트 핸들러 입니다.
     */
    const onRemoveProfileClick = () => {
      const fileInput: HTMLInputElement | null = document.querySelector(
        type === 'playing' ? `input[name=playImgUrl_${index}]` : 'input[name=mainImgInput]'
      )

      if (fileInput) {
        if (type === 'playing') {
          setLiveInfoArr(
            liveInfoArr.map((data, i) => {
              return i === index ? { ...data, fileInfo: '', playingImg: '' } : data
            })
          )
        }

        if (type === 'main') {
          setMainImgInfo({ fileInfo: '', mainImg: '' })
        }
        fileInput.value = ''
      }
    }

    return (
      <Wrapper>
        <ImgCrop
          shape="rect"
          modalTitle={locale === 'ko' ? '이미지 편집' : 'Edit image'}
          modalOk={locale === 'ko' ? '확인' : 'OK'}
          modalCancel={locale === 'ko' ? '취소' : 'Cancel'}>
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
                  <span>Title</span>
                  <Controller
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
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
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
                  <span>Set the purchase time</span>
                  <Controller
                    control={control}
                    name="delayedEntryTime"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Select
                          value={value}
                          onChange={onChange}
                          placeholder="라이브 시작 시간 이후">
                          <Select.Option value={'notAvailable'} key={9999}>
                            구매불가
                          </Select.Option>
                          {delayedEntryTimeArr.map((data, index) => {
                            return (
                              <Select.Option value={data} key={index}>
                                {data}분
                              </Select.Option>
                            )
                          })}
                          <Select.Option value={'end'} key={9999}>
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
                    control={control}
                    name="liveThumbnail"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { onChange } }) => (
                      <ImgUploadBtnWrap className="profile-edit">
                        <Popover
                          className="profile-edit-popover uploadBtn"
                          content={() => renderPopoverContent('main')}
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
                        ? ' ※live는 최대 8개까지 추가할 수 있습니다. '
                        : ' ※Up to eight live can be uploaded. '}
                    </span>
                    <Radio.Group defaultValue={'Auto'} buttonStyle="solid">
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
                              onClick={() => onDeleteLive('live', index)}>
                              삭제
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
                        <ImgUploadBtnWrap className="profile-edit">
                          <Popover
                            className="profile-edit-popover uploadBtn"
                            content={() => renderPopoverContent('playing', index)}
                            trigger="click"
                            placement="bottomRight"
                          />
                          <Input
                            className="input mrT5"
                            name={`playImgUrl_${index}`}
                            placeholder="Please upload playingThumnail img. only png or jpg"
                            value={liveInfoArr[index].playingImg}
                          />
                        </ImgUploadBtnWrap>
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
                  <span>Content</span>
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
                  <span>Share</span>
                  {memberShareInfo.map((data, index) => {
                    return (
                      <div key={index}>
                        <div>
                          <em className="fontSize12 mrT5">{index + 1}</em>
                          {index >= 1 && (
                            <Button
                              className="delectBtn"
                              onClick={() => onDeleteLive('member', index)}>
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
                                  defaultValue={memberShareInfo[0].memberId}
                                  value={memberShareInfo[index].memberId}
                                  onChange={(value) =>
                                    setMemberShareInfo(
                                      memberShareInfo.map((data, i) => {
                                        return i === index
                                          ? { ...data, memberId: value.toString() }
                                          : data
                                      })
                                    )
                                  }
                                  className={`member_${index}`}>
                                  {memberData?.findMembersByType.members.map((data, i) => {
                                    return (
                                      <Select.Option value={data._id} key={`type-${i}`}>
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
                  {errors.liveThumbnail?.message && (
                    <div className="form-message">
                      <span>{errors.liveThumbnail.message}</span>
                    </div>
                  )}
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
