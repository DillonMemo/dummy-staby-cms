import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, Input, notification, Popover, Radio, Select, Upload } from 'antd'

import { UploadChangeParam } from 'antd/lib/upload'
import { UploadRequestOption } from 'rc-upload/lib/interface'

import Link from 'next/link'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import TextArea from 'rc-textarea'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import ImgCrop from 'antd-img-crop'
import { useLazyQuery, useMutation } from '@apollo/client'
import { DELETE_VOD_MUTATION, EDIT_VOD_MUTATION, LIVES_MUTATION } from '../../graphql/mutations'
import {
  DeleteVodMutation,
  DeleteVodMutationVariables,
  EditVodMutation,
  EditVodMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  FindVodByIdQuery,
  FindVodByIdQueryVariables,
  LivesMutation,
  LivesMutationVariables,
  MemberType,
  TranscodeStatus,
  VodStatus,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY, VOD_QUERY } from '../../graphql/queries'

/** utils */
import { S3 } from '../../lib/awsClient'
import { nowDateStr, onDeleteBtn, shareCheck } from '../../Common/commonFn'
import Spinner from '../../components/Spinner'
import { omit } from 'lodash'

type Props = styleMode

export interface VodCreateForm {
  title: string
  paymentAmount: number
  mainThumbnail: string
  content: string
  share: ShareInfo
  liveId: string
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

export type VodInfoArr = {
  fileInfo?: Blob | string
  linkPath: string
  introImageName: string
  listingOrder?: number
  transcodeStatus: TranscodeStatus
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

const CreateVod: NextPage<Props> = ({ toggleStyle, theme }) => {
  const router = useRouter()
  const { locale } = useRouter()
  const [vodInfoArr, setVodInfoArr] = useState<Array<VodInfoArr>>([
    {
      introImageName: '',
      fileInfo: '',
      linkPath: '',
      listingOrder: 0,
      transcodeStatus: TranscodeStatus['Wait'],
    },
  ]) //링크, playing 이미지 관리
  const [mainImgInfo, setMainImgInfo] = useState<MainImgInfo>({ mainImg: '', fileInfo: '' }) //mainImg 관리
  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [upLoading, setUploading] = useState(false) //데이터 업로딩 중 로딩 아이콘
  const [isInputDisabled, setIsInputDisabled] = useState(false)

  const vodStatus = ['Wait', 'Available', 'Active', 'Fail'] //vodStatus

  //받아온 Vod 아이디
  const vodId = router.query.id ? router.query.id?.toString() : ''

  //vod쿼리
  const [getVod, { data: vodData, refetch: refreshMe }] = useLazyQuery<
    FindVodByIdQuery,
    FindVodByIdQueryVariables
  >(VOD_QUERY)

  const [statusRadio, setStatusRadio] = useState(
    vodData?.findVodById.vod ? vodData?.findVodById.vod.vodStatus : 'Wait'
  ) //vod 상태

  //지분 설정을 위한 멤버 쿼리
  const [getMember, { data: memberData }] = useLazyQuery<
    FindMembersByTypeQuery,
    FindMembersByTypeQueryVariables
  >(FIND_MEMBERS_BY_TYPE_QUERY)

  //라이브 연결을 위한 뮤테이션
  const [lives, { data: livesData }] = useMutation<LivesMutation, LivesMutationVariables>(
    LIVES_MUTATION
  )

  const requiredText =
    locale === 'ko' ? '위 항목은 필수 항목입니다.' : 'The above items are mandatory.'

  const onCompleted = async (data: EditVodMutation) => {
    const {
      editVod: { ok },
    } = data

    if (ok && vodData && refreshMe) {
      await refreshMe()
    }
  }

  const [editVod, { loading: editLoading }] = useMutation<
    EditVodMutation,
    EditVodMutationVariables
  >(EDIT_VOD_MUTATION, { onCompleted })

  const [deleteVod] = useMutation<DeleteVodMutation, DeleteVodMutationVariables>(
    DELETE_VOD_MUTATION
  )

  //VOD 삭제
  const vodDelete = async () => {
    const { data } = await deleteVod({
      variables: {
        deleteVodInput: {
          vodId,
        },
      },
    })

    if (!data?.deleteVod.ok) {
      const message = locale === 'ko' ? data?.deleteVod.error?.ko : data?.deleteVod.error?.en
      notification.error({
        message,
      })
      throw new Error(message)
    } else {
      notification.success({
        message: locale === 'ko' ? '삭제가 완료 되었습니다.' : 'Has been completed',
      })

      setTimeout(() => {
        window.location.href = '/vod/vods'
      }, 500)
    }
  }

  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<VodCreateForm>({
    mode: 'onChange',
  })

  //라이브 채널 추가 버튼
  const onAddLive = (type: string) => {
    if (type === 'live') {
      const vod = {
        introImageName: '',
        fileInfo: '',
        linkPath: '',
        listingOrder: 0,
        transcodeStatus: TranscodeStatus['Wait'],
      }
      if (vodInfoArr.length < 8) {
        setVodInfoArr(() => vodInfoArr.concat(vod))
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
    setUploading(true)
    try {
      const { title, paymentAmount, content, liveId } = getValues()

      const vodLinkArr = [] //라이브 채널 링크 배열

      //memberShareData 유효성 확인, 100이 되야한다.
      if (!shareCheck(memberShareInfo, locale)) {
        setUploading(false)
        return
      }

      const mainImgFileName = mainImgInfo.mainImg || '' //메인 썸네일
      const nowDate = nowDateStr
      //vodStatus 가 Fail 상태이며 transcodeStatus 가 fail인 경우에만 vod 수정이 가능하다.
      if (vodData?.findVodById.vod && vodData?.findVodById.vod.vodStatus === 'FAIL') {
        for (let i = 0; i < vodInfoArr.length; i++) {
          //linkPathName
          const vodUrlInput: HTMLInputElement | null = document.querySelector(
            `input[name=vodFile_${i}]`
          )

          let introImageName = ''
          let vodName = ''
          //let vodUrlInputFilesName = ''
          if (vodUrlInput) {
            if (vodUrlInput?.files && vodUrlInput?.files[0] instanceof File) {
              vodName = `${
                process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
              }/going/vod/${vodId}/${vodId}_${i + 1}_${nowDate}.mp4`

              process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME &&
                (await S3.upload({
                  Bucket: process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME,
                  Key: vodName,
                  Body: vodUrlInput.files[0],
                  ACL: 'bucket-owner-read',
                }).promise())
              vodName = `${vodId}_${i + 1}_${nowDate}.mp4`
            }

            //처음 받아왔던 데이터의 introImgName 과 현재의 introImgName이 다르다면 업로드
            if (
              vodData?.findVodById.vod?.vodLinkInfo[i] &&
              vodInfoArr[i].introImageName !==
                vodData?.findVodById.vod?.vodLinkInfo[i].introImageName
            ) {
              //introImgNameName
              introImageName = `${
                process.env.NODE_ENV === 'development' ? 'dev' : 'dev'
              }/going/vod/${vodId}/intro/${vodId}_intro_${i + 1}_${nowDate}.jpg`
              process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
                (await S3.upload({
                  Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                  Key: introImageName,
                  Body: vodInfoArr[0].introImageName,
                  ACL: 'bucket-owner-read',
                }).promise())

              introImageName = `${vodId}_intro_$i + 1}_${nowDate}.jpg`
              //vodUrlInputFilesName = vodUrlInput?.files[0].name
            }
          }

          vodLinkArr.push({
            listingOrder: i + 1,
            linkPath: vodName === '' ? vodInfoArr[i].linkPath : vodName,
            introImageName: introImageName === '' ? vodInfoArr[i].introImageName : introImageName,
            transcodeStatus: vodInfoArr[i].transcodeStatus,
          })
        }
      }

      //메인 이미지 s3 업로드
      //아이디 생성
      // let mainImgFileName = mainImgInfo.mainImg //메인 썸네일
      // //MainThumbnail upload
      // if (mainImgInfo.fileInfo instanceof File) {
      //   mainImgFileName = `${
      //     process.env.NODE_ENV === 'development' ? 'dev' : 'dev'
      //   }/going/vod/${vodId.toString()}/main/${vodId.toString()}_main_${nowDate}.jpg`
      //   process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
      //     (await S3.upload({
      //       Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      //       Key: mainImgFileName,
      //       Body: mainImgInfo.fileInfo,
      //       ACL: 'public-read',
      //     }).promise())
      //   mainImgFileName = `${vodId.toString()}_main_${nowDate}.jpg`
      // }

      //playImg upload

      const { data } = await editVod({
        variables: {
          editVodInput: {
            _id: vodId,
            mainImageName:
              mainImgFileName === '' && vodData?.findVodById.vod?.mainImageName
                ? vodData?.findVodById.vod?.mainImageName
                : mainImgFileName,
            vodStatus:
              //현재 vodStatus가 fail 이면 wait 로 변경.
              vodData?.findVodById.vod?.vodStatus === 'FAIL'
                ? (VodStatus as any)['wait']
                : (VodStatus as any)[statusRadio],
            vodLinkInfo: vodLinkArr,
            vodShareInfo: {
              vodId: vodId,
              memberShareInfo,
            },
            liveId,
            content,
            paymentAmount: parseFloat(paymentAmount.toString()),
            title,
          },
        },
      })
      if (!data?.editVod.ok) {
        const message = locale === 'ko' ? data?.editVod.error?.ko : data?.editVod.error?.en
        notification.error({
          message,
        })

        throw new Error(message)
      } else {
        notification.success({
          message: locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed',
        })

        setTimeout(() => {
          window.location.href = '/vod/vods'
        }, 500)
      }
    } catch (error) {
      setUploading(false)
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
        type === 'playing' ? `input[name=introImgUrl_${index}]` : 'input[name=mainImgInput]'
      )

      if (file.originFileObj && fileInput) {
        //playing img 인 경우와 mainImg인 경우 로직 따로 처리
        if (type === 'playing') {
          setVodInfoArr(
            vodInfoArr.map((data, i) => {
              return i === index && file.originFileObj
                ? {
                    ...data,
                    fileInfo: file.originFileObj,
                    introImgName: file.originFileObj.name,
                    linkPath: '',
                  }
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
        type === 'playing' ? `input[name=introImgUrl_${index}]` : 'input[name=mainImgInput]'
      )

      if (fileInput) {
        if (type === 'playing') {
          setVodInfoArr(
            vodInfoArr.map((data, i) => {
              return i === index ? { ...data, fileInfo: '', introImageName: '' } : data
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
  }, [])

  useEffect(() => {
    const fetch = async () => {
      try {
        await lives({
          variables: {
            livesInput: {},
          },
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    const fetch = async () => {
      try {
        await getVod({
          variables: {
            vodInput: {
              vodId,
            },
          },
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetch()

    if (
      vodData?.findVodById.ok &&
      vodData?.findVodById.vod?.vodLinkInfo &&
      vodData?.findVodById.vod?.vodShareInfo.memberShareInfo
    ) {
      const infoResult = vodData?.findVodById.vod?.vodLinkInfo.map((data) => {
        return omit(data, ['__typename', 'playingImageName'])
      }) //liveInfoArr result
      const result = vodData?.findVodById.vod?.vodShareInfo.memberShareInfo.map((data) => {
        return omit(data, ['__typename'])
      }) //memberShareInfo result

      setMainImgInfo({
        ...mainImgInfo,
        mainImg: vodData?.findVodById.vod?.mainImageName,
      })
      setVodInfoArr(infoResult)
      setMemberShareInfo(result)
      setIsInputDisabled(vodData?.findVodById.vod?.vodStatus === 'WAIT')
    }
  }, [vodData])

  return (
    <>
      {upLoading && <Spinner />}
      <Layout toggleStyle={toggleStyle} theme={theme}>
        <MainWrapper>
          <div className="main-header">
            <h2>{locale === 'ko' ? 'Vod 관리' : 'Vod Edit'}</h2>
            <ol>
              <li>
                <Link href="/">
                  <a>{locale === 'ko' ? '홈' : 'Home'}</a>
                </Link>
              </li>
              <li>{locale === 'ko' ? 'Vod' : 'Vod'}</li>
              <li>{locale === 'ko' ? 'Vod 관리' : 'Vod Edit'}</li>
            </ol>
          </div>
          <div className="main-content">
            <Edit className="card">
              <Form name="createLiveForm" onSubmit={handleSubmit(onSubmit)}>
                <Radio.Group
                  defaultValue={vodData?.findVodById.vod?.vodStatus
                    .toLowerCase()
                    .replace(/^./, vodData?.findVodById.vod?.vodStatus[0].toUpperCase())}
                  key={vodData?.findVodById.vod?.vodStatus}
                  buttonStyle="solid">
                  {vodStatus.map((data, i) => {
                    return (
                      <Radio.Button
                        key={i}
                        value={data}
                        style={{ color: data === 'Fail' ? '#c00' : '' }}
                        onChange={() => setStatusRadio(data)}
                        disabled={data === 'Fail' || data === 'Wait' || isInputDisabled}>
                        {data}
                      </Radio.Button>
                    )
                  })}
                </Radio.Group>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                    <Controller
                      key={vodData?.findVodById.vod?.title}
                      defaultValue={vodData?.findVodById.vod?.title}
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
                          disabled={
                            isInputDisabled || vodData?.findVodById.vod?.vodStatus === 'ACTIVE'
                          }
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
                    <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                    <Controller
                      key={vodData?.findVodById.vod?.paymentAmount}
                      defaultValue={vodData?.findVodById.vod?.paymentAmount}
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
                          onChange={onChange}
                          disabled={
                            isInputDisabled || vodData?.findVodById.vod?.vodStatus === 'ACTIVE'
                          }
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
                    <span>Main {locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                    <Controller
                      key={vodData?.findVodById.vod?.mainImageName}
                      defaultValue={vodData?.findVodById.vod?.mainImageName?.toString()}
                      control={control}
                      name="mainThumbnail"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { onChange } }) => (
                        <Input
                          className="input"
                          name="mainImgInput"
                          placeholder="Please upload img. only png or jpg"
                          value={mainImgInfo.mainImg}
                          onChange={onChange}
                          disabled={true}
                        />
                      )}
                    />
                  </div>
                  {errors.mainThumbnail?.message && (
                    <div className="form-message">
                      <span>{errors.mainThumbnail.message}</span>
                    </div>
                  )}
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>
                      Vod
                      <span style={{ color: '#ada7a7' }}>
                        {locale === 'ko'
                          ? ' ※vod 최대 7개까지 추가할 수 있습니다. '
                          : ' ※Up to seven vod can be uploaded. '}
                      </span>
                    </span>
                    {vodInfoArr.map((data, index) => {
                      return (
                        <div key={index}>
                          <div>
                            <em className="fontSize12 mrT5">
                              Ch{index + 1}
                              {data.transcodeStatus === 'FAIL' ? (
                                <span style={{ color: 'red', marginLeft: '3px' }}>
                                  {locale === 'ko' ? '인코딩 실패' : 'fail'}
                                </span>
                              ) : null}
                            </em>
                            {index >= 1 && (
                              <Button
                                className="delectBtn"
                                disabled={
                                  isInputDisabled || vodData?.findVodById.vod?.vodStatus !== 'FAIL'
                                }
                                onClick={() => onDeleteBtn(index, setVodInfoArr, vodInfoArr)}>
                                {locale === 'ko' ? '삭제' : 'Delete'}
                              </Button>
                            )}
                          </div>
                          <Input
                            className="input"
                            type={'file'}
                            name={`vodFile_${index}`}
                            disabled={
                              isInputDisabled || vodData?.findVodById.vod?.vodStatus !== 'FAIL'
                            }
                            placeholder="Please upload the video.(only mp4)"
                          />
                          {vodInfoArr[index].linkPath && (
                            <Input
                              className="input"
                              name={`vodFile_${index}`}
                              placeholder="Please upload the video.(only mp4)"
                              key={vodInfoArr[index].linkPath}
                              defaultValue={vodInfoArr[index].linkPath}
                              disabled={true}
                              style={{ marginTop: '5px' }}
                            />
                          )}

                          <ImgUploadBtnWrap className="profile-edit">
                            <Popover
                              className="profile-edit-popover uploadBtn"
                              content={() =>
                                !(
                                  isInputDisabled || vodData?.findVodById.vod?.vodStatus !== 'FAIL'
                                ) && renderPopoverContent('playing', index)
                              }
                              trigger="click"
                              placement="bottomRight"
                            />
                            <Input
                              className="input mrT5"
                              name={`introImgUrl_${index}`}
                              placeholder="Please upload playingThumnail img. only png or jpg"
                              disabled={
                                isInputDisabled || vodData?.findVodById.vod?.vodStatus !== 'FAIL'
                              }
                              value={vodInfoArr[index].introImageName}
                            />
                          </ImgUploadBtnWrap>
                        </div>
                      )
                    })}
                    {vodInfoArr.length < 8 && (
                      <Button
                        className="thumbnailAddBtn"
                        onClick={() => onAddLive('live')}
                        disabled={
                          isInputDisabled || vodData?.findVodById.vod?.vodStatus !== 'FAIL'
                        }>
                        {locale === 'ko' ? '추가' : 'Add'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '내용' : 'Content'}</span>
                    <Controller
                      key={vodData?.findVodById.vod?.content}
                      defaultValue={vodData?.findVodById.vod?.content?.toString()}
                      control={control}
                      name="content"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <TextArea
                          className="input ant-input"
                          placeholder="Please upload content."
                          maxLength={1000}
                          value={value}
                          onChange={onChange}
                          disabled={true}
                        />
                      )}
                    />
                  </div>
                  {errors.content?.message && (
                    <div className="form-message">
                      <span>{errors.content.message}</span>
                    </div>
                  )}
                </div>

                <div className="form-item">
                  <div className="form-group">
                    <span>Live</span>
                    <Controller
                      key={vodData?.findVodById.vod?.liveId}
                      defaultValue={vodData?.findVodById.vod?.liveId?.toString()}
                      control={control}
                      name="liveId"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <Select value={value} onChange={onChange} disabled={true}>
                            {livesData?.lives.lives &&
                              livesData?.lives.lives.map((data, i) => {
                                return (
                                  <Select.Option key={i} value={data._id}>
                                    {data.title}
                                  </Select.Option>
                                )
                              })}
                          </Select>
                        </>
                      )}
                    />
                  </div>
                  {errors.liveId?.message && (
                    <div className="form-message">
                      <span>{errors.liveId.message}</span>
                    </div>
                  )}
                </div>
                <div className="form-item">
                  <div className="form-group">
                    {/* onChange 로직 변경, onChange 마다 리렌더링하게 되고있음.추후 로직 수정. _승철 */}
                    <span>{locale === 'ko' ? '지분' : 'Share'}</span>
                    {memberShareInfo.map((data, index) => {
                      return (
                        <div key={index}>
                          <div>
                            <em className="fontSize12 mrT5">{index + 1}</em>
                            {index >= 1 && (
                              <Button
                                className="delectBtn"
                                disabled={isInputDisabled}
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
                                    disabled={isInputDisabled}
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
                                    disabled={isInputDisabled}
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
                    <Button
                      className="thumbnailAddBtn"
                      onClick={() => onAddLive('member')}
                      disabled={isInputDisabled}>
                      {locale === 'ko' ? '추가' : 'Add'}
                    </Button>
                  </div>
                  {errors.share?.nickName?.message && (
                    <div className="form-message">
                      <span>{errors.share?.nickName.message}</span>
                    </div>
                  )}
                </div>
                <div className="form-item">
                  <div className="button-group">
                    <Button
                      type="primary"
                      role="button"
                      className="submit-button"
                      disabled={isInputDisabled}
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
                      onClick={vodDelete}
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
    </>
  )
}
export default CreateVod
