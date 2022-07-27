import { useMutation } from '@apollo/client'
import { Button, Input, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { NextPage } from 'next'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'
import { debounce } from 'lodash'

/** components */
import Layout from '../../components/Layout'
import RangePicker from '../../components/RangePicker'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** graphql */
import { NoticesMutation, NoticesMutationVariables } from '../../generated'
import { NOTICES_MUTATION } from '../../graphql/mutations'

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

export interface NoticeForm {
  title: string
  content: string
}

/** 공지사항 */
const Notice: NextPage<Props> = ({ toggleStyle, theme }) => {
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
  const [notices, { data: noticesData, loading: noticesLoading }] = useMutation<
    NoticesMutation,
    NoticesMutationVariables
  >(NOTICES_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await notices({
        variables: {
          noticesInput: {
            page,
            pageView: pageSize,
            title: searchText,
            ...(dates && dates.length > 0 && { dates }),
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
      await notices({
        variables: {
          noticesInput: {
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
   * 검색 (input) 이벤트 핸들러 입니다.
   */
  const onSearchChange = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await notices({
          variables: {
            noticesInput: {
              page: PAGE,
              pageView: PAGESIZE,
              title: value,
              ...(dates && dates.length > 0 && { dates }),
            },
          },
        })

        if (data?.notices.ok)
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
        const { data } = await notices({
          variables: {
            noticesInput: {
              page: +(router.query.page || page),
              pageView: +(router.query.pageSize || pageSize),
              ...(router.query.dates &&
                router.query.dates.length > 0 && {
                  dates: [moment(router.query.dates[0]), moment(router.query.dates[1])],
                }),
            },
          },
        })

        if (data?.notices.ok) {
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
          <h2>{locale === 'ko' ? '공지사항' : 'Notice'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>{locale === 'ko' ? '공지사항' : 'Notice'}</li>
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
                    onClick={() => push(`/notice/create`, `/notice/create`, { locale })}
                    className="export-btn"
                    loading={noticesLoading}>
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
                      loading={noticesLoading}
                      onChange={onSearchChange}
                    />
                  </Input.Group>
                </Space>
              </div>
              {noticesLoading ? (
                <>
                  <div>
                    <Skeleton active title={false} paragraph={{ rows: 20 }} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Table
                      style={{ width: '100%', whiteSpace: 'pre' }}
                      columns={columns}
                      onRow={(column) => ({
                        onClick: () =>
                          push(
                            {
                              pathname: '/notice/[id]',
                              query: { ...router.query, id: column._id },
                            },
                            `/notice/[id]`,
                            { locale }
                          ),
                      })}
                      dataSource={
                        noticesData
                          ? noticesData.notices.notices?.map((notice: any, index: number) => ({
                              key: index,
                              _id: notice._id,
                              title: notice.title,
                              createDate: moment(notice.createDate).format('YYYY-MM-DD HH:mm:ss'),
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
                      <b>Total</b> {noticesData?.notices.totalResults?.toLocaleString()}
                    </span>
                    <Pagination
                      pageSize={pageSize}
                      current={page}
                      total={noticesData?.notices.totalResults || undefined}
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

export default Notice
