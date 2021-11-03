import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, Popover, Select, Skeleton, Upload } from 'antd'
import styled from 'styled-components'
import { useMutation, useQuery } from '@apollo/client'
import { FormOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { UploadChangeParam } from 'antd/lib/upload'

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
} from '../../generated'
import { MY_QUERY } from '../../graphql/queries'
import { EDIT_ACCOUNT_MUTATION } from '../../graphql/mutations'

type Props = styleMode

export interface IEditForm {
  profileImageName: File | string
  email: string
  password: string
  nickname: string
  memberType: MemberType
}

const MypageEdit: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const { getValues, handleSubmit, control } = useForm<IEditForm>({
    mode: 'onChange',
  })
  const { loading, data: myData, refetch: refreshMe } = useQuery<MyQuery>(MY_QUERY)

  const onCompleted = async (data: EditAccountMutation) => {
    const {
      editAccount: { ok },
    } = data

    if (ok && myData) {
      await refreshMe()
    }
  }
  const [editAccount, { loading: editLoading }] = useMutation<
    EditAccountMutation,
    EditAccountMutationVariables
  >(EDIT_ACCOUNT_MUTATION, {
    onCompleted,
  })

  const onSubmit = () => {
    const { email, password, nickname, memberType, profileImageName } = getValues()
    debugger
    // editAccount({
    //   variables: {
    //     editUserInput: {
    //       email,
    //       role,
    //       ...(username !== '' && { username }),
    //       ...(password !== '' && { password }),
    //     },
    //   },
    // })
  }

  const renderPopoverContent = () => {
    const Wrapper = styled.div`
      display: inline-flex;
      flex-flow: column nowrap;
      button {
        border: 1px solid ${({ theme }) => theme.border};
      }
    `

    const onProfileChange = async ({ file }: UploadChangeParam) => {
      try {
        let src = file.url

        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file.originFileObj as any)
            reader.onload = () => resolve(reader.result as any)
          })
          const profileNode: HTMLImageElement | null = document.querySelector('#profile')

          if (profileNode && src) {
            profileNode.src = src
          }
        }

        // const resultFile: File = file.originFileObj
        // setValue('profileImageName', resultFile)
        // = async () => {
        //   const profileNode: HTMLImageElement | null = document.querySelector('.profile')
        //   console.log(reader.result)
        //   debugger

        //   // if (profileNode) {
        //   // }
        // }
      } catch (error) {
        console.error(error)
      }
    }

    // const onProfilePreview = async (file: UploadFile<any>) => {
    //   console.log(file)
    //   debugger
    //   const src = file.url
    // }

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
            onChange={onProfileChange}
            showUploadList={false}>
            <Button>{locale === 'ko' ? '사진 업로드' : 'Upload a photo'}</Button>
          </Upload>
        </ImgCrop>
        <Button onClick={() => console.log('click 2')}>
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
            {loading ? (
              <Form>
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <div className="form-item" key={`form-${index}`}>
                      <div className="form-group">
                        <Skeleton.Input style={{ width: '100%', minHeight: '3rem' }} active />
                      </div>
                    </div>
                  ))}
                <div className="form-item">
                  <div className="button-group">
                    <Skeleton.Button style={{ minHeight: '3rem' }} active />
                  </div>
                </div>
              </Form>
            ) : (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-item">
                  <div className="form-group">
                    <div className="profile-img-container">
                      <div className="profile-img">
                        <img
                          id="profile"
                          src={myData?.my?.profileImageName || '/static/img/profile-img.png'}
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
                  <div className="form-group">
                    <span>Email</span>
                    <Controller
                      control={control}
                      name="email"
                      defaultValue={myData?.my.email}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          className="input"
                          placeholder="Email"
                          value={value}
                          onChange={onChange}
                          disabled
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>Password</span>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { value, onChange } }) => (
                        <Input.Password
                          className="input"
                          placeholder="password"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>Member Type</span>
                    <Controller
                      control={control}
                      name="memberType"
                      defaultValue={myData?.my.memberType}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          onChange={onChange}
                          disabled={
                            !(
                              myData?.my.memberType === MemberType.Admin ||
                              myData?.my.memberType === MemberType.System
                            )
                          }>
                          {Object.keys(MemberType).map((type, index) => (
                            <Select.Option value={type} key={`type-${index}`}>
                              {type}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>Nickname</span>
                    <Controller
                      control={control}
                      name="nickname"
                      defaultValue={myData?.my.nickname}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className="input"
                          placeholder="Nickname"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
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
            )}
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

export default MypageEdit
