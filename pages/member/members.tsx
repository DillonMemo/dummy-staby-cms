import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { Button, Dropdown, Input, Menu, Pagination, Select, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { MenuInfo } from 'rc-menu/lib/interface'
import { debounce } from 'lodash'
import moment from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'

/** components */
import Layout from '../../components/Layout'
import { LoadingOutlined } from '@ant-design/icons'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** graphql */
import { useMutation } from '@apollo/client'
import {
  MembersMutation,
  MembersMutationVariables,
  MemberStatus,
  MemberType,
} from '../../generated'
import { MEMBERS_MUTATION } from '../../graphql/mutations'
import { Maybe } from 'graphql/jsutils/Maybe'
import RangePicker from '../../components/RangePicker'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  memberType: MemberType | 'All'
  memberStatus: MemberStatus | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  pageSize: number
  nickName: string
  dates: moment.Moment[]
}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>

const Members: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
    },
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
      title: locale === 'ko' ? '권한' : 'type',
      dataIndex: 'memberType',
      key: 'memberType',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '상태' : 'status',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '활동이력' : 'history',
      key: 'history',
      width: 100,
      fixed: 'right',
      render: () => (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            alert('comming soon')
          }}>
          history
        </Button>
      ),
    },
  ]
  const [{ page, pageSize, memberType, memberStatus, dates, nickName }, setFilterOptions] =
    useState<Options>({
      page: 1,
      pageSize: 20,
      memberType: 'All',
      memberStatus: 'All',
      dates: [],
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
              memberType: key !== 'All' ? (key as Maybe<MemberType>) : undefined,
              memberStatus: memberStatus !== 'All' ? memberStatus : undefined,
              dates: dates.length > 0 ? dates : undefined,
              nickName,
            },
          },
        })

        if (data?.members.ok) {
          //@ts-expect-error
          setFilterOptions((prev) => ({ ...prev, memberType: key as Maybe<MemberType> }))
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
              memberStatus: key !== 'All' ? (key as Maybe<MemberStatus>) : undefined,
              dates: dates.length > 0 ? dates : undefined,
              nickName,
            },
          },
        })
        if (data?.members.ok) {
          setFilterOptions((prev) => ({ ...prev, memberStatus: key as any }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * datepicker가 열릴 때 실행 이벤트 핸들러 입니다.
   * @param {boolean} open 달력 오픈 여부
   */
  const onPickerOpen = (open: boolean) => {
    if (open) {
      setFilterOptions((prev) => ({ ...prev, dates: [] }))
    }
  }

  /**
   * 시작일, 종료일을 다 선택 했거나 clear 했을때 실행 이벤트 핸들러 입니다.
   * @param value
   */
  const onPickerChange = async (value: RangeValue<moment.Moment>) => {
    await members({
      variables: {
        membersInput: {
          page,
          memberType: memberType !== 'All' ? memberType : undefined,
          memberStatus: memberStatus !== 'All' ? memberStatus : undefined,
          dates: value || undefined,
          nickName,
        },
      },
    })
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
              dates: dates.length > 0 ? dates : undefined,
              nickName: value,
            },
          },
        })

        if (data?.members.ok) {
          setFilterOptions((prev) => ({ ...prev, nickName: value }))
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, memberType, memberStatus, nickName, dates]
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await members({
          variables: {
            //현재 상태가 acrive 상태인 멤버들만 보여준다.
            membersInput: { memberStatus: MemberStatus['Active'] },
          },
        })

        if (data?.members.ok) {
          setFilterOptions((prev) => ({ ...prev, memberStatus: MemberStatus.Active }))
        }
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
                        <Menu.Item key="All">{locale === 'ko' ? '전체' : 'All'}</Menu.Item>
                        {Object.keys(MemberType).map((type) => {
                          const memberTypeValue =
                            locale === 'ko'
                              ? type === 'Normal'
                                ? '일반'
                                : type === 'Business'
                                ? '기업'
                                : type === 'Contents'
                                ? '컨텐츠관리자'
                                : type === 'Cx'
                                ? 'CX관리자'
                                : type === 'Service'
                                ? '서비스관리자'
                                : type === 'System'
                                ? '시스템관리자'
                                : type
                              : type
                          return (
                            //@ts-expect-error
                            <Menu.Item key={MemberType[type]}>{memberTypeValue}</Menu.Item>
                          )
                        })}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, memberType: visible }))
                    }
                    visible={visibleOptions.memberType}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '권한' : 'Type'}</span>
                      <Button className="dropdown-btn" onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? memberType === 'All'
                            ? '전체'
                            : memberType === 'NORMAL'
                            ? '일반'
                            : memberType === 'BUSINESS'
                            ? '기업'
                            : memberType === 'CONTENTS'
                            ? '컨텐츠관리자'
                            : memberType === 'CX'
                            ? 'CX관리자'
                            : memberType === 'SERVICE'
                            ? '서비스관리자'
                            : memberType === 'SYSTEM'
                            ? '시스템관리자'
                            : memberType
                          : memberType}
                        &nbsp;
                        {membersLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                  <Dropdown
                    overlay={
                      <Menu onClick={onMemberStatusMenuClick}>
                        <Menu.Item key="All">{locale === 'ko' ? '전체' : 'All'}</Menu.Item>
                        {Object.keys(MemberStatus).map((status) => {
                          const memberStatusValue =
                            locale === 'ko'
                              ? status === 'Active'
                                ? '활성'
                                : status === 'RemoveStandby'
                                ? '탈퇴 접수'
                                : status === 'Removed'
                                ? '탈퇴'
                                : status
                              : status
                          return (
                            //@ts-expect-error
                            <Menu.Item key={MemberStatus[status]}>{memberStatusValue}</Menu.Item>
                          )
                        })}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, memberStatus: visible }))
                    }
                    visible={visibleOptions.memberStatus}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '상태' : 'Status'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? memberStatus === 'All'
                            ? '전체'
                            : memberStatus === 'ACTIVE'
                            ? '활성'
                            : memberStatus === 'REMOVE_STANDBY'
                            ? '탈퇴 접수'
                            : memberStatus === 'REMOVED'
                            ? '탈퇴'
                            : memberStatus
                          : memberStatus}
                        &nbsp;
                        {membersLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                  <RangePicker
                    locale={locale}
                    title={locale === 'ko' ? '가입일' : 'Create Date'}
                    value={dates}
                    onCalendarChange={(value) =>
                      setFilterOptions((prev) => ({ ...prev, dates: value as any }))
                    }
                    onPickerChange={onPickerChange}
                    onPickerOpen={onPickerOpen}
                  />
                </Space>
                <Space>
                  <Input.Group compact>
                    <Select defaultValue="Email">
                      <Select.Option value="Email">
                        {locale === 'ko' ? '이메일' : 'Email'}
                      </Select.Option>
                      <Select.Option value="Nickname">
                        {locale === 'ko' ? '닉네임' : 'Nickname'}
                      </Select.Option>
                    </Select>
                    <Input.Search
                      placeholder={locale === 'ko' ? '닉네임' : 'Nickname'}
                      loading={membersLoading}
                      onChange={onNickNameChange}
                    />
                  </Input.Group>
                </Space>
              </div>

              {membersLoading ? (
                <>
                  <div>
                    <Skeleton active title={false} paragraph={{ rows: pageSize }} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Table
                      style={{ width: '100%' }}
                      columns={columns}
                      onRow={(column) => {
                        return {
                          onClick: () => {
                            router.push({
                              pathname: '/member/[id]',
                              query: {
                                id: column && column._id ? column._id : '',
                              },
                            })
                          },
                        }
                      }}
                      dataSource={
                        membersData
                          ? membersData.members.members?.map(
                              (
                                { _id, email, nickName, memberStatus, memberType },
                                index: number
                              ) => {
                                const memberStatusValue =
                                  locale === 'ko'
                                    ? memberStatus === 'ACTIVE'
                                      ? '활성'
                                      : memberStatus === 'REMOVE_STANDBY'
                                      ? '탈퇴 접수'
                                      : memberStatus === 'REMOVED'
                                      ? '탈퇴'
                                      : memberStatus
                                    : memberStatus
                                const memberTypeValue =
                                  locale === 'ko'
                                    ? memberType === 'NORMAL'
                                      ? '일반'
                                      : memberType === 'BUSINESS'
                                      ? '기업'
                                      : memberType === 'CONTENTS'
                                      ? '컨텐츠관리자'
                                      : memberType === 'CX'
                                      ? 'CX관리자'
                                      : memberType === 'SERVICE'
                                      ? '서비스관리자'
                                      : memberType === 'SYSTEM'
                                      ? '시스템관리자'
                                      : memberType
                                    : memberType
                                return {
                                  index: index + 1 + pageSize * (page - 1),
                                  key: index,
                                  _id,
                                  email,
                                  nickName,
                                  memberStatus: memberStatusValue,
                                  memberType: memberTypeValue,
                                }
                              }
                            )
                          : []
                      }
                      pagination={{
                        pageSize: pageSize,
                        hideOnSinglePage: true,
                      }}
                    />
                  </div>
                  <div className="pagination-content">
                    <Pagination
                      pageSize={pageSize}
                      current={page}
                      total={membersData?.members.totalResults || undefined}
                      onChange={onPageChange}
                      responsive
                      showSizeChanger={false}
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
export default Members
