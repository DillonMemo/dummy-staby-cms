import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MainWrapper, md, styleMode } from '../../styles/styles'
import styled from 'styled-components'
import { Button, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

/** components */
import Layout from '../../components/Layout'

/** graphql */
import { useMutation } from '@apollo/client'
import { MembersMutation, MembersMutationVariables } from '../../generated'
import { MEMBERS_MUTATION } from '../../graphql/mutations'

type Props = styleMode

type FilterOptions = { page: number }

const Members: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '이메일' : 'email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '닉네임' : 'nickname',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: locale === 'ko' ? '활동정보' : 'status',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '회원유형' : 'type',
      dataIndex: 'memberType',
      key: 'memberType',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '포인트' : 'point',
      dataIndex: 'totalPoint',
      key: 'point',
    },
    {
      title: locale === 'ko' ? '활동이력' : 'history',
      key: 'history',
      width: 100,
      fixed: 'right',
      render: () => <Button onClick={() => alert('comming soon')}>history</Button>,
    },
  ]
  const [{ page }, setFilterOptions] = useState<FilterOptions>({
    page: 1,
  })
  const [members, { data: membersData, loading: membersLoading }] = useMutation<
    MembersMutation,
    MembersMutationVariables
  >(MEMBERS_MUTATION)

  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await members({
        variables: {
          membersInput: { page },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await members({
          variables: {
            membersInput: {},
          },
        })
      } catch (error) {
        console.error(error)
      }
    }

    fetch()
  }, [])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '관리' : 'Management'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '회원' : 'Member'}</li>
            <li>{locale === 'ko' ? '관리' : 'Management'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            {membersLoading ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Space>
                    <Skeleton.Button active size="large" />
                    <Skeleton.Button active size="large" />
                  </Space>
                  <Space>
                    <Skeleton.Button active size="large" />
                  </Space>
                </div>
                <div style={{ marginTop: '3rem' }}>
                  <Skeleton active title={false} paragraph={{ rows: 20 }} />
                </div>
              </>
            ) : (
              <>
                <div className="table-wrapper">
                  <div>
                    <h1>Hello Filter</h1>
                  </div>
                  <div>
                    <Table
                      style={{ width: '100%' }}
                      columns={columns}
                      dataSource={
                        membersData
                          ? membersData.members.members?.map((member: any, index: number) => ({
                              key: index,
                              _id: member._id,
                              email: member.email,
                              nickname: member.nickname,
                              memberStatus: member.memberStatus,
                              memberType: member.memberType,
                              totalPoint: member.point.totalPoint,
                            }))
                          : []
                      }
                      pagination={{
                        pageSize: 20,
                        hideOnSinglePage: true,
                      }}
                    />
                  </div>
                  <div className="pagination-content">
                    <Pagination
                      pageSize={20}
                      current={page}
                      total={membersData?.members.totalResults || undefined}
                      onChange={onPageChange}
                      responsive
                    />
                  </div>
                </div>
              </>
            )}
          </ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const ManagementWrapper = styled.div`
  width: 100%;
  min-height: 2rem;

  .table-wrapper {
    display: flex;
    flex-flow: column nowrap;
    gap: 2rem;

    ${md} {
      gap: 1rem;
    }

    .pagination-content {
      display: inline-flex;
      justify-content: flex-end;
    }
  }
`

export default Members
