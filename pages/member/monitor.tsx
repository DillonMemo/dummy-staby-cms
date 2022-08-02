import { useMutation } from '@apollo/client'
import { Button, List, Skeleton } from 'antd'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from '../../components/Layout'
import { EDIT_MEMBER_BY_ID_MUTATION, MEMBERS_MUTATION } from '../../graphql/mutations'
import { MainWrapper, styleMode } from '../../styles/styles'
import {
  EditMemberByIdMutation,
  EditMemberByIdMutationVariables,
  MembersMutation,
  MembersMutationVariables,
  MemberType,
} from '../../generated'
import moment from 'moment'
import { toast } from 'react-toastify'

type Props = styleMode

const Monitor: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload } = useRouter()
  const [monitorMembers, { data: monitorMembersData, loading: monitorMemberLoading }] = useMutation<
    MembersMutation,
    MembersMutationVariables
  >(MEMBERS_MUTATION)

  const onCompleted = async (data: EditMemberByIdMutation) => {
    const {
      editMemberById: { ok },
    } = data

    if (ok) {
      toast.success(locale === 'ko' ? '삭제 완료 되었습니다.' : 'Has been completed', {
        theme: localStorage.theme || 'light',
        autoClose: 1000,
        onClose: () => reload(),
      })
    } else {
      const message =
        locale === 'ko' ? data?.editMemberById.error?.ko : data?.editMemberById.error?.en
      toast.error(message, { theme: localStorage.theme || 'light' })
    }
  }

  const [editMonitorMember] = useMutation<EditMemberByIdMutation, EditMemberByIdMutationVariables>(
    EDIT_MEMBER_BY_ID_MUTATION,
    { onCompleted }
  )

  const onDeleteMonitorFlag = async (id: string, memberType: MemberType) => {
    try {
      await editMonitorMember({
        variables: {
          editMemberInput: {
            _id: id,
            monitorFlag: false,
            memberType: memberType,
          },
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await monitorMembers({
          variables: {
            membersInput: {
              page: 1,
              pageView: 200,
              monitorFlag: true,
            },
          },
        })
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '모니터링 계정' : 'Monitor Account'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '회원' : 'Member'}</li>
            <li>{locale === 'ko' ? '모니터링 계정' : 'Monitor Account'}</li>
          </ol>
        </div>
        <div className="main-content">
          <div className="card">
            {monitorMemberLoading ? (
              <Skeleton active />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={monitorMembersData?.members?.members || undefined}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        onClick={() => {
                          onDeleteMonitorFlag(item._id, item.memberType)
                        }}
                        type="primary"
                        key="delete"
                        danger={false}>
                        삭제
                      </Button>,
                    ]}>
                    <List.Item.Meta title={item.nickName} description={item.email} />
                    <div className="monitor-date">
                      {moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default Monitor
