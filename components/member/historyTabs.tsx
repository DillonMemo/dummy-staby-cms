import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import moment from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'
import { MenuInfo } from 'rc-menu/lib/interface'

/** antd */
import { Button, Dropdown, Menu, Pagination, Skeleton, Space, Table, Tabs } from 'antd'
import { ColumnsType } from 'antd/lib/table'

/** apollo graphql */
import {
  ActiveHistoriesByMemberIdMutation,
  ActiveHistoriesByMemberIdMutationVariables,
  ActiveType,
  PointHistoriesByMemberIdMutation,
  PointHistoriesByMemberIdMutationVariables,
  PointPayStatus,
  ServiceType,
} from '../../generated'
import {
  ACTIVE_HISTORIES_BY_MEMBER_ID_MUTATION,
  POINT_HISTORIES_BY_MEMBER_ID_MUTATION,
} from '../../graphql/mutations'
import styled from 'styled-components'

/** components */
import RangePicker from '../RangePicker'
import { md } from '../../styles/styles'
import { LoadingOutlined } from '@ant-design/icons'

/** filter 옵션 인터페이스 */
interface Filters {
  serviceType: keyof typeof ServiceType | 'All'
  activeType: keyof typeof ActiveType | 'All'
}
interface PointFilters {
  pointPayStatus: keyof typeof PointPayStatus | 'All'
}
/** filter 옵션 인터페이스를 상송 정의한 테이블 옵션 인터페이스 */
interface Options {
  page: number
  pageSize: number
  dates: moment.Moment[]
}
interface ActiveOptions extends Options, Filters {}
interface PointOptions extends Options, PointFilters {}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>
type PointVisible = Record<keyof PointFilters, boolean>

enum ActiveTab {
  ACTIVE = 'ACTIVE',
  COMMENT = 'COMMENT',
  POINT = 'POINT',
}

interface Props {
  memberId: string
}

