import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MainWrapper, md, styleMode } from '../../styles/styles'
import styled from 'styled-components'
import { Button, Dropdown, Input, Menu, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { MenuInfo } from 'rc-menu/lib/interface'
import { debounce } from 'lodash'

/** components */
import Layout from '../../components/Layout'
import { LoadingOutlined } from '@ant-design/icons'

/** graphql */
import { useMutation } from '@apollo/client'
import {
  MembersMutation,
  MembersMutationVariables,
  MemberStatus,
  MemberType,
} from '../../generated'
import { MEMBERS_MUTATION } from '../../graphql/mutations'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  memberType: MemberType | 'All'
  memberStatus: MemberStatus | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  nickName: string
}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>

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
      title: locale === 'ko' ? '닉네임' : 'nickName',
      dataIndex: 'nickName',
      key: 'nickName',
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
  const [{ page, memberType, memberStatus, nickName }, setFilterOptions] = useState<Options>({
    page: 1,
    memberType: 'All',
    memberStatus: 'All',
    nickName: '',
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    memberType: false,
    memberStatus: false,
  })
  const [members, { data: membersData, loading: membersLoading }] = useMutation<
    MembersMutation,
    MembersMutationVariables
  >(MEMBERS_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
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

  /**
   * 회원유형 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   * @param {MenuInfo} info Menu click params
   */
  const onMemberTypeMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (memberType !== key) {
        const { data } = await members({
          variables: {
            membersInput: {
              page,
              memberType: key !== 'All' ? key : undefined,
              memberStatus: memberStatus !== 'All' ? memberStatus : undefined,
              nickName,
            },
          },
        })

        if (data.members.ok) {
          setFilterOptions((prev) => ({ ...prev, memberType: key }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 활동정보 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   * @param {MenuInfo} info Menu Click params
   */
  const onMemberStatusMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (memberStatus !== key) {
        const { data } = await members({
          variables: {
            membersInput: {
              page,
              memberType: memberType !== 'All' ? memberType : undefined,
              memberStatus: key !== 'All' ? key : undefined,
              nickName,
            },
          },
        })
        if (data.members.ok) {
          setFilterOptions((prev) => ({ ...prev, memberStatus: key }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 닉네임 변경 이벤트 핸들러 입니다.
   */
  const onNickNameChange = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await members({
          variables: {
            membersInput: {
              page,
              memberType: memberType !== 'All' ? memberType : undefined,
              memberStatus: memberStatus !== 'All' ? memberStatus : undefined,
              nickName: value,
            },
          },
        })

        if (data.members.ok) {
          setFilterOptions((prev) => ({ ...prev, nickName: value }))
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, memberType, memberStatus, nickName]
  )

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
            <div className="table-wrapper">
              <div className="filter-container">
                <Space>
                  <Dropdown
                    overlay={
                      <Menu onClick={onMemberTypeMenuClick}>
                        <Menu.Item key="All">All</Menu.Item>
                        {Object.keys(MemberType).map((type) => (
                          <Menu.Item key={MemberType[type]}>{type}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, memberType: visible }))
                    }
                    visible={visibleOptions.memberType}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '회원유형' : 'Type'}</span>
                      <Button className="dropdown-btn" onClick={(e) => e.preventDefault()}>
                        {memberType}&nbsp;
                        {membersLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                  <Dropdown
                    overlay={
                      <Menu onClick={onMemberStatusMenuClick}>
                        <Menu.Item key="All">All</Menu.Item>
                        {Object.keys(MemberStatus).map((status) => (
                          <Menu.Item key={MemberStatus[status]}>{status}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, memberStatus: visible }))
                    }
                    visible={visibleOptions.memberStatus}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '활동정보' : 'Status'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {memberStatus}&nbsp;
                        {membersLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                </Space>
                <Space>
                  <Input.Search
                    placeholder={locale === 'ko' ? '닉네임' : 'Nickname'}
                    loading={membersLoading}
                    onChange={onNickNameChange}
                  />
                </Space>
              </div>

              {membersLoading ? (
                <>
                  <div>
                    <Skeleton active title={false} paragraph={{ rows: 20 }} />
                  </div>
                </>
              ) : (
                <>
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
                              nickName: member.nickName,
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
                </>
              )}
            </div>
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

    .filter-container {
      display: inline-flex;
      flex-flow: row nowrap;
      justify-content: space-between;

      .dropdown {
        display: inline-flex;
        flex-flow: column nowrap;

        span.title {
          font-size: 0.625rem;
          line-height: 1;
        }
      }
    }

    .pagination-content {
      display: inline-flex;
      justify-content: flex-end;
    }
  }
`

export default Members
