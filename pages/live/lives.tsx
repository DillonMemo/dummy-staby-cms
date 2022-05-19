import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'
import { Button, Dropdown, Input, Menu, Pagination, Select, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { debounce } from 'lodash'
import moment from 'moment'
import { MenuInfo } from 'rc-menu/lib/interface'
import { RangeValue } from 'rc-picker/lib/interface'

/** components */
import Layout from '../../components/Layout'
import { LoadingOutlined } from '@ant-design/icons'
import RangePicker from '../../components/RangePicker'

/** graphql */
import { useMutation } from '@apollo/client'
import { LivesMutation, LivesMutationVariables, LiveStatus } from '../../generated'
import { LIVES_MUTATION } from '../../graphql/mutations'

/** util */
import { DATE_FORMAT } from '../../Common/commonFn'
import { toast } from 'react-toastify'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  liveStatus: keyof typeof LiveStatus | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  pageSize: number
  searchSelect: 'Title' | 'MC'
  searchText: string
  dates: moment.Moment[]
  livePreviewDates: moment.Moment[]
}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>

const Lives: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: locale === 'ko' ? '상태' : 'Status',
      dataIndex: 'liveStatus',
      key: 'liveStatus',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '제목' : 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: locale === 'ko' ? '진행자' : 'MC',
      dataIndex: 'hostName',
      key: 'hostName',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '가격' : 'price',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '시작 예정일' : 'livePreviewDate',
      dataIndex: 'livePreviewDate',
      key: 'livePreviewDate',
    },

    {
      title: locale === 'ko' ? '등록일' : 'createDate',
      dataIndex: 'createDate',
      key: 'createDate',
      fixed: 'right',
      responsive: ['md'],
    },
  ]
  const [
    { page, pageSize, liveStatus, dates, livePreviewDates, searchSelect, searchText },
    setFilterOptions,
  ] = useState<Options>({
    page: 1,
    pageSize: 20,
    liveStatus: 'All',
    dates: [],
    livePreviewDates: [],
    searchSelect: 'Title',
    searchText: '',
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    liveStatus: false,
  })
  const [lives, { data: livesData, loading: livesLoading }] = useMutation<
    LivesMutation,
    LivesMutationVariables
  >(LIVES_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, pageSize?: number) => {
    try {
      await lives({
        variables: {
          livesInput: {
            page,
            pageView: pageSize,
            liveStatus: liveStatus !== 'All' ? (liveStatus as LiveStatus) : undefined,
            ...(dates && dates.length > 0 && { dates }),
            ...(livePreviewDates && livePreviewDates.length > 0 && { livePreviewDates }),
            ...(searchSelect === 'Title'
              ? { title: searchText }
              : searchSelect === 'MC'
              ? { hostName: searchText }
              : {}),
          },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page, ...(pageSize !== undefined && { pageSize }) }))
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * LIVE 타입 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   */
  const onLiveStatusMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (liveStatus !== key) {
        const { data } = await lives({
          variables: {
            livesInput: {
              page,
              pageView: pageSize,
              liveStatus: key !== 'All' ? (key as LiveStatus) : undefined,
              ...(dates && dates.length > 0 && { dates }),
              ...(livePreviewDates && livePreviewDates.length > 0 && { livePreviewDates }),
              ...(searchSelect === 'Title'
                ? { title: searchText }
                : searchSelect === 'MC'
                ? { hostName: searchText }
                : {}),
            },
          },
        })

        if (data?.lives.ok) {
          setFilterOptions((prev) => ({ ...prev, liveStatus: key as keyof typeof LiveStatus }))
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
  const onPreviewPickerOpen = (open: boolean) => {
    if (open) setFilterOptions((prev) => ({ ...prev, livePreviewDates: [] }))
  }

  /**
   * 시작일, 종료일을 다 선택 했거나 clear 했을때 실행 이벤트 핸들러 입니다.
   * @param {RangeValue<moment.Moment>} value 날짜 결과 option
   */
  const onPickerChange = async (value: RangeValue<moment.Moment>) => {
    try {
      await lives({
        variables: {
          livesInput: {
            page,
            pageView: pageSize,
            liveStatus: liveStatus !== 'All' ? (liveStatus as LiveStatus) : undefined,
            ...(value && value.length > 0 && { dates: value }),
            ...(livePreviewDates && livePreviewDates.length > 0 && { livePreviewDates }),
            ...(searchSelect === 'Title'
              ? { title: searchText }
              : searchSelect === 'MC'
              ? { hostName: searchText }
              : {}),
          },
        },
      })
    } catch (error) {
      console.error(error)
    }
  }
  const onPreviewPickerChange = async (value: RangeValue<moment.Moment>) => {
    await lives({
      variables: {
        livesInput: {
          page,
          pageView: pageSize,
          liveStatus: liveStatus !== 'All' ? (liveStatus as LiveStatus) : undefined,
          ...(dates && dates.length > 0 && { dates }),
          ...(value && value.length > 0 && { livePreviewDates: value }),
          ...(searchSelect === 'Title'
            ? { title: searchText }
            : searchSelect === 'MC'
            ? { hostName: searchText }
            : {}),
        },
      },
    })
  }

  /**
   * 검색 이벤트 핸들러 입니다.
   */
  const onSearch = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await lives({
          variables: {
            livesInput: {
              page,
              pageView: pageSize,
              liveStatus: liveStatus !== 'All' ? (liveStatus as LiveStatus) : undefined,
              ...(dates && dates.length > 0 && { dates }),
              ...(livePreviewDates && livePreviewDates.length > 0 && { livePreviewDates }),
              ...(searchSelect === 'Title'
                ? { title: value }
                : searchSelect === 'MC'
                ? { hostName: value }
                : {}),
            },
          },
        })
        if (data?.lives.ok) {
          setFilterOptions((prev) => ({ ...prev, searchText: value }))
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, liveStatus, searchText, dates, livePreviewDates, searchSelect]
  )

  const onExcelExport = async () => {
    try {
      const link = process.env.NEXT_PUBLIC_APOLLO_LINK as string
      const param = []
      liveStatus !== 'All' && param.push(`liveStatus=${liveStatus}`)
      dates && dates.length > 0 && param.push(`dates=${JSON.stringify(dates)}`)
      livePreviewDates &&
        livePreviewDates.length > 0 &&
        param.push(`livePreviewDates=${JSON.stringify(livePreviewDates)}`)
      if (searchSelect === 'Title') searchText && param.push(`title=${searchText}`)
      else if (searchSelect === 'MC') searchText && param.push(`hostName=${searchText}`)

      router.push(`${link.substring(0, link.length - 7)}download/lives?${param.join('&')}`)
    } catch (error) {
      toast.error(locale === 'ko' ? '오류가 발생 했습니다' : 'an error', {
        theme: localStorage.theme || 'light',
      })
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await lives({
          variables: {
            livesInput: {},
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
            <li>LIVE</li>
            <li>{locale === 'ko' ? 'LIVE 관리' : 'LIVE Management'}</li>
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
                <Space className="responsive-flex">
                  <Dropdown
                    overlay={
                      <Menu onClick={onLiveStatusMenuClick}>
                        <Menu.Item key="All">All</Menu.Item>
                        {Object.keys(LiveStatus).map((status) => (
                          <Menu.Item key={LiveStatus[status as keyof typeof LiveStatus]}>
                            {status}
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, liveStatus: visible }))
                    }
                    visible={visibleOptions.liveStatus}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '상태' : 'Status'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {liveStatus}&nbsp;
                        {livesLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                  <RangePicker
                    locale={locale}
                    title={locale === 'ko' ? '시작예정일' : 'Live Priview Date'}
                    value={livePreviewDates}
                    onCalendarChange={(value) =>
                      setFilterOptions((prev) => ({ ...prev, livePreviewDates: value as any }))
                    }
                    onPickerChange={onPreviewPickerChange}
                    onPickerOpen={onPreviewPickerOpen}
                  />
                  <RangePicker
                    locale={locale}
                    title={locale === 'ko' ? '등록일' : 'Create Date'}
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
                      <Select.Option value="Title">
                        {locale === 'ko' ? '제목' : 'Title'}
                      </Select.Option>
                      <Select.Option value="MC">{locale === 'ko' ? '진행자' : 'MC'}</Select.Option>
                    </Select>
                    <Input.Search
                      name="searchText"
                      placeholder={
                        searchSelect === 'Title'
                          ? locale === 'ko'
                            ? 'Title'
                            : '제목'
                          : searchSelect === 'MC'
                          ? locale === 'ko'
                            ? '진행자'
                            : 'MC'
                          : searchSelect
                      }
                      loading={livesLoading}
                      onChange={onSearch}
                    />
                  </Input.Group>
                </Space>
              </div>

              {livesLoading ? (
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
                              pathname: '/live/[id]',
                              query: {
                                id: column && column._id ? column._id : '',
                              },
                            })
                          },
                        }
                      }}
                      dataSource={
                        livesData
                          ? livesData.lives.lives?.map((live: any, index: number) => ({
                              index: index + 1 + pageSize * (page - 1),
                              key: index,
                              _id: live._id,
                              liveStatus: live.liveStatus,
                              title: live.title,
                              hostName: live.hostName,
                              paymentAmount: live.paymentAmount + ' G',
                              livePreviewDate: DATE_FORMAT('YYYY-MM-DD', live.livePreviewDate),
                              createDate: moment(live.createDate).format('YYYY.MM.DD'),
                            }))
                          : []
                      }
                      pagination={{
                        pageSize: pageSize,
                        hideOnSinglePage: true,
                      }}
                    />
                  </div>
                  <div className="pagination-content">
                    <span>
                      <b>Total</b> {livesData?.lives.totalResults?.toLocaleString()}
                    </span>
                    <Pagination
                      pageSize={pageSize}
                      current={page}
                      total={livesData?.lives.totalResults || undefined}
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

export default Lives
