import { useLazyQuery, useMutation } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  EditMemberByIdMutation,
  EditMemberByIdMutationVariables,
  FindMemberByIdQuery,
  FindMemberByIdQueryVariables,
  MemberType,
} from '../../generated'
import { MEMBER_QUERY } from '../../graphql/queries'
import { defaultPalette, Form, MainWrapper, md, styleMode } from '../../styles/styles'
import { Button, Input, Select } from 'antd'
import { toast } from 'react-toastify'

import Link from 'next/link'
import styled from 'styled-components'

/** components */
import Layout from '../../components/Layout'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { EDIT_MEMBER_BY_ID_MUTATION } from '../../graphql/mutations'

/** util */
import { bankList } from '../../Common/commonFn'

type Props = styleMode

export interface MemberEditForm {
  email: string
  password: string
  nickName: string
  memberType: MemberType
  activities: string
  totalPoint: number
  paidPoint: number
  freePoint: number
  memberStatus: string
  createDate: string
  depositor?: string
  bankName?: string
  accountNumber?: string
}

const MemberDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const router = useRouter()
  const { locale } = useRouter()
  const { getValues, handleSubmit, control, watch } = useForm<MemberEditForm>({
    mode: 'onChange',
  })

  const memberId = router.query.id ? router.query.id?.toString() : ''

  const [getMember, { data: memberData, refetch: refreshMe }] = useLazyQuery<
    FindMemberByIdQuery,
    FindMemberByIdQueryVariables
  >(MEMBER_QUERY)
  const watchMemberType = watch('memberType')

  const onCompleted = async (data: EditMemberByIdMutation) => {
    const {
      editMemberById: { ok },
    } = data

    if (ok && memberData && refreshMe) {
      await refreshMe()
    }
  }

  const [editMember, { loading: editLoading }] = useMutation<
    EditMemberByIdMutation,
    EditMemberByIdMutationVariables
  >(EDIT_MEMBER_BY_ID_MUTATION, { onCompleted })

  const onSubmit = async () => {
    try {
      const {
        password,
        nickName,
        memberType,
        paidPoint,
        freePoint,
        depositor,
        bankName,
        accountNumber,
      } = getValues()

      const { data } = await editMember({
        variables: {
          editMemberInput: {
            _id: memberId,
            ...(password !== '' && { password }),
            ...(nickName !== '' && { nickName }),
            ...(paidPoint === 0 ? { paidPoint: 0 } : { paidPoint: +paidPoint }),
            ...(freePoint === 0 ? { freePoint: 0 } : { freePoint: +freePoint }),
            memberType: memberType,
            //...(point !== 0 && { point }),
            ...(watchMemberType === MemberType.Business && {
              accountInfo: {
                depositor: depositor || '',
                bankName: bankName || '',
                accountNumber: accountNumber || '',
              },
            }),
          },
        },
      })

      if (!data?.editMemberById.ok) {
        const message =
          locale === 'ko' ? data?.editMemberById.error?.ko : data?.editMemberById.error?.en
        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 750,
          onClose: () => router.push('/member/members', '/member/members', { locale }),
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getMember({
      variables: {
        memberInput: {
          memberId,
        },
      },
    })
  }, [memberData])

  // useEffect(() => {
  //   debugger
  //   console.log(getValues('memberType'))
  // }, [getValues('memberType')])

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
            <li>{locale === 'ko' ? '회원관리' : 'Member Settings'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '이메일' : 'Email'}</span>
                  <Controller
                    key={memberData?.findMemberById.member?.email}
                    control={control}
                    name="email"
                    defaultValue={memberData?.findMemberById.member?.email}
                    render={({ field: { value, onChange } }) => (
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
                  <span>{locale === 'ko' ? '비밀번호' : 'Password'}</span>
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
                  <span>{locale === 'ko' ? '닉네임' : 'Nickname'}</span>
                  <Controller
                    key={memberData?.findMemberById.member?.nickName}
                    control={control}
                    name="nickName"
                    defaultValue={memberData?.findMemberById.member?.nickName}
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
                    key={memberData?.findMemberById.member?.memberType}
                    control={control}
                    defaultValue={memberData?.findMemberById.member?.memberType}
                    name="memberType"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        defaultValue={memberData?.findMemberById.member?.memberType}
                        value={value}
                        onChange={onChange}>
                        {(Object.values(MemberType) as string[]).map((data, index) => (
                          <Select.Option value={data} key={`type-${index}`}>
                            {data}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div
                className={[
                  'collapse',
                  watchMemberType === MemberType.Business ? 'open' : undefined,
                ].join(' ')}>
                {watchMemberType === MemberType.Business && (
                  <>
                    <div className="form-item">
                      <div className="form-group">
                        <span>{locale === 'ko' ? '은행' : 'BankName'}</span>
                        <Controller
                          control={control}
                          name="bankName"
                          defaultValue={
                            memberData?.findMemberById.member?.accountInfo?.bankName || bankList[0]
                          }
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

                    <div className="form-item">
                      <div className="form-group">
                        <span>{locale === 'ko' ? '예금주' : 'Depositor'}</span>
                        <Controller
                          control={control}
                          name="depositor"
                          defaultValue={memberData?.findMemberById.member?.accountInfo?.depositor}
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

                    <div className="form-item">
                      <div className="form-group">
                        <span>{locale === 'ko' ? '계좌번호' : 'AccountNumber'}</span>
                        <Controller
                          control={control}
                          name="accountNumber"
                          defaultValue={
                            memberData?.findMemberById.member?.accountInfo?.accountNumber
                          }
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
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>Activities</span>
                  <Controller
                    key={memberData?.findMemberById.member?.memberStatus}
                    control={control}
                    name="memberStatus"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="MemberStatus"
                        defaultValue={memberData?.findMemberById.member?.memberStatus}
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
                  <span>Total Point</span>
                  <Controller
                    key={memberData?.findMemberById.member?.point.totalPoint}
                    control={control}
                    name="totalPoint"
                    defaultValue={memberData?.findMemberById.member?.point.totalPoint}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="point"
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
                  <span>Paid Point</span>
                  <Controller
                    key={memberData?.findMemberById.member?.point.paidPoint}
                    control={control}
                    name="paidPoint"
                    defaultValue={memberData?.findMemberById.member?.point.paidPoint}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="paidPoint"
                        type="number"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>Free Point</span>
                  <Controller
                    key={memberData?.findMemberById.member?.point.freePoint}
                    control={control}
                    name="freePoint"
                    defaultValue={memberData?.findMemberById.member?.point.freePoint}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="freePoint"
                        type="number"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>RegistrationDate</span>
                  <Controller
                    key={memberData?.findMemberById.member?.createDate.split('T')[0]}
                    control={control}
                    name="createDate"
                    defaultValue={memberData?.findMemberById.member?.createDate.split('T')[0]}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        className="input"
                        placeholder="MemberStatus"
                        value={value}
                        onChange={onChange}
                        disabled
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
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default MemberDetail

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

  .collapse {
    opacity: 0;
    visibility: hidden;
    height: 0;
    max-height: 0;
    transition: 0.5s ease;

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
