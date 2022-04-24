import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  EditMemberByIdMutation,
  EditMemberByIdMutationVariables,
  FindMemberByIdQuery,
  FindMemberByIdQueryVariables,
  HistoriesByMemberIdQuery,
  HistoriesByMemberIdQueryVariables,
  MemberReportStatus,
  MemberType,
  SuspendMemberByIdMutation,
  SuspendMemberByIdMutationVariables,
} from '../../generated'
import { HISTORIES_BY_MEMBER_ID, MEMBER_QUERY } from '../../graphql/queries'
import { defaultPalette, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, Input, Modal, Radio, Select, Skeleton, Tabs } from 'antd'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Link from 'next/link'
import styled from 'styled-components'

/** components */
import Layout from '../../components/Layout'
import { EDIT_MEMBER_BY_ID_MUTATION, SUSPEND_MEMBER_BY_ID_MUTATION } from '../../graphql/mutations'

/** util */
import { bankList } from '../../Common/commonFn'
import moment from 'moment'

type Props = styleMode

export interface MemberEditForm {
  email: string
  checkPassword: boolean
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
  >(MEMBER_QUERY)
  const { data: testData } = useQuery<HistoriesByMemberIdQuery, HistoriesByMemberIdQueryVariables>(
    HISTORIES_BY_MEMBER_ID,
    {
      variables: {
        historiesByMemberIdInput: {
          memberId: router.query.id as string,
        },
      },
    }
  )
  console.log(testData)
  const [suspendMember, { loading: isSuspendMemberLoading }] = useMutation<
    SuspendMemberByIdMutation,
    SuspendMemberByIdMutationVariables
  >(SUSPEND_MEMBER_BY_ID_MUTATION)
  const watchMemberType = watch('memberType')
  const watchCheckPassword = watch('checkPassword')
  const modalConfig = {
    okText: locale === 'ko' ? '확인' : 'OK',
    cancelText: locale === 'ko' ? '취소' : 'Cancel',
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
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link href="/member/members" locale={locale}>
                <a>{locale === 'ko' ? '멤버' : 'Member'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '회원관리' : 'Member Settings'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid col-2 gap-1">
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

                <div className="form-item">
                  <span>{locale === 'ko' ? '회원번호' : 'Member Number'}</span>
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
                          <span>{locale === 'ko' ? '은행' : 'BankName'}</span>
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

                      <div className="form-item mt-1">
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
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
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
              </div>

              <div className="form-grid col-2 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '활동상태' : 'Activities'}</span>
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
                    <span>{locale === 'ko' ? '등록일' : 'Registration Date'}</span>
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
                    <span>{locale === 'ko' ? '정지여부' : 'Suspension Status'}</span>
                    {memberData?.findMemberById.member?.report.memberReportStatus ? (
                      <div className="row">
                        <p>
                          {locale === 'ko'
                            ? memberData.findMemberById.member.report.memberReportStatus ===
                              MemberReportStatus.None
                              ? '정상'
                              : `차단 (정지 해제 : ${moment(
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
                            {locale === 'ko' ? '이용 정지' : 'Suspend'}
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            role="button"
                            htmlType="button"
                            onClick={() =>
                              setReleaseModal((prev) => ({ ...prev, isVisible: !prev.isVisible }))
                            }>
                            {locale === 'ko' ? '정지 해제' : 'Continue'}
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
                    <span>{locale === 'ko' ? '최근접속일시' : 'Last login date'}</span>
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
                    <span>{locale === 'ko' ? '푸시수신여부' : 'Push received'}</span>
                    {memberData?.findMemberById.member?.pushInfo[0] ? (
                      <p>
                        {memberData.findMemberById.member.pushInfo[0].notificationFlag
                          ? locale === 'ko'
                            ? '동의'
                            : 'agree'
                          : locale === 'ko'
                          ? '거부'
                          : 'disagree'}
                      </p>
                    ) : (
                      <Skeleton.Input active style={{ width: '30%', margin: '4px 0' }} />
                    )}
                  </div>
                </div>

                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '신고이력' : 'Report'}</span>
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
                            }
                            onChange(value)
                          }}
                          value={value}>
                          <Radio value={false}>{locale === 'ko' ? '미변경' : 'be unchanged'}</Radio>
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
              </div>

              {/* <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '총 포인트' : 'Total Point'}</span>
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
                  <span>{locale === 'ko' ? '유료 포인트' : 'Paid Point'}</span>
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
                  <span>{locale === 'ko' ? '무료 포인트' : 'Free Point'}</span>
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
                    {locale === 'ko' ? '저장' : 'save'}
                  </Button>
                </div>
              </div>
            </Form>
          </Edit>

          <div className="tab-container card mt-1">
            <Tabs className="default" defaultActiveKey="1" type="card">
              <Tabs.TabPane tab={locale === 'ko' ? '활동이력' : 'active history'} key="1">
                <h1>개발 진행 중...</h1>
              </Tabs.TabPane>
              <Tabs.TabPane tab={locale === 'ko' ? '댓글이력' : 'comment history'} key="2">
                <h1>개발 진행 중...</h1>
              </Tabs.TabPane>
              <Tabs.TabPane tab={locale === 'ko' ? '포인트이력' : 'point history'} key="3">
                <h1>개발 진행 중...</h1>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </MainWrapper>

      <Modal
        {...modalConfig}
        title={locale === 'ko' ? '이용 정지' : 'Suspend'}
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
          <p>{locale === 'ko' ? '정지 기간을 선택해주세요.' : 'Please select a suspend period.'}</p>
          <Select
            defaultValue={suspendModal.value}
            onChange={(value) => setSuspendModal((prev) => ({ ...prev, value }))}>
            {[1, 3, 5, 7, 15].map((day, index) => (
              <Select.Option value={day} key={index}>
                {day}일
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
      <Modal
        {...modalConfig}
        title={locale === 'ko' ? '이용 정지' : 'Suspend'}
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
            toast.success(locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed', {
              theme: localStorage.theme || 'light',
              autoClose: 1000,
              onClose: () => router.reload(),
            })
          } else {
            toast.error(
              locale === 'ko'
                ? '회원 정지중 오류가 발생했습니다.'
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
            ? `해당 회원을 ${suspendModal.value}일 정지 처리 하시겠습니까?`
            : `Would you like to suspend the member for ${suspendModal.value} days?`}
        </p>
      </Modal>
      <Modal
        {...modalConfig}
        title={locale === 'ko' ? '정지해제' : 'release of suspension'}
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
            toast.success(locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed', {
              theme: localStorage.theme || 'light',
              autoClose: 1000,
              onClose: () => router.reload(),
            })
          } else {
            toast.error(
              locale === 'ko'
                ? '회원 정지중 오류가 발생했습니다.'
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
            ? '해당 회원을 정지 해제 하시겠습니까?'
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
