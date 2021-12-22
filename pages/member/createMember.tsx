import { useRouter } from 'next/router'
import { CreateAccountMutation, CreateAccountMutationVariables, MemberType } from '../../generated'
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, Input, notification, Select } from 'antd'

import Link from 'next/link'

/** components */
import Layout from '../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import { NextPage } from 'next'
import { useMutation } from '@apollo/client'
import { CREATE_ACCOUNT_MUTATION } from '../../graphql/mutations'

type Props = styleMode

export interface MemberCreateForm {
  email: string
  password: string
  nickName: string
  memberType: MemberType
  activities?: string
  totalPoint?: number
  paidPoint?: number
  freePoint?: number
  memberStatus?: string
  createDate: string
}

const CreateMember: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const {
    getValues,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<MemberCreateForm>({
    mode: 'onChange',
  })

  const [createMember, { data: createMemberMutaionResult, loading: createLoading }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION)
  const onSubmit = async () => {
    try {
      const { email, password, nickName, memberType } = getValues()
      const { data } = await createMember({
        variables: {
          createMemberInput: {
            email,
            password,
            nickName,
            memberType,
          },
        },
      })
      if (!data?.createAccount.ok) {
        const message =
          locale === 'ko' ? data?.createAccount.error?.ko : data?.createAccount.error?.en
        notification.error({
          message,
        })
        throw new Error(message)
      } else {
        notification.success({
          message: locale === 'ko' ? '추가되었습니다.' : 'Has been completed',
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '회원 관리' : 'Member Settings'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '멤버' : 'Member'}</li>
            <li>{locale === 'ko' ? '회원추가' : 'Member Create'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <div className="form-group">
                  <span>Member Type</span>
                  <Controller
                    control={control}
                    name="memberType"
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} defaultValue={MemberType.Normal} onChange={onChange}>
                        {Object.keys(MemberType).map((data, index) => (
                          <Select.Option value={data.toUpperCase()} key={`type-${index}`}>
                            {data}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Email</span>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: '이메일 입력은 필수입니다',
                      pattern: {
                        value:
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: '이메일 형식이 아닙니다',
                      },
                    }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="Email"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                {errors.email?.message && (
                  <div className="form-message">
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Password</span>
                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: '비밀번호 입력은 필수입니다',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <Input.Password
                        className="input"
                        //크롬, 사파리 자동완성 방지
                        autoComplete="new-password"
                        placeholder="password"
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
                  <span>Nickname</span>
                  <Controller
                    control={control}
                    name="nickName"
                    rules={{
                      required: '닉네임 입력은 필수입니다',
                    }}
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

                {errors.nickName?.message && (
                  <div className="form-message">
                    <span>{errors.nickName.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item">
                <div className="button-group">
                  <Button
                    type="primary"
                    role="button"
                    htmlType="submit"
                    className="submit-button"
                    disabled={!isValid}
                    loading={createLoading}>
                    {locale === 'ko' ? '추가' : 'create'}
                  </Button>
                </div>
              </div>
              {createMemberMutaionResult?.createAccount.error && (
                <div className="form-message">
                  <span>
                    {locale === 'ko'
                      ? createMemberMutaionResult?.createAccount.error.ko
                      : createMemberMutaionResult?.createAccount.error.en}
                  </span>
                </div>
              )}
            </Form>
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default CreateMember
