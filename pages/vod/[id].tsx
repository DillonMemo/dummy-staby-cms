import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, Input, InputNumber, notification, Radio, Select } from 'antd'

import Link from 'next/link'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import TextArea from 'rc-textarea'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMutation, useQuery } from '@apollo/client'
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
  MemberShareInfo,
  MemberType,
  RatioType,
  TranscodeStatus,
  VodLinkInfo,
  VodStatus,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY, VOD_QUERY } from '../../graphql/queries'

/** utils */
import { S3 } from '../../lib/awsClient'
import { liveImgCheckExtension, nowDateStr, onDeleteBtn, shareCheck } from '../../Common/commonFn'
import Spinner from '../../components/Spinner'
import { omit } from 'lodash'
import { toast } from 'react-toastify'
import ChangeFileInput from '../../components/ChangeFileInput'
import * as mongoose from 'mongoose'

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

const CreateVod: NextPage<Props> = ({ toggleStyle, theme }) => {
  const router = useRouter()
  const { Option } = Select
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
  const {
    data: vodData,
    refetch: refreshMe,
    loading: isVodIdLoading,
  } = useQuery<FindVodByIdQuery, FindVodByIdQueryVariables>(VOD_QUERY, {
    variables: {
      vodInput: {
        vodId,
      },
    },
    onCompleted: (data: FindVodByIdQuery) => {
      if (
        data?.findVodById.ok &&
        data?.findVodById.vod?.vodLinkInfo &&
        data?.findVodById.vod?.vodShareInfo.memberShareInfo
      ) {
        const infoResult = data?.findVodById.vod?.vodLinkInfo.map((data: VodLinkInfo) => {
          return omit(data, ['__typename', 'playingImageName'])
        }) //liveInfoArr result
        const result = data?.findVodById.vod?.vodShareInfo.memberShareInfo.map(
          (data: MemberShareInfo) => {
            return omit(data, ['__typename'])
          }
        ) //memberShareInfo result

        setMainImgInfo({
          ...mainImgInfo,
          mainImg: data?.findVodById.vod?.mainImageName,
        })
        setVodInfoArr(infoResult as any)
        setMemberShareInfo(result as any)
        setIsInputDisabled(data?.findVodById.vod?.vodStatus !== 'AVAILABLE')
      }
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statusRadio, setStatusRadio] = useState(
    vodData?.findVodById.vod ? vodData?.findVodById.vod.vodStatus : 'Wait'
  ) //vod 상태
  const [isStatusChange, setIsStatusChange] = useState(false)

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
    if (window.confirm('정말 삭제하시겠습니까?')) {
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
  }

  const {
    getValues,
    handleSubmit,
    setValue,
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
      const { title, paymentAmount, content, liveId, vodRatioType } = getValues()

      const vodLinkArr = [] //라이브 채널 링크 배열

      //memberShareData 유효성 확인, 100이 되야한다.
      if (!shareCheck(memberShareInfo, locale)) {
        setUploading(false)
        return
      }

      // const mainImgFileName = mainThumbnail || '' //메인 썸네일
      const nowDate = nowDateStr

      //vodStatus 가 Fail 상태이며 transcodeStatus 가 fail인 경우에만 vod 수정이 가능하다.
      if (vodData?.findVodById.vod) {
        for (let i = 0; i < vodInfoArr.length; i++) {
          //linkPathName
          const vodUrlInput: HTMLInputElement | null = document.querySelector(
            `input[name=vodFile_${i}]`
          )
          const introImgInput: HTMLInputElement | null = document.querySelector(
            `input[name=introImgUrl_${i}]`
          )

          let introImageName = ''
          let vodName = ''
          //let vodUrlInputFilesName = ''
          if (vodUrlInput) {
            if (vodUrlInput?.files && vodUrlInput?.files[0] instanceof File) {
              //vod 확장자 체크
              if (!vodUrlInput.files[0].type.includes('mp4')) {
                toast.error(
                  locale === 'ko'
                    ? 'VOD의 확장자를 확인해주세요.'
                    : 'Please check the VOD extension.',
                  {
                    theme: localStorage.theme || 'light',
                    onOpen: () => setUploading(false),
                  }
                )
                return
              }

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
          }

          //처음 받아왔던 데이터의 introImgName 과 현재의 introImgName이 다르다면 업로드
          if (introImgInput && introImgInput?.files && introImgInput?.files[0] instanceof File) {
            const introImgInputType = introImgInput.files[0].type
            const fileExtension =
              introImgInput.files[0].name.split('.')[
                introImgInput.files[0].name.split('.').length - 1
              ]
            if (
              vodData?.findVodById.vod?.vodLinkInfo[i] &&
              introImgInput.files[0].name !==
                vodData?.findVodById.vod?.vodLinkInfo[i].introImageName
            ) {
              //img 확장자 체크
              if (
                introImgInputType.includes('jpg') ||
                introImgInputType.includes('jpeg') ||
                introImgInput.files[0].type.includes('png')
              ) {
                //introImgNameName
                introImageName = `${
                  process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
                }/going/vod/${vodId}/intro/${vodId}_intro_${i + 1}_${nowDate}.${fileExtension}`
                process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
                  (await S3.upload({
                    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                    Key: introImageName,
                    Body: introImgInput.files[0],
                    ACL: 'bucket-owner-read',
                  }).promise())

                introImageName = `${vodId}_intro_${i + 1}_${nowDate}.${fileExtension}`
                //vodUrlInputFilesName = vodUrlInput?.files[0].name
              } else {
                toast.error(
                  locale === 'ko'
                    ? '이미지의 확장자를 확인해주세요.'
                    : 'Please check the Img extension.',
                  {
                    theme: localStorage.theme || 'light',
                    onOpen: () => setUploading(false),
                  }
                )
                return
              }
            }
          }

          vodLinkArr.push({
            listingOrder: i + 1,
            linkPath: vodName === '' ? vodInfoArr[i].linkPath : vodName,
            introImageName: introImageName === '' ? vodInfoArr[i].introImageName : introImageName,
            //실패시 wait로 변경
            transcodeStatus:
              vodInfoArr[i].transcodeStatus === 'FAIL'
                ? TranscodeStatus['Wait' as keyof typeof TranscodeStatus]
                : vodInfoArr[i].transcodeStatus,
          })
        }
      }

      // 메인 이미지 s3 업로드
      // 아이디 생성
      // let mainImgFileName = mainThumbnail //메인 썸네일
      // MainThumbnail upload
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

      const id = new mongoose.Types.ObjectId()
      let mainImgFileName = '' //메인 썸네일

      //MainThumbnail upload
      const mainImgInput: HTMLInputElement | null =
        document.querySelector(`input[name=mainImgInput]`)

      if (mainImgInput?.files && mainImgInput?.files[0] instanceof File) {
        const imgCheck = await liveImgCheckExtension(mainImgInput, id.toString(), locale, 'vod')

        if (!imgCheck) {
          setUploading(false)
          return
        } else {
          mainImgFileName = `${imgCheck}`
        }
      }

      //playImg upload

      const { data } = await editVod({
        variables: {
          editVodInput: {
            _id: vodId,
            mainImageName:
              mainImgFileName === '' && vodData?.findVodById.vod?.mainImageName
                ? vodData?.findVodById.vod?.mainImageName
                : mainImgFileName,
            vodStatus: isStatusChange
              ? VodStatus[statusRadio as keyof typeof VodStatus]
              : vodData?.findVodById.vod?.vodStatus,
            //현재 vodStatus가 fail 이면 wait 로 변경.
            // vodData?.findVodById.vod?.vodStatus === 'FAIL'
            //   ? (VodStatus as any)['wait']
            //   : (VodStatus as any)[statusRadio],

            vodLinkInfo: vodLinkArr,
            vodShareInfo: {
              vodId: vodId,
              memberShareInfo,
            },
            liveId,
            content,
            paymentAmount: parseFloat(paymentAmount.toString()),
            title,
            vodRatioType,
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

  // live 목록 조회
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
              <li>
                <Link
                  href={{
                    pathname: '/vod/vods',
                    query: { ...omit(router.query, 'id') },
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
              {isVodIdLoading || (
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
                          onChange={() => {
                            setStatusRadio(data)
                            setIsStatusChange(true)
                          }}
                          disabled={data === 'Fail' || data === 'Wait'}>
                          {data}
                        </Radio.Button>
                      )
                    })}
                  </Radio.Group>
                  <div className="form-item mt-half">
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

                  <div className="form-item mt-half">
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
                          <InputNumber
                            className="input"
                            placeholder="Please enter the paymentAmount."
                            value={value}
                            max={65535}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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

                  <div className="form-item mt-half">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                      <Controller
                        key={vodData?.findVodById.vod?.vodRatioType}
                        control={control}
                        name="vodRatioType"
                        rules={{ required: requiredText }}
                        defaultValue={vodData?.findVodById.vod?.vodRatioType}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <Select
                              defaultValue={vodData?.findVodById.vod?.vodRatioType}
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

                  <div className="form-item mt-half">
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
                        render={({ field: { onChange, value } }) => (
                          // <Input
                          //   className="input"
                          //   name="mainImgInput"
                          //   placeholder="Please upload img. only png or jpg"
                          //   value={mainImgInfo.mainImg}
                          //   onChange={onChange}
                          //   disabled={true}
                          // />
                          <ChangeFileInput
                            src={value}
                            setValue={setValue}
                            Fname="mainThumbnail"
                            name="mainImgInput"
                            onChange={onChange}
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
                  <div className="form-item mt-half">
                    <div className="form-group">
                      <span>
                        Vod
                        <span style={{ color: '#ada7a7' }}>
                          {locale === 'ko'
                            ? ' ※vod 최대 8개까지 추가할 수 있습니다. '
                            : ' ※Up to eight vod can be uploaded. '}
                        </span>
                      </span>
                      {vodInfoArr.map((data, index) => {
                        return (
                          <div key={index} className="mt-15">
                            <div>
                              <em className="fontSize12 mt-half">
                                Ch{index + 1}_Vod
                                {data.transcodeStatus === 'FAIL' ? (
                                  <span style={{ color: 'red', marginLeft: '3px' }}>
                                    {locale === 'ko' ? '인코딩 실패' : 'fail'}
                                  </span>
                                ) : null}
                              </em>
                              {/* {index >= 1 && (
                              <Button
                                className="delectBtn"
                                disabled={data.transcodeStatus !== 'FAIL'}
                                onClick={() => onDeleteBtn(index, setVodInfoArr, vodInfoArr)}>
                                {locale === 'ko' ? '삭제' : 'Delete'}
                              </Button>
                            )} */}
                            </div>
                            {data.transcodeStatus === 'FAIL' && (
                              <Input
                                className="input"
                                type={'file'}
                                name={`vodFile_${index}`}
                                disabled={data.transcodeStatus !== 'FAIL'}
                                accept=".mp4"
                                placeholder="Please upload the video.(only mp4)"
                              />
                            )}
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

                            <em className="fontSize12 mt-half">Ch{index + 1}_Img</em>
                            {data.transcodeStatus === 'FAIL' && (
                              <Input
                                type="file"
                                className="input mt-half"
                                disabled={data.transcodeStatus !== 'FAIL'}
                                name={`playImgUrl_${index}`}
                                placeholder="Please upload playingThumnail img. only png or jpg"
                              />
                            )}
                            {/* <Input
                            className="input mrT5"
                            name={`introImgUrl_${index}`}
                            placeholder="Please upload playingThumnail img. only png or jpg"
                            // type="file"
                            disabled={true}
                            value={vodInfoArr[index].introImageName}
                            // value={vodInfoArr[index].introImageName as string}
                          /> */}
                            <ChangeFileInput
                              src={vodInfoArr[index].introImageName}
                              name={`introImgUrl_${index}`}
                            />
                          </div>
                        )
                      })}
                      {vodInfoArr.length < 8 && (
                        <Button
                          className="thumbnailAddBtn"
                          onClick={() => onAddLive('live')}
                          disabled={true}>
                          {locale === 'ko' ? '추가' : 'Add'}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="form-item mt-half">
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
                            // disabled={isInputDisabled}
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

                  <div className="form-item mt-half">
                    <div className="form-group">
                      <span>Live</span>
                      <Controller
                        key={vodData?.findVodById.vod?.liveId}
                        defaultValue={vodData?.findVodById.vod?.liveId?.toString()}
                        control={control}
                        name="liveId"
                        // rules={{
                        //   required: requiredText,
                        // }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Select
                              showSearch
                              optionFilterProp="children"
                              value={value}
                              onChange={onChange}>
                              {livesData?.lives.lives &&
                                livesData?.lives.lives.map((data, i) => {
                                  return (
                                    <Option key={i} value={data._id}>
                                      {data.title}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </>
                        )}
                      />
                    </div>
                    {/* {errors.liveId?.message && (
                      <div className="form-message">
                        <span>{errors.liveId.message}</span>
                      </div>
                    )} */}
                  </div>
                  <div className="form-item mt-half">
                    <div className="form-group">
                      {/* onChange 로직 변경, onChange 마다 리렌더링하게 되고있음.추후 로직 수정. _승철 */}
                      <span>
                        {locale === 'ko'
                          ? '지분 - 우선환수, 직분배'
                          : 'Share - priorityShare, directShare'}
                      </span>
                      {memberShareInfo.map((data, index) => {
                        return (
                          <div key={index}>
                            <div>
                              <em className="fontSize12 mt-half">{index + 1}</em>
                              {index >= 1 && (
                                <Button
                                  className="delectBtn"
                                  // disabled={isInputDisabled}
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
                                      // disabled={isInputDisabled}
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
                                      // disabled={isInputDisabled}
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
                      <Button
                        className="thumbnailAddBtn"
                        onClick={() => onAddLive('member')}
                        // disabled={isInputDisabled}
                      >
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
                      <Link href="/vod/vods">
                        <a>
                          <Button className="submit-button" type="primary" role="button">
                            목록
                          </Button>
                        </a>
                      </Link>
                      <Button
                        type="primary"
                        role="button"
                        className="submit-button ml-half"
                        disabled={vodData?.findVodById.vod?.vodStatus === 'WAIT'}
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
              )}
            </Edit>
          </div>
        </MainWrapper>
      </Layout>
    </>
  )
}
export default CreateVod
