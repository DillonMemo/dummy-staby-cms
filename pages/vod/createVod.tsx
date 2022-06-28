import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, Input, InputNumber, Select } from 'antd'
import { toast } from 'react-toastify'

import Link from 'next/link'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import TextArea from 'rc-textarea'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CREATE_VOD_MUTATION, LIVES_MUTATION } from '../../graphql/mutations'
import {
  CreateVodMutation,
  CreateVodMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  LivesMutation,
  LivesMutationVariables,
  MemberType,
  RatioType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY } from '../../graphql/queries'

/** utils */
import { S3 } from '../../lib/awsClient'
import * as mongoose from 'mongoose'
import { liveImgCheckExtension, nowDateStr, onDeleteBtn, shareCheck } from '../../Common/commonFn'
import Spinner from '../../components/Spinner'

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
  fileInfo: any
  mainImg?: string
}

export type VodInfoArr = {
  playingImg?: string
  fileInfo: any
}

const ShareWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
`

const CreateVod: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()
  const { Option } = Select
  const [vodInfoArr, setVodInfoArr] = useState<Array<VodInfoArr>>([
    { playingImg: '', fileInfo: '' },
  ]) //링크, playing 이미지 관리

  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [upLoading, setUploading] = useState(false) //스피너

  const [createVod] = useMutation<CreateVodMutation, CreateVodMutationVariables>(
    CREATE_VOD_MUTATION,
    {
      onError: (error) => {
        toast.error(error.message, {
          theme: localStorage.theme || 'light',
        })
      },
    }
  )

  //지분 설정을 위한 멤버쿼리
  const [getMember, { data: memberData }] = useLazyQuery<
    FindMembersByTypeQuery,
    FindMembersByTypeQueryVariables
  >(FIND_MEMBERS_BY_TYPE_QUERY)

  //연결된 live 를 위한 live query
  const [getLives, { data: livesData }] = useMutation<LivesMutation, LivesMutationVariables>(
    LIVES_MUTATION
  )

  const requiredText =
    locale === 'ko' ? '위 항목은 필수 항목입니다.' : 'The above items are mandatory.'

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
      const live = {
        fileInfo: '',
        playingImg: '',
      }
      if (vodInfoArr.length < 8) {
        setVodInfoArr(() => vodInfoArr.concat(live))
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

      //메인 이미지 s3 업로드
      //아이디 생성
      const id = new mongoose.Types.ObjectId()
      let mainImgFileName = '' //메인 썸네일

      const nowDate = nowDateStr

      //MainThumbnail upload
      const mainImgInput: HTMLInputElement | null =
        document.querySelector(`input[name=mainThumbnail]`)

      const imgCheck = await liveImgCheckExtension(mainImgInput, id.toString(), locale, 'vod')

      if (!imgCheck) {
        setUploading(false)
        return
      } else {
        mainImgFileName = `${imgCheck}`
      }

      //playImg upload
      for (let i = 0; i < vodInfoArr.length; i++) {
        //linkPathName
        const vodUrlInput: HTMLInputElement | null = document.querySelector(
          `input[name=vodFile_${i}]`
        )
        const introImgInput: HTMLInputElement | null = document.querySelector(
          `input[name=playImgUrl_${i}]`
        )

        let introImageName = ''
        let vodName = ''

        if (vodUrlInput && vodUrlInput?.files && vodUrlInput?.files[0] instanceof File) {
          //vod 및 이미지의 확장자 확인
          if (!vodUrlInput.files[0].type.includes('mp4')) {
            toast.error(
              locale === 'ko' ? 'VOD의 확장자를 확인해주세요.' : 'Please check the VOD extension.',
              {
                theme: localStorage.theme || 'light',
                onOpen: () => setUploading(false),
              }
            )
            return
          }

          //vodName
          vodName = `${
            process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
          }/going/vod/${id}/${id}_${i + 1}_${nowDate}.mp4`

          process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME &&
            (await S3.upload({
              Bucket: process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME,
              Key: vodName,
              Body: vodUrlInput.files[0],
              ACL: 'bucket-owner-read',
            }).promise())

          //이미지 확장자체크

          let fileExtension = ''

          if (introImgInput && introImgInput?.files && introImgInput?.files[0] instanceof File) {
            if (
              introImgInput.files[0].type.includes('jpg') ||
              introImgInput.files[0].type.includes('png') ||
              introImgInput.files[0].type.includes('jpeg')
            ) {
              //이미지 확장자 추출
              fileExtension =
                introImgInput.files[0].name.split('.')[
                  introImgInput.files[0].name.split('.').length - 1
                ]

              //playingImgName
              introImageName = `${
                process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
              }/going/vod/${id}/intro/${id}_intro_${i + 1}_${nowDate}.${fileExtension}`

              process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
                (await S3.upload({
                  Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                  Key: introImageName,
                  Body: introImgInput.files[0],
                  ACL: 'bucket-owner-read',
                }).promise())
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
          } else {
            toast.error(locale === 'ko' ? '이미지를 확인해 주세요.' : 'Please check the Img.', {
              theme: localStorage.theme || 'light',
              onOpen: () => setUploading(false),
            })
          }

          introImageName = `${id}_intro_${i + 1}_${nowDate}.${fileExtension}`

          vodName = `${id}_${i + 1}_${nowDate}.mp4`

          vodLinkArr.push({
            listingOrder: i + 1,
            linkPath: vodName || '',
            introImageName: introImageName,
          })
        }
      }

      const { data } = await createVod({
        variables: {
          createVodInput: {
            _id: id.toString(),
            mainImageName: mainImgFileName,
            vodLinkInfo: vodLinkArr,
            vodShareInfo: {
              vodId: id.toString(),
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
      if (!data?.createVod.ok) {
        const message = locale === 'ko' ? data?.createVod.error?.ko : data?.createVod.error?.en
        toast.error(message, {
          theme: localStorage.theme || 'light',
          onOpen: () => setUploading(false),
        })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 750,
          onClose: () => push('/vod/vods'),
        })
      }
    } catch (error) {
      setUploading(false)
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
  }, [])

  useEffect(() => {
    const fetch = async () => {
      try {
        await getLives({
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
            <h2>{locale === 'ko' ? 'Vod 추가' : 'Live Create'}</h2>
            <ol>
              <li>
                <Link href="/">
                  <a>{locale === 'ko' ? '홈' : 'Home'}</a>
                </Link>
              </li>
              <li>{locale === 'ko' ? 'Vod' : 'Vod'}</li>
              <li>{locale === 'ko' ? 'Vod 추가' : 'Vod Create'}</li>
            </ol>
          </div>
          <div className="main-content">
            <Edit className="card">
              <Form name="createLiveForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '제목' : 'Title'}</span>
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

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                    <Controller
                      control={control}
                      name="paymentAmount"
                      rules={{
                        required: requiredText,
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

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                    <Controller
                      control={control}
                      name="vodRatioType"
                      rules={{
                        required: requiredText,
                      }}
                      defaultValue={RatioType.Horizontal}
                      render={({ field: { onChange, value } }) => (
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
                  {errors.vodRatioType?.message && (
                    <div className="form-message">
                      <span>{errors.vodRatioType.message}</span>
                    </div>
                  )}
                </div>

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>Main {locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                    <Controller
                      control={control}
                      name="mainThumbnail"
                      rules={{
                        required: requiredText,
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          className="input"
                          type="file"
                          value={value}
                          name="mainThumbnail"
                          placeholder="Please upload img. only png or jpg"
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

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>
                      Vod
                      <span style={{ color: '#ada7a7' }}>
                        {locale === 'ko'
                          ? ' ※vod 최대 8개까지 추가할 수 있습니다. '
                          : ' ※Up to eight live can be uploaded. '}
                      </span>
                    </span>
                    {vodInfoArr.map((data, index) => {
                      return (
                        <div key={index} className="mt-15">
                          <div>
                            <em className="fontSize12 mrT5">Ch{index + 1}_Vod</em>
                            {index >= 1 && (
                              <Button
                                className="delectBtn"
                                onClick={() => onDeleteBtn(index, setVodInfoArr, vodInfoArr)}>
                                {locale === 'ko' ? '삭제' : 'Delete'}
                              </Button>
                            )}
                          </div>
                          <Input
                            className="input"
                            type={'file'}
                            name={`vodFile_${index}`}
                            accept=".mp4"
                            placeholder="Please upload the video.(only mp4)"
                          />
                          <em className="fontSize12 mrT5">Ch{index + 1}_Img</em>

                          <Input
                            type="file"
                            className="input mrT5"
                            name={`playImgUrl_${index}`}
                            placeholder="Please upload playingThumnail img. only png or jpg"
                          />
                        </div>
                      )
                    })}
                    {vodInfoArr.length < 8 && (
                      <Button className="thumbnailAddBtn" onClick={() => onAddLive('live')}>
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

                <div className="form-item mt-harf">
                  <div className="form-group">
                    <span>Live</span>
                    <Controller
                      control={control}
                      name="liveId"
                      rules={{
                        required: requiredText,
                      }}
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
                  {errors.liveId?.message && (
                    <div className="form-message">
                      <span>{errors.liveId.message}</span>
                    </div>
                  )}
                </div>
                <div className="form-item mt-harf">
                  <div className="form-group">
                    {/* onChange 로직 변경, onChange 마다 리렌더링하게 되고있음.추후 로직 수정.*/}
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
                  {errors.share && (
                    <div className="form-message">
                      <span>{requiredText}</span>
                    </div>
                  )}
                </div>
                <div className="form-item mt-harf">
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
                      htmlType="submit"
                      className="submit-button ml-harf"
                      disabled={Object.keys(errors).includes('paymentAmount')}>
                      {locale === 'ko' ? '저장' : 'save'}
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
