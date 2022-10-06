import { NextPage } from 'next'
import router, { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Input, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'

/** components */
import Layout from '../../components/Layout'
import RangePicker from '../../components/RangePicker'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** graphql */
import { useMutation } from '@apollo/client'
import { EventsMutation, EventsMutationVariables } from '../../generated'
import { EVENTS_MUTATION } from '../../graphql/mutations'
import { debounce } from 'lodash'

/** utils */
import { PAGE, PAGESIZE } from '../../lib/constants'

type Props = styleMode

/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options {
  page: number
  pageSize: number
  searchText: string
  dates: moment.Moment[]
}

export interface EventForm {
  title: string
  content: string
}

/** 이벤트 */
const Event: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '제목' : 'title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: locale === 'ko' ? '등록일' : 'createDate',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '30%',
      responsive: ['md'],
    },
  ]

  const [{ page, pageSize, searchText, dates }, setFilterOptions] = useState<Options>({
    page: PAGE,
    pageSize: PAGESIZE,
    searchText: '',
    dates: [],
  })
  const [events, { data: eventsData, loading: eventsLoading }] = useMutation<
    EventsMutation,
    EventsMutationVariables
  >(EVENTS_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await events({
        variables: {
          eventsInput: { page, pageView: pageSize },
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
   * datepicker가 열릴 때 실행 이벤트 핸들러 입니다.
   * @param {boolean} open 달력 오픈 여부
   */
  const onPickerOpen = (open: boolean) => {
    if (open) {
      setFilterOptions((prev) => ({ ...prev, page: PAGE, pageSize: PAGESIZE, dates: [] }))
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page: PAGE, pageSize: PAGESIZE, dates: [] },
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
      await events({
        variables: {
          eventsInput: {
            page: PAGE,
            pageView: PAGESIZE,
            title: searchText,
            ...(value && value.length > 0 && { dates: value }),
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
   * 검색(Input) 이벤트 핸들러 입니다.
   */
  const onSearchChange = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await events({
          variables: {
            eventsInput: {
              page: PAGE,
              pageView: PAGESIZE,
              title: value,
              ...(dates && dates.length > 0 && { dates }),
            },
          },
        })

        if (data?.events.ok)
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            searchText: value,
          }))
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, pageSize, searchText, dates]
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await events({
          variables: {
            eventsInput: {
              page: +(router.query.page || page),
              pageView: +(router.query.pageSize || pageSize),
              ...(router.query.dates &&
                router.query.dates.length > 0 && {
                  dates: [moment(router.query.dates[0]), moment(router.query.dates[1])],
                }),
            },
          },
        })

        if (data?.events.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: +(router.query.page || prev.page),
            pageSize: +(router.query.pageSize || prev.pageSize),
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
      <MainWrapper className="card">
        <div className="main-header">
          <h2>{locale === 'ko' ? '이벤트' : 'Event'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>{locale === 'ko' ? '이벤트' : 'Event'}</li>
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
                    onClick={() => push(`/event/create`, `/event/create`, { locale })}
                    className="export-btn"
                    loading={eventsLoading}>
                    {locale === 'ko' ? '등록하기' : 'Create'}
                  </Button>
                </Space>
              </div>
              <div className="filter-container">
                <Space>
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
                    <Input.Search
                      name="searchText"
                      placeholder={locale === 'ko' ? '제목' : 'Title'}
                      loading={eventsLoading}
                      onChange={onSearchChange}
                    />
                  </Input.Group>
                </Space>
              </div>
              {eventsLoading ? (
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
                      onRow={(column) => ({
                        onClick: () =>
                          push(
                            { pathname: '/event/[id]', query: { ...router.query, id: column._id } },
                            `/event/[id]`,
                            { locale }
                          ),
                      })}
                      dataSource={
                        eventsData
                          ? eventsData.events.events?.map((event: any, index: number) => ({
                              key: index,
                              _id: event._id,
                              title: event.title,
                              createDate: moment(event.createDate).format('YYYY-MM-DD HH:mm:ss'),
                            }))
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
                      <b>Total</b> {eventsData?.events.totalResults?.toLocaleString()}
                    </span>
                    <Pagination
                      pageSize={pageSize}
                      current={page}
                      total={eventsData?.events.totalResults || undefined}
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

export default Event