const HistoryTabs: React.FC<Props> = ({ memberId }) => {
  const { locale } = useRouter()
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '시간' : 'Date',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: locale === 'ko' ? '구분' : 'Service',
      dataIndex: 'serviceType',
      key: 'serviceType',
    },
    {
      title: locale === 'ko' ? '활동' : 'Active',
      dataIndex: 'activeType',
      key: 'activeType',
    },
    {
      title: locale === 'ko' ? '메시지' : 'Message',
      dataIndex: 'content',
      key: 'content',
    },
  ]
  const pointColumns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '시간' : 'Date',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: locale === 'ko' ? '경로' : 'Type',
      dataIndex: 'pointPayType',
      key: 'pointPayType',
    },
    {
      title: locale === 'ko' ? '활동' : 'Active',
      dataIndex: 'pointPayStatus',
      key: 'pointPayStatus',
    },
    {
      title: locale === 'ko' ? '금액' : 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: locale === 'ko' ? '메시지' : 'Message',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: locale === 'ko' ? '비고' : 'Remark',
      key: 'remark',
      render: (value) =>
        value.pointPayType === 'LIVE' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="button" onClick={() => alert('개발 진행 중입니다')}>
              채팅이력
            </Button>
          </div>
        ),
    },
  ]

  const [{ page, pageSize, serviceType, activeType, dates }, setFilterOptions] =
    useState<ActiveOptions>({
      page: 1,
      pageSize: 10,
      serviceType: 'All',
      activeType: 'All',
      dates: [],
    })
  const [pointFilterOptions, setPointFilterOptions] = useState<PointOptions>({
    page: 1,
    pageSize: 10,
    pointPayStatus: 'All',
    dates: [],
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    serviceType: false,
    activeType: false,
  })
  const [pointVisibleOptions, setPointVisibleOptions] = useState<PointVisible>({
    pointPayStatus: false,
  })
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.ACTIVE)

  const [activeHistoriesByMemberId, { data: historiesData, loading: isHistoryLoading }] =
    useMutation<ActiveHistoriesByMemberIdMutation, ActiveHistoriesByMemberIdMutationVariables>(
      ACTIVE_HISTORIES_BY_MEMBER_ID_MUTATION
    )
  const [pointHistoriesByMemberId, { data: pointHistoriesData, loading: isPointHistoryLoading }] =
    useMutation<PointHistoriesByMemberIdMutation, PointHistoriesByMemberIdMutationVariables>(
      POINT_HISTORIES_BY_MEMBER_ID_MUTATION
    )
  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, pageSize?: number) => {
    try {
      await activeHistoriesByMemberId({
        variables: {
          activeHistoriesByMemberIdInput: {
            page,
            pageView: pageSize,
            memberId,
            serviceType: serviceType !== 'All' ? (serviceType as ServiceType) : undefined,
            activeType: activeType !== 'All' ? (activeType as ActiveType) : undefined,
            ...(dates && dates.length > 0 && { dates }),
          },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page, ...(pageSize !== undefined && { pageSize }) }))
    } catch (error) {
      console.error(error)
    }
  }

  const onPointPageChange = async (page: number, pageSize?: number) => {
    try {
      await pointHistoriesByMemberId({
        variables: {
          pointHistoriesByMemberIdInput: {
            page,
            pageView: pageSize,
            memberId,
            pointPayStatus:
              pointFilterOptions.pointPayStatus !== 'All'
                ? (pointFilterOptions.pointPayStatus as PointPayStatus)
                : undefined,
            ...(pointFilterOptions.dates &&
              pointFilterOptions.dates.length > 0 && { dates: pointFilterOptions.dates }),
          },
        },
      })

      setPointFilterOptions((prev) => ({
        ...prev,
        page,
        ...(pageSize !== undefined && { pageSize }),
      }))
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
  const onPointPickerOpen = (open: boolean) => {
    if (open) {
      setPointFilterOptions((prev) => ({ ...prev, dates: [] }))
    }
  }
  /**
   * 시작일, 종료일을 다 선택 했거나 clear 했을때 실행 이벤트 핸들러 입니다.
   * @param {RangeValue<moment.Moment>} value 날짜 결과 option
   */
  const onPickerChange = async (value: RangeValue<moment.Moment>) => {
    await activeHistoriesByMemberId({
      variables: {
        activeHistoriesByMemberIdInput: {
          page,
          pageView: pageSize,
          memberId,
          serviceType: serviceType !== 'All' ? (serviceType as ServiceType) : undefined,
          activeType: activeType !== 'All' ? (activeType as ActiveType) : undefined,
          ...(value && value.length > 0 && { dates: value }),
        },
      },
    })
  }
  const onPointPickerChange = async (value: RangeValue<moment.Moment>) => {
    await pointHistoriesByMemberId({
      variables: {
        pointHistoriesByMemberIdInput: {
          page: pointFilterOptions.page,
          pageView: pointFilterOptions.pageSize,
          memberId,
          pointPayStatus:
            pointFilterOptions.pointPayStatus !== 'All'
              ? (pointFilterOptions.pointPayStatus as PointPayStatus)
              : undefined,
          ...(value && value.length > 0 && { dates: value }),
        },
      },
    })
  }

  /**
   * 서비스유형 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   * @param {MenuInfo} info Menu click params
   */
  const onServiceTypeMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (serviceType !== key) {
        const { data } = await activeHistoriesByMemberId({
          variables: {
            activeHistoriesByMemberIdInput: {
              page,
              pageView: pageSize,
              memberId,
              serviceType: key !== 'All' ? (key as ServiceType) : undefined,
              activeType: activeType !== 'All' ? (activeType as ActiveType) : undefined,
              ...(dates && dates.length > 0 && { dates }),
            },
          },
        })

        if (data?.activeHistoriesByMemberId.ok) {
          setFilterOptions((prev) => ({ ...prev, serviceType: key as keyof typeof ServiceType }))
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
  const onActiveTypeMenuClick = async ({ key }: MenuInfo) => {
    try {
      const { data } = await activeHistoriesByMemberId({
        variables: {
          activeHistoriesByMemberIdInput: {
            page,
            pageView: pageSize,
            memberId,
            serviceType: serviceType !== 'All' ? (serviceType as ServiceType) : undefined,
            activeType: key !== 'All' ? (key as ActiveType) : undefined,
            ...(dates && dates.length > 0 && { dates }),
          },
        },
      })

      if (data?.activeHistoriesByMemberId.ok) {
        setFilterOptions((prev) => ({ ...prev, activeType: key as keyof typeof ActiveType }))
      }
    } catch (error) {
      console.error(error)
    }
  }
  /**
   * 구매, 충전등 활동정보 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   * @param {MenuInfo} info Menu Click params
   */
  const onPointPayStatusMenuClick = async ({ key }: MenuInfo) => {
    try {
      const { data } = await pointHistoriesByMemberId({
        variables: {
          pointHistoriesByMemberIdInput: {
            page: pointFilterOptions.page,
            pageView: pointFilterOptions.pageSize,
            memberId,
            pointPayStatus: key !== 'All' ? (key as PointPayStatus) : undefined,
            ...(pointFilterOptions.dates &&
              pointFilterOptions.dates.length > 0 && { dates: pointFilterOptions.dates }),
          },
        },
      })

      if (data?.pointHistoriesByMemberId.ok) {
        setPointFilterOptions((prev) => ({
          ...prev,
          pointPayStatus: key as keyof typeof PointPayStatus,
        }))
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    const onActiveFetch = async () =>
      await activeHistoriesByMemberId({
        variables: {
          activeHistoriesByMemberIdInput: {
            page,
            pageView: pageSize,
            memberId,
            serviceType: serviceType !== 'All' ? (serviceType as ServiceType) : undefined,
            activeType: activeType !== 'All' ? (activeType as ActiveType) : undefined,
            ...(dates && dates.length > 0 && { dates }),
          },
        },
      })

    const onPointFetch = async () =>
      await pointHistoriesByMemberId({
        variables: {
          pointHistoriesByMemberIdInput: {
            page: pointFilterOptions.page,
            pageView: pointFilterOptions.pageSize,
            memberId,
            pointPayStatus:
              pointFilterOptions.pointPayStatus !== 'All'
                ? (pointFilterOptions.pointPayStatus as PointPayStatus)
                : undefined,
            ...(pointFilterOptions.dates &&
              pointFilterOptions.dates.length > 0 && { dates: pointFilterOptions.dates }),
          },
        },
      })

    if (memberId) {
      if (activeTab === ActiveTab.ACTIVE) {
        onActiveFetch()
      } else if (activeTab === ActiveTab.COMMENT) {
        // console.log('comment tab')
      } else if (activeTab === ActiveTab.POINT) {
        onPointFetch()
      }
    }
  }, [memberId, activeTab])

  return (
    <TabContainer className="tab-container card mt-1">
      <Tabs
        className="default"
        defaultActiveKey={activeTab}
        onChange={(value) => setActiveTab(value as ActiveTab)}
        type="card"
        tabBarExtraContent={
          <span className="extra-content">
            ❗️&nbsp;&nbsp;
            {locale === 'ko'
              ? '메시지와 댓글은 다국어 지원을 하지 않습니다.'
              : 'Messages and comments are not multilingual.'}
          </span>
        }>
        <Tabs.TabPane
          className="table-tab-container"
          tab={locale === 'ko' ? '활동이력' : 'active history'}
          key={ActiveTab.ACTIVE}>
          {isHistoryLoading ? (
            <div>
              <Skeleton active title={false} paragraph={{ rows: pageSize }} />
            </div>
          ) : (
            <>
              <div className="filter-container">
                <Space size={12}>
                  <RangePicker
                    className="filter-align"
                    locale={locale}
                    title={locale === 'ko' ? '기간' : 'Dates'}
                    value={dates}
                    onCalendarChange={(value) =>
                      setFilterOptions((prev) => ({ ...prev, dates: value as any }))
                    }
                    onPickerChange={onPickerChange}
                    onPickerOpen={onPickerOpen}
                  />
                  <Dropdown
                    className="filter-align"
                    overlay={
                      <Menu onClick={onServiceTypeMenuClick}>
                        <Menu.Item key="All">{locale === 'ko' ? '전체' : 'All'}</Menu.Item>
                        {Object.keys(ServiceType).map((type) => (
                          <Menu.Item key={ServiceType[type as keyof typeof ServiceType]}>
                            {type}
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, serviceType: visible }))
                    }
                    visible={visibleOptions.serviceType}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '구분' : 'Service'}</span>
                      <Button className="dropdown-btn" onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? serviceType === 'All'
                            ? '전체'
                            : serviceType
                          : serviceType}
                        &nbsp;
                        {isHistoryLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                  <Dropdown
                    className="filter-align"
                    overlay={
                      <Menu onClick={onActiveTypeMenuClick}>
                        <Menu.Item key="All">{locale === 'ko' ? '전체' : 'All'}</Menu.Item>
                        {Object.keys(ActiveType).map((type) => {
                          const activeTypeValue =
                            locale === 'ko'
                              ? type === 'New'
                                ? '생성'
                                : type === 'Modify'
                                ? '수정'
                                : type === 'Delete'
                                ? '삭제'
                                : type === 'Login'
                                ? '로그인'
                                : type === 'Logout'
                                ? '로그아웃'
                                : type === 'Away'
                                ? '탈퇴'
                                : type === 'View'
                                ? '조회'
                                : type === 'Charge'
                                ? '충전'
                                : type === 'Payment'
                                ? '결제'
                                : type === 'Refund'
                                ? '환불'
                                : type
                              : type

                          return (
                            <Menu.Item key={ActiveType[type as keyof typeof ActiveType] as any}>
                              {activeTypeValue}
                            </Menu.Item>
                          )
                        })}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, activeType: visible }))
                    }
                    visible={visibleOptions.activeType}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '활동' : 'Active'}</span>
                      <Button className="dropdown-btn" onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? activeType === 'All'
                            ? '전체'
                            : (activeType as ActiveType) === ActiveType.New
                            ? '생성'
                            : (activeType as ActiveType) === ActiveType.Modify
                            ? '수정'
                            : (activeType as ActiveType) === ActiveType.Delete
                            ? '삭제'
                            : (activeType as ActiveType) === ActiveType.Login
                            ? '로그인'
                            : (activeType as ActiveType) === ActiveType.Logout
                            ? '로그아웃'
                            : (activeType as ActiveType) === ActiveType.Away
                            ? '탈퇴'
                            : (activeType as ActiveType) === ActiveType.View
                            ? '조회'
                            : (activeType as ActiveType) === ActiveType.Charge
                            ? '충전'
                            : (activeType as ActiveType) === ActiveType.Payment
                            ? '결제'
                            : (activeType as ActiveType) === ActiveType.Refund
                            ? '환불'
                            : activeType
                          : activeType}
                        &nbsp;
                        {isHistoryLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                </Space>
              </div>
              <div>
                <Table
                  style={{ width: '100%' }}
                  columns={columns}
                  dataSource={
                    historiesData
                      ? historiesData.activeHistoriesByMemberId.goingActiveLog?.map(
                          ({ createDate, serviceType, activeType, content }, index) => {
                            const activeTypeValue =
                              locale === 'ko'
                                ? activeType === ActiveType.New
                                  ? '생성'
                                  : activeType === ActiveType.Modify
                                  ? '수정'
                                  : activeType === ActiveType.Delete
                                  ? '삭제'
                                  : activeType === ActiveType.Login
                                  ? '로그인'
                                  : activeType === ActiveType.Logout
                                  ? '로그아웃'
                                  : activeType === ActiveType.Away
                                  ? '탈퇴'
                                  : activeType === ActiveType.View
                                  ? '조회'
                                  : activeType === ActiveType.Charge
                                  ? '충전'
                                  : activeType === ActiveType.Payment
                                  ? '결제'
                                  : activeType === ActiveType.Refund
                                  ? '환불'
                                  : activeType
                                : activeType
                            return {
                              key: index,
                              createDate: moment(createDate).format('YYYY.MM.DD HH:mm:ss'),
                              serviceType,
                              activeType: activeTypeValue,
                              content,
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
                  <b>Total</b>{' '}
                  {historiesData?.activeHistoriesByMemberId.totalResults?.toLocaleString()}
                </span>
                <Pagination
                  pageSize={pageSize}
                  current={page}
                  total={historiesData?.activeHistoriesByMemberId.totalResults || undefined}
                  onChange={onPageChange}
                  responsive
                  showSizeChanger
                  pageSizeOptions={['10', '20', '30', '40', '50']}
                />
              </div>
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane
          className="table-tab-container"
          tab={locale === 'ko' ? '댓글이력' : 'comment history'}
          key={ActiveTab.COMMENT}>
          <h1>개발 진행 중...</h1>
        </Tabs.TabPane>
        <Tabs.TabPane
          className="table-tab-container"
          tab={locale === 'ko' ? '포인트이력' : 'point history'}
          key={ActiveTab.POINT}>
          {isPointHistoryLoading ? (
            <div>
              <Skeleton active title={false} paragraph={{ rows: pointFilterOptions.pageSize }} />
            </div>
          ) : (
            <>
              <div className="filter-container">
                <Space size={12}>
                  <RangePicker
                    className="filter-align"
                    locale={locale}
                    title={locale === 'ko' ? '기간' : 'Dates'}
                    value={pointFilterOptions.dates}
                    onCalendarChange={(value) =>
                      setPointFilterOptions((prev) => ({ ...prev, dates: value as any }))
                    }
                    onPickerChange={onPointPickerChange}
                    onPickerOpen={onPointPickerOpen}
                  />
                  <Dropdown
                    className="filter-align"
                    overlay={
                      <Menu onClick={onPointPayStatusMenuClick}>
                        <Menu.Item key="All">{locale === 'ko' ? '전체' : 'All'}</Menu.Item>
                        {Object.keys(PointPayStatus).map((type) => {
                          const pointPayStatusValue =
                            locale === 'ko'
                              ? type === 'Charge'
                                ? '충전'
                                : type === 'Pass'
                                ? '정액권'
                                : type === 'Payment'
                                ? '구매'
                                : type === 'Refund'
                                ? '취소/환불'
                                : type === 'Rental'
                                ? '대여'
                                : type
                              : type
                          return (
                            <Menu.Item key={PointPayStatus[type as keyof typeof PointPayStatus]}>
                              {pointPayStatusValue}
                            </Menu.Item>
                          )
                        })}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setPointVisibleOptions((prev) => ({ ...prev, pointPayStatus: visible }))
                    }
                    visible={pointVisibleOptions.pointPayStatus}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '활동' : 'Active'}</span>
                      <Button className="dropdown-btn" onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? pointFilterOptions.pointPayStatus === 'All'
                            ? '전체'
                            : (pointFilterOptions.pointPayStatus as PointPayStatus) ===
                              PointPayStatus.Charge
                            ? '충전'
                            : (pointFilterOptions.pointPayStatus as PointPayStatus) ===
                              PointPayStatus.Pass
                            ? '정액권'
                            : (pointFilterOptions.pointPayStatus as PointPayStatus) ===
                              PointPayStatus.Payment
                            ? '구매'
                            : (pointFilterOptions.pointPayStatus as PointPayStatus) ===
                              PointPayStatus.Refund
                            ? '취소/환불'
                            : (pointFilterOptions.pointPayStatus as PointPayStatus) ===
                              PointPayStatus.Rental
                            ? '대여'
                            : pointFilterOptions.pointPayStatus
                          : pointFilterOptions.pointPayStatus}
                        &nbsp;
                        {isPointHistoryLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                </Space>
              </div>
              <div>
                <Table
                  style={{ width: '100%' }}
                  columns={pointColumns}
                  dataSource={
                    pointHistoriesData
                      ? pointHistoriesData.pointHistoriesByMemberId.pointPayHistoryView?.map(
                          (
                            { createDate, pointPayStatus, pointPayType, amount, content },
                            index
                          ) => {
                            const pointPayStatusValue =
                              locale === 'ko'
                                ? pointPayStatus === PointPayStatus.Charge
                                  ? '충전'
                                  : pointPayStatus === PointPayStatus.Pass
                                  ? '정액권'
                                  : pointPayStatus === PointPayStatus.Payment
                                  ? '구매'
                                  : pointPayStatus === PointPayStatus.Refund
                                  ? '취소/환불'
                                  : pointPayStatus === PointPayStatus.Rental
                                  ? '대여'
                                  : pointPayStatus
                                : pointPayStatus
                            return {
                              key: index,
                              createDate: moment(createDate).format('YYYY.MM.DD HH:mm:ss'),
                              pointPayType,
                              pointPayStatus: pointPayStatusValue,
                              amount,
                              content,
                            }
                          }
                        )
                      : []
                  }
                  pagination={{
                    pageSize: pointFilterOptions.pageSize,
                    hideOnSinglePage: true,
                  }}
                />
              </div>
              <div className="pagination-content">
                <span>
                  <b>Total</b>{' '}
                  {pointHistoriesData?.pointHistoriesByMemberId.totalResults?.toLocaleString()}
                </span>
                <Pagination
                  pageSize={pointFilterOptions.pageSize}
                  current={pointFilterOptions.page}
                  total={pointHistoriesData?.pointHistoriesByMemberId.totalResults || undefined}
                  onChange={onPointPageChange}
                  responsive
                  showSizeChanger
                  pageSizeOptions={['10', '20', '30', '40', '50']}
                />
              </div>
            </>
          )}
        </Tabs.TabPane>
      </Tabs>
    </TabContainer>
  )
}

const TabContainer = styled.div`
  .filter-container {
    padding: 0 0 1rem 0;
    display: flex;
    flex-flow: row nowrap;

    ${md} {
      flex-flow: column nowrap;
    }
    .filter-align {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  .pagination-content {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    padding: 1rem;
  }
  .ant-tabs-extra-content .extra-content {
    ${md} {
      display: none;
    }
  }
`
export default HistoryTabs
