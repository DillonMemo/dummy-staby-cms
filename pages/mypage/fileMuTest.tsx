import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, notification, Popover, Select, Skeleton, Upload } from 'antd'
import styled from 'styled-components'
import { useMutation, useQuery } from '@apollo/client'
import { FormOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import moment from 'moment'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { defaultPalette, Form, MainWrapper, md, styleMode } from '../../styles/styles'

/** graphql */
import {
  EditAccountMutation,
  EditAccountMutationVariables,
  MemberType,
  MyQuery,
  TestUploadMutation,
  TestUploadMutationVariables,
} from '../../generated'
import { MY_QUERY } from '../../graphql/queries'
import { EDIT_ACCOUNT_MUTATION, TEST_UPLOAD_MUTATION } from '../../graphql/mutations'

/** utils */
import { S3 } from '../../lib/awsClient'
import { UploadFile } from 'antd/lib/upload/interface'

const noneProfileImg = '/static/img/profile-img.png'

type Props = styleMode

export interface IEditForm {
  profileImageName: UploadFile | string
  email: string
  password: string
  nickName: string
  memberType: MemberType
}

const FileMuTest: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const { getValues, handleSubmit, control, setValue } = useForm<IEditForm>({
    mode: 'onChange',
  })
  const { data: myData, refetch: refreshMe } = useQuery<MyQuery>(MY_QUERY)

  const onCompleted = async (data: TestUploadMutation) => {
    const {
      testUpload: { ok },
    } = data

    if (ok && myData) {
      await refreshMe()
    }
  }
  const [testUpload, { loading: editLoading }] = useMutation<
    TestUploadMutation,
    TestUploadMutationVariables
  >(TEST_UPLOAD_MUTATION, {
    onCompleted,
  })

  const onSubmit = async () => {
    try {
      const { profileImageName } = getValues()

      if (profileImageName instanceof File) {
        const { data } = await testUpload({
          variables: {
            upload: {
              file: profileImageName,
            },
          },
        })
      }

      if (!data?.testUpload.ok) {
        const message = locale === 'ko' ? data?.testUpload.error?.ko : data?.testUpload.error?.en
        notification.error({
          message,
        })
        throw new Error(message)
      } else {
        notification.success({
          message: locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed',
        })
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
      flex-flow: column nowrap;
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
          const profileNode: HTMLImageElement | null = document.querySelector('#profile')

          if (profileNode && src) {
            profileNode.src = src
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
      if (file.originFileObj) setValue('profileImageName', file)
    }

    /**
     * profile을 비우는 클릭 이벤트 핸들러 입니다.
     */
    const onRemoveProfileClick = () => {
      const profileNode: HTMLImageElement | null = document.querySelector('#profile')

      if (profileNode) {
        setValue('profileImageName', '')
        profileNode.src = noneProfileImg
      }
    }

    return (
      <Wrapper>
        <ImgCrop
          shape="round"
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

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '내 정보 관리' : 'Account Settings'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '마이페이지' : 'My page'}</li>
            <li>{locale === 'ko' ? '내 정보 관리' : 'Account Settings'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <div className="form-group">
                  <div className="profile-img-container">
                    <div className="profile-img">
                      <img
                        id="profile"
                        src={
                          myData?.my?.profileImageName
                            ? `https://image.staby.co.kr/${
                                myData?.my?.profileImageName
                              }?date=${moment().format('YYYYMMDDHHmmss')}`
                            : noneProfileImg
                        }
                        alt="profile"
                      />
                      {/* {myData?.my.profileImageName ? (
                        ) : (
                          <div className="none-profile-img"></div>
                        )} */}
                      <div className="profile-edit">
                        <Popover
                          className="profile-edit-popover"
                          content={renderPopoverContent}
                          trigger="click"
                          placement="bottomRight">
                          <Button size="small">
                            <FormOutlined size={10} />
                            {locale === 'ko' ? '편집' : 'Edit'}
                          </Button>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-item">
                <div className="button-group">
                  <Button
                    type="primary"
                    role="button"
                    htmlType="submit"
                    className="submit-button"
                    loading={editLoading}>
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

const Edit = styled.div`
  width: 50%;

  ${md} {
    width: 100%;
  }

  .profile-img-container {
    cursor: pointer;

    display: inline-flex;
    justify-content: center;

    .none-profile-img {
      width: 7.5rem;
      height: 7.5rem;
      border-radius: 50%;

      background-color: ${defaultPalette.accent1};
    }

    .profile-img {
      width: 7.5rem;
      height: 7.5rem;

      position: relative;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: contain;
      }

      .profile-edit {
        position: absolute;
        bottom: 2.5px;
        left: -5px;

        height: 1.5rem;

        > button {
          display: inline-flex;
          justify-content: center;
          align-items: center;

          padding: 0.5rem;

          font-size: 0.75rem;
        }
      }
    }
  }
`

export default FileMuTest
