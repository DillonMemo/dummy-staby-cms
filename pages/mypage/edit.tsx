import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, Popover, Radio, Select, Skeleton, Upload } from 'antd'
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
} from '../../generated'
import { MY_QUERY } from '../../graphql/queries'
import { EDIT_ACCOUNT_MUTATION } from '../../graphql/mutations'

/** utils */
import { S3 } from '../../lib/awsClient'
import { toast } from 'react-toastify'
import { bankList } from '../../Common/commonFn'

const noneProfileImg = '/static/img/profile-img.png'

type Props = styleMode

export interface IEditForm {
  profileImageName: File | string
  email: string
  checkPassword: boolean
  password: string
  confirmPassword: string
  nickName: string
  memberType: MemberType
  depositor?: string
  bankName?: string
  accountNumber?: string
}

const MypageEdit: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload } = useRouter()
  const {
    getValues,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IEditForm>({
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
  const watchMemberType = watch('memberType')
  const watchCheckPassword = watch('checkPassword')

  const onSubmit = async () => {
    try {
      const {
        password,
        nickName,
        memberType,
        profileImageName,
        depositor,
        bankName,
        accountNumber,
      } = getValues()
      let saveFileName = ''
      if (profileImageName instanceof File) {
        console.log('node_env :', process.env.NODE_ENV)
        // const lastIndexOf: number = profileImageName.name.lastIndexOf('.')
        saveFileName =
          process.env.NODE_ENV === 'development'
            ? `dev/going/profile/${myData?.my._id}.png`
            : `prod/going/profile/${myData?.my._id}.png`
        // ? `dev/going/profile/${myData?.my._id}.${profileImageName.name.slice(lastIndexOf + 1)}`
        // : `prod/going/profile/${myData?.my._id}.${profileImageName.name.slice(lastIndexOf + 1)}`

        if (process.env.NEXT_PUBLIC_AWS_BUCKET_NAME) {
          await S3.deleteObjects({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Delete: {
              Objects: [
                {
                  Key: saveFileName,
                },
              ],
            },
          }).promise()

          await S3.upload({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: saveFileName,
            Body: profileImageName,
            ACL: 'public-read',
          }).promise()
        }
      }
      const { data } = await editAccount({
        variables: {
          editMemberInput: {
            profileImageName:
              profileImageName instanceof File ? saveFileName : myData?.my.profileImageName,
            ...(password && { password }),
            memberType,
            ...(nickName && { nickName }),
            ...(myData?.my.memberType === MemberType.Business && {
              accountInfo: {
                depositor: depositor || '',
                bankName: bankName || '',
                accountNumber: accountNumber || '',
              },
            }),
          },
        },
      })

      if (!data?.editAccount.ok) {
        const message = locale === 'ko' ? data?.editAccount.error?.ko : data?.editAccount.error?.en
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
      if (file.originFileObj) setValue('profileImageName', file.originFileObj)
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
            {loading ? (
              <Form>
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <div className="form-item" key={`form-${index}`}>
                      <div className="form-group">
                        <Skeleton.Input active style={{ width: '100%', minHeight: '5rem' }} />
                      </div>
                    </div>
                  ))}
                <div className="form-item">
                  <div className="button-group">
                    <Skeleton.Button active style={{ minHeight: '3rem' }} />
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
                          src={
                            myData?.my?.profileImageName
                              ? `https://image.staby.co.kr/${
                                  myData?.my?.profileImageName
                                }?v=${moment().format('YYYYMMDDHHmmss')}`
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
                <div className="form-grid col-2 mt-1 gap-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '이메일' : 'Email'}</span>
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
                      <span>{locale === 'ko' ? '비밀번호 변경' : 'Change Password'}</span>
                      <Controller
                        control={control}
                        name="checkPassword"
                        defaultValue={false}
                        render={({ field: { value, onChange } }) => (
                          <Radio.Group
                            className="gap-3"
                            onChange={({ target: { value } }) => {
                              if (!value) {
                                setValue('password', '')
                                setValue('confirmPassword', '')
                              }
                              onChange(value)
                            }}
                            value={value}>
                            <Radio value={false}>
                              {locale === 'ko' ? '미변경' : 'be unchanged'}
                            </Radio>
                            <Radio value={true}>{locale === 'ko' ? '변경' : 'be changed'}</Radio>
                          </Radio.Group>
                        )}
                      />
                    </div>
                  </div>
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '비밀번호' : 'Password'}</span>
                      <Controller
                        control={control}
                        name="password"
                        rules={{
                          required: {
                            value: watchCheckPassword,
                            message:
                              locale === 'ko' ? '필수 입력 입니다.' : 'It is a required input.',
                          },
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Input.Password
                            className="input"
                            placeholder="password"
                            disabled={!watchCheckPassword}
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </div>
                    {errors.password?.message && (
                      <div className="form-message">
                        <span>{errors.password.message}</span>
                      </div>
                    )}
                  </div>
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '비밀번호 확인' : 'Confirm Password'}</span>
                      <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{
                          required: watchCheckPassword,
                          validate: {
                            isConfirm: (value) => getValues('password') === value,
                          },
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Input.Password
                            className="input"
                            placeholder="confirm password"
                            disabled={!watchCheckPassword}
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </div>
                    {errors.confirmPassword && errors.confirmPassword.type === 'required' && (
                      <div className="form-message">
                        <span>
                          {locale === 'ko' ? '필수 입력 입니다.' : 'It is a required input.'}
                        </span>
                      </div>
                    )}
                    {errors.confirmPassword && errors.confirmPassword.type === 'isConfirm' && (
                      <div className="form-message">
                        <span>
                          {locale === 'ko'
                            ? '비밀번호가 일치 하지 않습니다.'
                            : 'The passwords do not match.'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-grid col-2 mt-1 gap-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '닉네임' : 'Nickname'}</span>
                      <Controller
                        control={control}
                        name="nickName"
                        defaultValue={myData?.my.nickName}
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
                    <div className="form-group">
                      <span>{locale === 'ko' ? '회원유형' : 'Member Type'}</span>
                      <Controller
                        key={myData?.my.memberType}
                        control={control}
                        name="memberType"
                        defaultValue={myData?.my.memberType}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            defaultValue={myData?.my.memberType}
                            value={value}
                            onChange={onChange}
                            disabled={
                              !(
                                myData?.my.memberType === MemberType.Service ||
                                myData?.my.memberType === MemberType.System
                              )
                            }>
                            {Object.values(MemberType).map((type, index) => {
                              const typeValue =
                                locale === 'ko'
                                  ? type === MemberType.Normal
                                    ? '일반'
                                    : type === MemberType.Business
                                    ? '비즈니스'
                                    : type === MemberType.Contents
                                    ? '컨텐츠 관리자'
                                    : type === MemberType.Cx
                                    ? 'CX 관리자'
                                    : type === MemberType.Service
                                    ? '서비스 관리자'
                                    : type === MemberType.System
                                    ? '시스템 관리자'
                                    : type
                                  : type
                              return (
                                <Select.Option value={type} key={`type-${index}`}>
                                  {typeValue}
                                </Select.Option>
                              )
                            })}
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid col-2 gap-1">
                  <div
                    className={[
                      'collapse',
                      myData?.my.memberType === MemberType.Business ||
                      watchMemberType === MemberType.Business
                        ? 'open'
                        : undefined,
                    ].join(' ')}>
                    <>
                      <div className="form-item">
                        <div className="form-group">
                          <span>{locale === 'ko' ? '은행' : 'BankName'}</span>
                          <Controller
                            control={control}
                            name="bankName"
                            defaultValue={myData?.my.accountInfo?.bankName || bankList[0]}
                            render={({ field: { value, onChange } }) => (
                              <Select value={value} onChange={onChange}>
                                {bankList.map((bank, index) => (
                                  <Select.Option value={bank} key={`type-${index}`}>
                                    {bank}
                                  </Select.Option>
                                ))}
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      <div className="form-item mt-1">
                        <div className="form-group">
                          <span>{locale === 'ko' ? '예금주' : 'Depositor'}</span>
                          <Controller
                            control={control}
                            name="depositor"
                            defaultValue={myData?.my.accountInfo?.depositor}
                            render={({ field: { value, onChange } }) => (
                              <Input
                                className="input"
                                placeholder={locale === 'ko' ? '예금주' : 'Depositor'}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="form-item mt-1">
                        <div className="form-group">
                          <span>{locale === 'ko' ? '계좌번호' : 'AccountNumber'}</span>
                          <Controller
                            control={control}
                            name="accountNumber"
                            defaultValue={myData?.my.accountInfo?.accountNumber}
                            render={({ field: { value, onChange } }) => (
                              <Input
                                className="input"
                                type="number"
                                placeholder={locale === 'ko' ? '계좌번호' : 'AccountNumber'}
                                value={value}
                                onKeyPress={({ key, preventDefault }) => {
                                  if (key === '.' || key === 'e' || key === '+' || key === '-') {
                                    preventDefault()
                                    return false
                                  }
                                }}
                                onChange={onChange}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </>
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
  width: 100%;

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

  .collapse {
    opacity: 0;
    visibility: hidden;
    height: 0;
    max-height: 0;
    transition: 0.5s ease;

    grid-column-start: 2;

    ${md} {
      grid-column-start: 1;
    }

    &.open {
      margin-top: 1rem;
      opacity: 1;
      visibility: visible;
      height: 100%;
      max-height: 15rem;
      transition: 0.5s ease;
    }
  }
`

export default MypageEdit
