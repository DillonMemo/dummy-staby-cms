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
import { toast } from 'react-toastify'

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
import RangePicker from '../../components/RangePicker'
import { PAGE, PAGESIZE } from '../../lib/constants'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  memberType: keyof typeof MemberType | 'All'
  memberStatus: keyof typeof MemberStatus | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  pageSize: number
  searchSelect: 'Email' | 'NickName'
  searchText: string
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
    },
    {
      title: locale === 'ko' ? '상태' : 'status',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '가입일' : 'date created',
      dataIndex: 'createDate',
      key: 'createDate',
      responsive: ['md'],
    },
  ]
  const [
    { page, pageSize, memberType, memberStatus, dates, searchSelect, searchText },
    setFilterOptions,
  ] = useState<Options>({
    page: PAGE,
    pageSize: PAGESIZE,
    memberType: 'All',
    memberStatus: 'All',
    dates: [],
    searchSelect: 'Email',
    searchText: '',
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
   * @param {Number} pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, pageSize?: number) => {
    try {
      await members({
        variables: {
          membersInput: {
            page,
            pageView: pageSize,
            memberType: memberType !== 'All' ? (memberType as MemberType) : undefined,
            memberStatus: memberStatus !== 'All' ? (memberStatus as MemberStatus) : undefined,
            ...(dates && dates.length > 0 && { dates }),
            ...(searchSelect === 'Email'
              ? { email: searchText }
              : searchSelect === 'NickName'
              ? { nickName: searchText }
              : {}),
          },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page, ...(pageSize !== undefined && { pageSize }) }))
      router.push(
        { pathname: router.pathname, query: { ...router.query, page, pageSize } },
        router.asPath,
        { locale }
      )
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
              page: PAGE,
              pageView: PAGESIZE,
              ...(key !== 'All' && { memberType: key as MemberType }),
              ...(memberStatus !== 'All' && { memberStatus: memberStatus as MemberStatus }),
              ...(dates && dates.length > 0 && { dates }),
              ...(searchSelect === 'Email'
                ? { email: searchText }
                : searchSelect === 'NickName'
                ? { nickName: searchText }
                : {}),
            },
          },
        })

        if (data?.members.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            memberType: key as keyof typeof MemberType,
          }))
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                page: PAGE,
                pageSize: PAGESIZE,
                memberType: key,
              },
            },
            router.asPath,
            { locale }
          )
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
              page: PAGE,
              pageView: PAGESIZE,
              ...(memberType !== 'All' && { memberType: memberType as MemberType }),
              ...(key !== 'All' && { memberStatus: key as MemberStatus }),
              ...(dates && dates.length > 0 && { dates }),
              ...(searchSelect === 'Email'
                ? { email: searchText }
                : searchSelect === 'NickName'
                ? { nickName: searchText }
                : {}),
            },
          },
        })
        if (data?.members.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            memberStatus: key as keyof typeof MemberStatus,
          }))
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                page: PAGE,
                pageSize: PAGESIZE,
                memberStatus: key,
              },
            },
            router.asPath,
            { locale }
          )
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
      setFilterOptions((prev) => ({ ...prev, page: PAGE, pageSize: PAGESIZE, dates: [] }))
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: PAGE,
            pageSize: PAGESIZE,
            dates: [],
          },
        },
        router.asPath,
        { locale }
      )
    }
  }

  /**
   * 시작일, 종료일을 다 선택 했거나 clear 했을때 실행 이벤트 핸들러 입니다.
   * @param {RangeValue<moment.Moment>} value 날짜 결과 option
   */
  const onPickerChange = async (value: RangeValue<moment.Moment>) => {
    try {
      await members({
        variables: {
          membersInput: {
            page: PAGE,
            pageView: PAGESIZE,
            ...(memberType !== 'All' && { memberType: memberType as MemberType }),
            ...(memberStatus !== 'All' && { memberStatus: memberStatus as MemberStatus }),
            ...(value && value.length > 0 && { dates: value }),
            ...(searchSelect === 'Email'
              ? { email: searchText }
              : searchSelect === 'NickName'
              ? { nickName: searchText }
              : {}),
          },
        },
      })

      setFilterOptions((prev) => ({
        ...prev,
        page: PAGE,
        pageSize: PAGESIZE,
        dates: value as moment.Moment[],
      }))
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: PAGE,
            pageSize: PAGESIZE,
            dates: value
              ? ([value[0]?.format().toString(), value[1]?.format().toString()] as string[])
              : [],
          },
        },
        router.asPath,
        { locale }
      )
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
              page: PAGE,
              pageView: PAGESIZE,
              ...(memberType !== 'All' && { memberType: memberType as MemberType }),
              ...(memberStatus !== 'All' && { memberStatus: memberStatus as MemberStatus }),
              ...(dates && dates.length > 0 && { dates }),
              ...(searchSelect === 'Email'
                ? { email: value }
                : searchSelect === 'NickName'
                ? { nickName: value }
                : {}),
            },
          },
        })

        if (data?.members.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            searchText: value,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, pageSize, memberType, memberStatus, searchText, dates, searchSelect]
  )

  /**
   * 엑셀 다운로드 버튼 이벤트 핸들러 입니다.
   */
  const onExcelExport = async () => {
    try {
      const link = process.env.NEXT_PUBLIC_APOLLO_LINK as string
      const param = []
      memberType !== 'All' && param.push(`memberType=${memberType}`)
      memberStatus !== 'All' && param.push(`memberStatus=${memberStatus}`)
      dates && dates.length > 0 && param.push(`dates=${JSON.stringify(dates)}`)
      if (searchSelect === 'Email') searchText && param.push(`email=${searchText}`)
      else if (searchSelect === 'NickName') searchText && param.push(`nickName=${searchText}`)

      router.push(`${link.substring(0, link.length - 7)}download/members?${param.join('&')}`)
    } catch (error) {
      toast.error(locale === 'ko' ? '오류가 발생 했습니다' : 'an error', {
        theme: localStorage.theme || 'light',
      })
      console.error(error)
    }
  }

  useEffect(() => {
    // console.log('effect start', router.query)
    const fetch = async () => {
      try {
        const { data } = await members({
          variables: {
            //현재 상태가 acrive 상태인 멤버들만 보여준다.
            membersInput: {
              page: +(router.query.page || page),
              pageView: +(router.query.pageSize || pageSize),
              ...(router.query.memberType &&
                router.query.memberType !== 'All' && {
                  memberType: router.query.memberType as MemberType,
                }),
              memberStatus:
                router.query.memberStatus && router.query.memberStatus !== 'All'
                  ? (router.query.memberStatus as MemberStatus)
                  : MemberStatus['Active'],
              ...(router.query.dates &&
                router.query.dates.length > 0 && {
                  dates: [moment(router.query.dates[0]), moment(router.query.dates[1])],
                }),
            },
          },
        })

        if (data?.members.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: +(router.query.page || prev.page),
            pageSize: +(router.query.pageSize || prev.pageSize),
            memberStatus: (router.query.memberStatus && router.query.memberStatus !== 'All'
              ? router.query.memberStatus
              : MemberStatus['Active']) as keyof typeof MemberStatus,
            ...(router.query.memberType && {
              memberType: router.query.memberType as keyof typeof MemberType,
            }),
            ...(router.query.dates &&
              router.query.dates.length > 0 && {
                dates: [moment(router.query.dates[0]), moment(router.query.dates[1])],
              }),
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetch()
  }, [router])

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
              <div className="extension-container">
                <Space>
                  <div></div>
                </Space>
                <Space>
                  <Button
                    type="primary"
                    role="button"
                    className="export-button"
                    onClick={onExcelExport}>
                    Excel
                  </Button>
                </Space>
              </div>
              <div className="filter-container">
                <Space>
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={onMemberTypeMenuClick}
                        items={[
                          { key: 'All', label: locale === 'ko' ? '전체' : 'All' },
                          ...Object.keys(MemberType).map((type) => {
                            const memberTypeValue =
                              locale === 'ko'
                                ? (type as MemberType).toUpperCase() === MemberType.Normal
                                  ? '일반'
                                  : (type as MemberType).toUpperCase() === MemberType.Business
                                  ? '기업'
                                  : (type as MemberType).toUpperCase() === MemberType.Contents
                                  ? '컨텐츠관리자'
                                  : (type as MemberType).toUpperCase() === MemberType.Cx
                                  ? 'CX관리자'
                                  : (type as MemberType).toUpperCase() === MemberType.Service
                                  ? '서비스관리자'
                                  : (type as MemberType).toUpperCase() === MemberType.System
                                  ? '시스템관리자'
                                  : type
                                : type
                            return {
                              key: MemberType[type as keyof typeof MemberType],
                              label: memberTypeValue,
                            }
                          }),
                        ]}
                      />
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
                            : (memberType as MemberType) === MemberType.Normal
                            ? '일반'
                            : (memberType as MemberType) === MemberType.Business
                            ? '기업'
                            : (memberType as MemberType) === MemberType.Contents
                            ? '컨텐츠관리자'
                            : (memberType as MemberType) === MemberType.Cx
                            ? 'CX관리자'
                            : (memberType as MemberType) === MemberType.Service
                            ? '서비스관리자'
                            : (memberType as MemberType) === MemberType.System
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
                      <Menu
                        onClick={onMemberStatusMenuClick}
                        items={[
                          {
                            key: 'All',
                            label: locale === 'ko' ? '전체' : 'All',
                          },
                          ...Object.keys(MemberStatus).map((status) => {
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

                            return {
                              key: MemberStatus[status as keyof typeof MemberStatus],
                              label: memberStatusValue,
                            }
                          }),
                        ]}
                      />
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
                            : (memberStatus as MemberStatus) === MemberStatus.Active
                            ? '활성'
                            : (memberStatus as MemberStatus) === MemberStatus.RemoveStandby
                            ? '탈퇴 접수'
                            : (memberStatus as MemberStatus) === MemberStatus.Removed
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
                    <Select
                      defaultValue={searchSelect}
                      onChange={(value) =>
                        setFilterOptions((prev) => ({ ...prev, searchSelect: value }))
                      }>
                      <Select.Option value="Email">
                        {locale === 'ko' ? '이메일' : 'Email'}
                      </Select.Option>
                      <Select.Option value="NickName">
                        {locale === 'ko' ? '닉네임' : 'NickName'}
                      </Select.Option>
                    </Select>
                    <Input.Search
                      name="searchText"
                      placeholder={
                        searchSelect === 'Email'
                          ? locale === 'ko'
                            ? '이메일'
                            : 'Email'
                          : searchSelect === 'NickName'
                          ? locale === 'ko'
                            ? '닉네임'
                            : 'NickName'
                          : searchSelect
                      }
                      defaultValue={searchText}
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
                                ...router.query,
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
                                { _id, email, nickName, memberStatus, memberType, createDate },
                                index: number
                              ) => {
                                const memberStatusValue =
                                  locale === 'ko'
                                    ? memberStatus === MemberStatus.Active
                                      ? '활성'
                                      : memberStatus === MemberStatus.RemoveStandby
                                      ? '탈퇴 접수'
                                      : memberStatus === MemberStatus.Removed
                                      ? '탈퇴'
                                      : memberStatus
                                    : memberStatus
                                const memberTypeValue =
                                  locale === 'ko'
                                    ? memberType === MemberType.Normal
                                      ? '일반'
                                      : memberType === MemberType.Business
                                      ? '기업'
                                      : memberType === MemberType.Contents
                                      ? '컨텐츠관리자'
                                      : memberType === MemberType.Cx
                                      ? 'CX관리자'
                                      : memberType === MemberType.Service
                                      ? '서비스관리자'
                                      : memberType === MemberType.System
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
                                  createDate: moment(createDate).format('YYYY.MM.DD'),
                                }
                              }
                            )
                          : []
                      }
                      pagination={{
                        pageSize,
                        hideOnSinglePage: true,
                      }}
                    />
                  </div>
                  <div className="pagination-content">
                    <span>
                      <b>Total</b> {membersData?.members.totalResults?.toLocaleString()}
                    </span>
                    <Pagination
                      pageSize={pageSize}
                      current={page}
                      total={membersData?.members.totalResults || undefined}
                      onChange={onPageChange}
                      responsive
                      showSizeChanger
                      pageSizeOptions={['10', '20', '30', '40', '50']}
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
