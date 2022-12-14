import { useLazyQuery, useMutation } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
// import {
//   EditMemberByIdMutation,
//   EditMemberByIdMutationVariables,
//   FindMemberByIdQuery,
//   FindMemberByIdQueryVariables,
//   MemberReportStatus,
//   MemberType,
//   SuspendMemberByIdMutation,
//   SuspendMemberByIdMutationVariables,
// } from '../../generated'
import { MEMBER_QUERY } from '../../graphql/queries'
import { EDIT_MEMBER_BY_ID_MUTATION, SUSPEND_MEMBER_BY_ID_MUTATION } from '../../graphql/mutations'
import { defaultPalette, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, Input, Modal, Radio, Select, Skeleton, Switch } from 'antd'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Link from 'next/link'
import styled from 'styled-components'
import moment from 'moment'
import { omit } from 'lodash'

/** components */
import Layout from '../../components/Layout'
import HistoryTabs from '../../components/member/historyTabs'

/** util */
import { bankList } from '../../Common/commonFn'

type Props = styleMode

export interface MemberEditForm {
  email: string
  checkPassword: boolean
  password: string
  nickName: string
  // memberType: MemberType
  activities: string
  totalPoint: number
  paidPoint: number
  freePoint: number
  memberStatus: string
  createDate: string
  depositor?: string
  bankName?: string
  accountNumber?: string
  monitorFlag: boolean
}

const MemberDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const router = useRouter()
  const { locale } = useRouter()

  const [suspendModal, setSuspendModal] = useState({
    isVisible: false,
    isConfirmVisible: false,
    isLoading: false,
    value: 1,
  })
  const [releaseModal, setReleaseModal] = useState({
    isVisible: false,
  })

  const {
    getValues,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemberEditForm>({
    mode: 'onChange',
  })

  const memberId = router.query.id ? router.query.id?.toString() : ''

  const [getMember, { data: memberData, refetch: refreshMe }] = useLazyQuery<
    FindMemberByIdQuery,
    FindMemberByIdQueryVariables
  >(MEMBER_QUERY, {
    variables: {
      memberInput: {
        memberId,
      },
    },
  })
  const [suspendMember, { loading: isSuspendMemberLoading }] = useMutation<
    SuspendMemberByIdMutation,
    SuspendMemberByIdMutationVariables
  >(SUSPEND_MEMBER_BY_ID_MUTATION)
  const watchMemberType = watch('memberType')
  const watchCheckPassword = watch('checkPassword')
  const modalConfig = {
    okText: locale === 'ko' ? '??????' : 'OK',
    cancelText: locale === 'ko' ? '??????' : 'Cancel',
  }
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
        monitorFlag,
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
            monitorFlag: monitorFlag || false,
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
        toast.success(locale === 'ko' ? '????????? ?????? ???????????????.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 1000,
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

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '?????? ??????' : 'Member Settings'}</h2>
          <ol>
            <li>
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '???' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: '/member/members',
                  query: { ...omit(router.query, 'id') },
                }}
                as={'/member/members'}
                locale={locale}>
                <a>{locale === 'ko' ? '??????' : 'Member'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '????????????' : 'Member Settings'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid col-2 gap-1">
                {memberData ? (
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '????????????' : 'Member Type'}</span>
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
                ) : (
                  <Skeleton.Input active style={{ width: '100%', margin: '4px 0' }} />
                )}

                <div className="form-item">
                  <span>{locale === 'ko' ? '????????????' : 'Member Number'}</span>
                  <p>{router.query.id}</p>
                </div>
              </div>

              <div className="form-grid col-2 gap-1">
                <div
                  className={[
                    'collapse',
                    watchMemberType === MemberType.Business ? 'open' : undefined,
                  ].join(' ')}>
                  {watchMemberType === MemberType.Business && (
                    <>
                      <div className="form-item">
                        <div className="form-group">
                          <span>{locale === 'ko' ? '??????' : 'BankName'}</span>
                          <Controller
                            control={control}
                            name="bankName"
                            defaultValue={
                              memberData?.findMemberById.member?.accountInfo?.bankName ||
                              bankList[0]
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

                      <div className="form-item mt-1">
                        <div className="form-group">
                          <span>{locale === 'ko' ? '?????????' : 'Depositor'}</span>
                          <Controller
                            control={control}
                            name="depositor"
                            defaultValue={memberData?.findMemberById.member?.accountInfo?.depositor}
                            render={({ field: { value, onChange } }) => (
                              <Input
                                className="input"
                                placeholder={locale === 'ko' ? '?????????' : 'Depositor'}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="form-item mt-1">
                        <div className="form-group">
                          <span>{locale === 'ko' ? '????????????' : 'AccountNumber'}</span>
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
                                placeholder={locale === 'ko' ? '????????????' : 'AccountNumber'}
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
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '?????????' : 'Nickname'}</span>
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
                    <span>{locale === 'ko' ? '?????????' : 'Email'}</span>
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
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '????????????' : 'Activities'}</span>
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
                    <span>{locale === 'ko' ? '?????????' : 'Registration Date'}</span>
                    {memberData?.findMemberById.member?.createDate ? (
                      <p>
                        {moment(memberData?.findMemberById.member?.createDate).format(
                          'YYYY.MM.DD HH:mm:ss'
                        )}
                      </p>
                    ) : (
                      <Skeleton.Input active style={{ width: '50%', margin: '4px 0' }} />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '????????????' : 'Suspension Status'}</span>
                    {memberData?.findMemberById.member?.report.memberReportStatus ? (
                      <div className="row">
                        <p>
                          {locale === 'ko'
                            ? memberData.findMemberById.member.report.memberReportStatus ===
                              MemberReportStatus.None
                              ? '??????'
                              : `?????? (?????? ?????? : ${moment(
                                  memberData.findMemberById.member.report.releaseDate
                                ).format('YYYY.MM.DD 00:00')})`
                            : memberData.findMemberById.member.report.memberReportStatus ===
                              MemberReportStatus.None
                            ? 'NONE'
                            : `BLOCK (release of suspension : ${moment(
                                memberData.findMemberById.member.report.releaseDate
                              ).format('YYYY.MM.DD 00:00')})`}
                        </p>
                        {memberData.findMemberById.member.report.memberReportStatus ===
                        MemberReportStatus.None ? (
                          <Button
                            type="primary"
                            role="button"
                            htmlType="button"
                            onClick={() =>
                              setSuspendModal((prev) => ({ ...prev, isVisible: true }))
                            }>
                            {locale === 'ko' ? '?????? ??????' : 'Suspend'}
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            role="button"
                            htmlType="button"
                            onClick={() =>
                              setReleaseModal((prev) => ({ ...prev, isVisible: !prev.isVisible }))
                            }>
                            {locale === 'ko' ? '?????? ??????' : 'Continue'}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Skeleton.Input active style={{ width: '100%', margin: '4px 0' }} />
                    )}
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '??????????????????' : 'Last login date'}</span>
                    {memberData?.findMemberById.member?.lastLoginDate ? (
                      <p>
                        {moment(memberData?.findMemberById.member?.lastLoginDate).format(
                          'YYYY.MM.DD HH:mm:ss'
                        )}
                      </p>
                    ) : (
                      <Skeleton.Input active style={{ width: '50%', margin: '4px 0' }} />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '??????????????????' : 'Push received'}</span>
                    {memberData?.findMemberById.member?.pushInfo[0] ? (
                      <p>
                        {memberData.findMemberById.member.pushInfo[0].notificationFlag
                          ? locale === 'ko'
                            ? '??????'
                            : 'agree'
                          : locale === 'ko'
                          ? '??????'
                          : 'disagree'}
                      </p>
                    ) : (
                      <Skeleton.Input active style={{ width: '30%', margin: '4px 0' }} />
                    )}
                  </div>
                </div>

                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '????????????' : 'Report'}</span>
                    {memberData?.findMemberById.member?.report ? (
                      <p>
                        {memberData.findMemberById.member.report.chatCount +
                          memberData.findMemberById.member.report.commentCount}
                      </p>
                    ) : (
                      <Skeleton.Input active style={{ width: '30%', margin: '4px 0' }} />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '???????????? ??????' : 'Change Password'}</span>
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
                            }
                            onChange(value)
                          }}
                          value={value}>
                          <Radio value={false}>{locale === 'ko' ? '?????????' : 'be unchanged'}</Radio>
                          <Radio value={true}>{locale === 'ko' ? '??????' : 'be changed'}</Radio>
                        </Radio.Group>
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '????????????' : 'Password'}</span>
                    <Controller
                      control={control}
                      name="password"
                      rules={{
                        required: {
                          value: watchCheckPassword,
                          message:
                            locale === 'ko' ? '?????? ?????? ?????????.' : 'It is a required input.',
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
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group" style={{ width: 'fit-content' }}>
                    <span>{locale === 'ko' ? '???????????? ??????' : 'Monitor Permission'}</span>
                    {memberData?.findMemberById.member && (
                      <Controller
                        control={control}
                        name="monitorFlag"
                        defaultValue={memberData?.findMemberById.member.monitorFlag || false}
                        render={({ field: { value, onChange } }) => (
                          <Switch style={{ width: '50%' }} checked={value} onChange={onChange} />
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '??? ?????????' : 'Total Point'}</span>
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
                  <span>{locale === 'ko' ? '?????? ?????????' : 'Paid Point'}</span>
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
                  <span>{locale === 'ko' ? '?????? ?????????' : 'Free Point'}</span>
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
              </div> */}

              <div className="form-item">
                <div className="button-group">
                  <Button
                    type="primary"
                    role="button"
                    htmlType="submit"
                    className="submit-button"
                    loading={editLoading}>
                    {locale === 'ko' ? '??????' : 'save'}
                  </Button>
                </div>
              </div>
            </Form>
          </Edit>

          <HistoryTabs memberId={memberId} />
        </div>
      </MainWrapper>

      <Modal
        {...modalConfig}
        title={locale === 'ko' ? '?????? ??????' : 'Suspend'}
        visible={suspendModal.isVisible}
        confirmLoading={suspendModal.isLoading}
        maskClosable={false}
        onOk={() =>
          setSuspendModal((prev) => ({
            ...prev,
            isLoading: !prev.isLoading,
            isConfirmVisible: !prev.isConfirmVisible,
          }))
        }
        onCancel={() => setSuspendModal((prev) => ({ ...prev, isVisible: !prev.isVisible }))}>
        <div>
          <p>{locale === 'ko' ? '?????? ????????? ??????????????????.' : 'Please select a suspend period.'}</p>
          <Select
            defaultValue={suspendModal.value}
            onChange={(value) => setSuspendModal((prev) => ({ ...prev, value }))}>
            {[1, 3, 5, 7, 15].map((day, index) => (
              <Select.Option value={day} key={index}>
                {day}???
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
      <Modal
        {...modalConfig}
        title={locale === 'ko' ? '?????? ??????' : 'Suspend'}
        visible={suspendModal.isConfirmVisible}
        confirmLoading={isSuspendMemberLoading}
        onOk={async () => {
          const { data } = await suspendMember({
            variables: {
              memberSuspendInput: {
                memberId: (router.query.id as string) || '',
                increase: suspendModal.value,
              },
            },
          })

          if (data?.suspendMemberById.ok) {
            toast.success(locale === 'ko' ? '????????? ?????? ???????????????.' : 'Has been completed', {
              theme: localStorage.theme || 'light',
              autoClose: 1000,
              onClose: () => router.reload(),
            })
          } else {
            toast.error(
              locale === 'ko'
                ? '?????? ????????? ????????? ??????????????????.'
                : 'An error occurred while suspending member',
              {
                theme: localStorage.theme || 'light',
                autoClose: 1000,
                onClose: () =>
                  setSuspendModal((prev) => ({
                    ...prev,
                    isConfirmVisible: !prev.isConfirmVisible,
                    isLoading: !prev.isLoading,
                    isVisible: !prev.isVisible,
                  })),
              }
            )
          }
        }}
        onCancel={() =>
          setSuspendModal((prev) => ({
            ...prev,
            isVisible: !prev.isVisible,
            isConfirmVisible: !prev.isConfirmVisible,
            isLoading: !prev.isLoading,
          }))
        }>
        <p>
          {locale === 'ko'
            ? `?????? ????????? ${suspendModal.value}??? ?????? ?????? ???????????????????`
            : `Would you like to suspend the member for ${suspendModal.value} days?`}
        </p>
      </Modal>
      <Modal
        {...modalConfig}
        title={locale === 'ko' ? '????????????' : 'release of suspension'}
        visible={releaseModal.isVisible}
        confirmLoading={isSuspendMemberLoading}
        onOk={async () => {
          const { data } = await suspendMember({
            variables: {
              memberSuspendInput: {
                memberId: (router.query.id as string) || '',
              },
            },
          })

          if (data?.suspendMemberById.ok) {
            toast.success(locale === 'ko' ? '????????? ?????? ???????????????.' : 'Has been completed', {
              theme: localStorage.theme || 'light',
              autoClose: 1000,
              onClose: () => router.reload(),
            })
          } else {
            toast.error(
              locale === 'ko'
                ? '?????? ????????? ????????? ??????????????????.'
                : 'An error occurred while suspending member',
              {
                theme: localStorage.theme || 'light',
                autoClose: 1000,
                onClose: () =>
                  setSuspendModal((prev) => ({
                    ...prev,
                    isConfirmVisible: !prev.isConfirmVisible,
                    isLoading: !prev.isLoading,
                    isVisible: !prev.isVisible,
                  })),
              }
            )
          }
        }}
        onCancel={() => setReleaseModal((prev) => ({ ...prev, isVisible: !prev.isVisible }))}>
        <p>
          {locale === 'ko'
            ? '?????? ????????? ?????? ?????? ???????????????????'
            : 'Are you sure you want to release of suspension the member?'}
        </p>
      </Modal>
    </Layout>
  )
}

export default MemberDetail

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
