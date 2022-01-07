import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, Input, notification, Popover, Select, Upload } from 'antd'

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
import { CREATE_VOD_MUTATION, LIVES_MUTATION } from '../../graphql/mutations'
import {
  CreateVodMutation,
  CreateVodMutationVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  LivesMutation,
  LivesMutationVariables,
  MemberType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY } from '../../graphql/queries'

/** utils */
import { S3 } from '../../lib/awsClient'
import * as mongoose from 'mongoose'
import { nowDateStr, onDeleteBtn, shareCheck } from '../../Common/commonFn'
import Spinner from '../../components/Spinner'

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
  playingImg?: string
  fileInfo: Blob | string
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
  const { locale } = useRouter()
  const [vodInfoArr, setVodInfoArr] = useState<Array<VodInfoArr>>([
    { playingImg: '', fileInfo: '' },
  ]) //링크, playing 이미지 관리
  const [mainImgInfo, setMainImgInfo] = useState<MainImgInfo>({ mainImg: '', fileInfo: '' }) //mainImg 관리
  const [memberShareInfo, setMemberShareInfo] = useState<Array<ShareInfo>>([
    { memberId: '', nickName: '', priorityShare: 0, directShare: 0 },
  ]) //지분 관리
  const [upLoading, setUploading] = useState(false) //스피너

  const [createVod] = useMutation<CreateVodMutation, CreateVodMutationVariables>(
    CREATE_VOD_MUTATION
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
      if (vodInfoArr.length < 7) {
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
      const { title, paymentAmount, content, liveId } = getValues()

      const vodLinkArr = [] //라이브 채널 링크 배열

      //memberShareData 유효성 확인, 100이 되야한다.
      if (!shareCheck(memberShareInfo, locale)) {
        return
      }

      //메인 이미지 s3 업로드
      //아이디 생성
      const id = new mongoose.Types.ObjectId() as any
      let mainImgFileName = '' //메인 썸네일

      //MainThumbnail upload
      if (mainImgInfo.fileInfo instanceof File) {
        mainImgFileName = `${
          process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
        }/going/vod/${id.toString()}/vod/${id.toString()}_main_${nowDateStr}.jpg`
        process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
          (await S3.upload({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: mainImgFileName,
            Body: mainImgInfo.fileInfo,
            ACL: 'public-read',
          }).promise())

        mainImgFileName = `${id.toString()}_main_${nowDateStr}.jpg`
      }

      //playImg upload
      for (let i = 0; i < vodInfoArr.length; i++) {
        //linkPathName
        const vodUrlInput: HTMLInputElement | null = document.querySelector(
          `input[name=vodFile_${i}]`
        )

        let introImageName = ''
        let vodName = ''

        if (vodUrlInput && vodUrlInput?.files && vodUrlInput?.files[0] instanceof File) {
          //playingImgName
          introImageName = `${
            process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
          }/going/vod/${id}/intro/${id}__intro_${i + 1}_${nowDateStr}.jpg`

          vodName = `${
            process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
          }/going/vod/${id}/${id}_${i + 1}_${nowDateStr}.mp4`

          process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME &&
            (await S3.upload({
              Bucket: process.env.NEXT_PUBLIC_AWS_VOD_BUCKET_NAME,
              Key: vodName,
              Body: vodUrlInput.files[0],
              ACL: 'bucket-owner-read',
            }).promise())

          process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
            (await S3.upload({
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Key: introImageName,
              Body: vodInfoArr[i].playingImg,
              ACL: 'bucket-owner-read',
            }).promise())

          introImageName = `${id}__intro_${i + 1}_${nowDateStr}.jpg`

          vodLinkArr.push({
            listingOrder: i + 1,
            linkPath: vodUrlInput?.files[0].name || '',
            introImageName: introImageName,
          })
        }
      }

      const { data } = await createVod({
        variables: {
          createVodInput: {
            _id: id,
            mainImageName: mainImgFileName,
            vodLinkInfo: vodLinkArr,
            vodShareInfo: {
              vodId: id,
              memberShareInfo,
            },
            liveId,
            content,
            paymentAmount: parseFloat(paymentAmount.toString()),
            title,
          },
        },
      })
      if (!data?.createVod.ok) {
        const message = locale === 'ko' ? data?.createVod.error?.ko : data?.createVod.error?.en
        notification.error({
          message,
        })
        throw new Error(message)
        setUploading(false)
      } else {
        notification.success({
          message: locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed',
        })

        setTimeout(() => {
          window.location.href = '/vod/vods'
        }, 500)
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
          setVodInfoArr(
            vodInfoArr.map((data, i) => {
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
          setVodInfoArr(
            vodInfoArr.map((data, i) => {
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
                    <span>Main Thumbnail</span>
                    <Controller
                      control={control}
                      name="mainThumbnail"
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
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>
                      Vod
                      <span style={{ color: '#ada7a7' }}>
                        {locale === 'ko'
                          ? ' ※vod 최대 7개까지 추가할 수 있습니다. '
                          : ' ※Up to eight live can be uploaded. '}
                      </span>
                    </span>
                    {vodInfoArr.map((data, index) => {
                      return (
                        <div key={index}>
                          <div>
                            <em className="fontSize12 mrT5">Ch{index + 1}</em>
                            {index >= 1 && (
                              <Button
                                className="delectBtn"
                                onClick={() => onDeleteBtn(index, setVodInfoArr, vodInfoArr)}>
                                삭제
                              </Button>
                            )}
                          </div>
                          <Input
                            className="input"
                            type={'file'}
                            name={`vodFile_${index}`}
                            placeholder="Please upload the video.(only mp4)"
                            //disabled={isAuto === 'Auto' ? true : false}
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
                              value={vodInfoArr[index].playingImg}
                            />
                          </ImgUploadBtnWrap>
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
                <div className="form-item">
                  <div className="form-group">
                    <span>Content</span>
                    <Controller
                      control={control}
                      name="content"
                      rules={{
                        required: '위 항목은 필수 항목입니다.',
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

                <div className="form-item">
                  <div className="form-group">
                    <span>Live</span>
                    <Controller
                      control={control}
                      name="liveId"
                      rules={{
                        required: '위 항목은 필수 항목입니다.',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <Select value={value} onChange={onChange}>
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
                  {/* {errors.share?.message && (
                    <div className="form-message">
                      <span>{errors.share.message}</span>
                    </div>
                  )} */}
                </div>
                <div className="form-item">
                  <div className="button-group">
                    <Button
                      type="primary"
                      role="button"
                      //htmlType="submit"
                      className="submit-button"
                      onClick={onSubmit}>
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
