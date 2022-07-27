import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Input, Select, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

/** styles */
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'

/** components */
import { CreateAccountMutation, CreateAccountMutationVariables, MemberType } from '../../generated'
import Layout from '../../components/Layout'
import { CREATE_ACCOUNT_MUTATION } from '../../graphql/mutations'
import { useState } from 'react'
import { bankList } from '../../Common/commonFn'

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
  depositor?: string
  bankName?: string
  accountNumber?: string
  monitorFlag: boolean
}

const CreateMember: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload } = useRouter()
  const [accountInfo, setAccountInfo] = useState<MemberType>(MemberType.Normal)
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
      const { email, password, nickName, depositor, bankName, accountNumber, monitorFlag } =
        getValues()
      const { data } = await createMember({
        variables: {
          createMemberInput: {
            email,
            password,
            nickName,
            memberType: accountInfo,
            monitorFlag: monitorFlag,
            ...(accountInfo === MemberType.Business && {
              accountInfo: {
                depositor: depositor || '',
                bankName: bankName || '',
                accountNumber: accountNumber || '',
              },
            }),
          },
        },
      })
      if (!data?.createAccount.ok) {
        const message =
          locale === 'ko' ? data?.createAccount.error?.ko : data?.createAccount.error?.en
        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '추가되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 750,
          onClose: () => reload(),
        })
      }
    } catch (e) {
      console.error(e)
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
                  <span>{locale === 'ko' ? '멤버타입' : 'Member Type'}</span>
                  <Controller
                    control={control}
                    name="memberType"
                    render={({ field: { value } }) => (
                      <Select
                        value={value}
                        defaultValue={MemberType.Normal}
                        onChange={(e) => setAccountInfo(e)}>
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
              {/* 계좌정보 (멤버타입이 BUSINESS 인 경우에만) */}
              {accountInfo === MemberType.Business && (
                <>
                  <div className="form-item mt-1">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '은행' : 'BankName'}</span>
                      <Controller
                        control={control}
                        name="bankName"
                        defaultValue={bankList[0]}
                        render={({ field: { value, onChange } }) => (
                          <Select value={value} onChange={onChange}>
                            {bankList.map((data, index) => (
                              <Select.Option value={data} key={`type-${index}`}>
                                {data}
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
                        render={({ field: { value, onChange } }) => (
                          <Input
                            className="input"
                            placeholder="depositor"
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
                        render={({ field: { value, onChange } }) => (
                          <Input
                            className="input"
                            type="number"
                            placeholder="accountNumber"
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
              )}

              <div className="form-item mt-1">
                <div className="form-group">
                  <span>{locale === 'ko' ? '이메일' : 'Email'}</span>
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
              <div className="form-item mt-1">
                <div className="form-group">
                  <span>{locale === 'ko' ? '비밀번호' : 'Password'}</span>
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
              <div className="form-item mt-1">
                <div className="form-group">
                  <span>{locale === 'ko' ? '닉네임' : 'Nickname'}</span>
                  <Controller
                    control={control}
                    name="nickName"
                    rules={{
                      required: '닉네임 입력은 필수입니다',
                      pattern: {
                        value:
                          /^((((?=.[가-힣A-Za-z])(?=.\d)))|((?=.*[가-힣A-Za-z])))[가-힣A-Za-z\d]{1,12}$/,
                        message: '닉네임 형식이 아닙니다.',
                      },
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
              <div className="form-item mt-1">
                <div className="form-group" style={{ width: 'fit-content' }}>
                  <span>{locale === 'ko' ? '모니터링 권한' : 'MonitorFlag'}</span>
                  <Controller
                    control={control}
                    name="monitorFlag"
                    defaultValue={false}
                    render={({ field: { value, onChange } }) => (
                      <Switch style={{ width: '50%' }} defaultChecked={value} onChange={onChange} />
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
