import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'
import { Button, Dropdown, Input, Menu, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { debounce } from 'lodash'
import { MenuInfo } from 'rc-menu/lib/interface'
import { RangeValue } from 'rc-picker/lib/interface'
import moment from 'moment'
import { toast } from 'react-toastify'
import { LoadingOutlined } from '@ant-design/icons'

/** components */
import Layout from '../../components/Layout'
import RangePicker from '../../components/RangePicker'

/** graphql */
import { VodsMutation, VodsMutationVariables, VodStatus } from '../../generated'
import { useMutation } from '@apollo/client'
import { VODS_MUTATION } from '../../graphql/mutations'

/** utils */
import { DATE_FORMAT } from '../../Common/commonFn'
import { PAGE, PAGESIZE } from '../../lib/constants'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  vodStatus: keyof typeof VodStatus | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  pageSize: number
  searchText: string
  dates: moment.Moment[]
}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>

const Vods: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: locale === 'ko' ? '상태' : 'Status',
      dataIndex: 'vodStatus',
      key: 'vodStatus',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '제목' : 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: locale === 'ko' ? '가격' : 'Price',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      responsive: ['md'],
    },

    {
      title: locale === 'ko' ? '등록일' : 'CreateDate',
      dataIndex: 'createDate',
      key: 'createDate',
      responsive: ['md'],
    },
  ]
  const [{ page, pageSize, dates, vodStatus, searchText }, setFilterOptions] = useState<Options>({
    page: PAGE,
    pageSize: PAGESIZE,
    dates: [],
    vodStatus: 'All',
    searchText: '',
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    vodStatus: false,
  })
  const [vods, { data: vodsData, loading: vodsLoading }] = useMutation<
    VodsMutation,
    VodsMutationVariables
  >(VODS_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, pageSize?: number) => {
    try {
      await vods({
        variables: {
          vodsInput: {
            page,
            pageView: pageSize,
            vodStatus: vodStatus !== 'All' ? (vodStatus as VodStatus) : undefined,
            title: searchText,
            ...(dates && dates.length > 0 && { dates }),
          },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page, ...(pageSize !== undefined && { pageSize }) }))
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page, pageSize },
        },
        router.asPath,
        {
          locale,
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * vod 타입 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   */
  const onVodStatusMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (vodStatus !== key) {
        const { data } = await vods({
          variables: {
            vodsInput: {
              page: PAGE,
              pageView: PAGESIZE,
              ...(key !== 'All' && { vodStatus: key as VodStatus }),
              title: searchText,
              ...(dates && dates.length > 0 && { dates }),
            },
          },
        })
        if (data?.vods.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            vodStatus: key as keyof typeof VodStatus,
          }))
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                page: PAGE,
                pageSize: PAGESIZE,
                vodStatus: key,
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
   * 제목변경 핸들러 입니다.
   */
  const onTitleChange = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await vods({
          variables: {
            vodsInput: {
              page: PAGE,
              pageView: PAGESIZE,
              ...(vodStatus !== 'All' && { vodStatus: vodStatus as VodStatus }),
              title: value,
              ...(dates && dates.length > 0 && { dates }),
            },
          },
        })
        if (data?.vods.ok) {
          setFilterOptions((prev) => ({ ...prev, searchText: value }))
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, vodStatus, searchText, dates]
  )

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
      await vods({
        variables: {
          vodsInput: {
            page: PAGE,
            pageView: PAGESIZE,
            ...(vodStatus !== 'All' && { vodStatus: vodStatus as VodStatus }),
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

  const onExcelExport = async () => {
    try {
      const link = process.env.NEXT_PUBLIC_APOLLO_LINK as string
      const param = []
      vodStatus !== 'All' && param.push(`vodStatus=${vodStatus}`)
      dates && dates.length > 0 && param.push(`dates=${JSON.stringify(dates)}`)
      searchText && param.push(`title=${searchText}`)

      router.push(`${link.substring(0, link.length - 7)}download/vods?${param.join('&')}`)
    } catch (error) {
      toast.error(locale === 'ko' ? '오류가 발생 하였습니다' : 'an error', {
        theme: localStorage.theme || 'light',
      })
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await vods({
          variables: {
            vodsInput: {
              page: +(router.query.page || page),
              pageView: +(router.query.pageSize || pageSize),
              ...(router.query.vodStatus &&
                router.query.vodStatus !== 'All' && {
                  vodStatus: router.query.vodStatus as VodStatus,
                }),
              ...(router.query.dates &&
                router.query.dates.length > 0 && {
                  dates: [moment(router.query.dates[0]), moment(router.query.dates[1])],
                }),
            },
          },
        })

        if (data?.vods.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: +(router.query.page || prev.page),
            pageSize: +(router.query.pageSize || prev.pageSize),
            ...(router.query.vodStatus && {
              vodStatus: router.query.vodStatus as keyof typeof VodStatus,
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
            <li>{locale === 'ko' ? 'VOD' : 'Member'}</li>
            <li>{locale === 'ko' ? 'VOD 관리' : 'Management'}</li>
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
                        onClick={onVodStatusMenuClick}
                        items={[
                          { key: 'All', label: locale === 'ko' ? '전체' : 'All' },
                          ...Object.keys(VodStatus).map((status) => {
                            const statusValue =
                              locale === 'ko'
                                ? (status as VodStatus).toUpperCase() === VodStatus.Active
                                  ? '판매중'
                                  : (status as VodStatus).toUpperCase() === VodStatus.Available
                                  ? '판매가능'
                                  : (status as VodStatus).toUpperCase() === VodStatus.Delete
                                  ? '삭제'
                                  : (status as VodStatus).toUpperCase() === VodStatus.Fail
                                  ? '실패'
                                  : (status as VodStatus).toUpperCase() === VodStatus.Wait
                                  ? '등록대기'
                                  : status
                                : status
                            return {
                              key: VodStatus[status as keyof typeof VodStatus],
                              label: statusValue,
                            }
                          }),
                        ]}
                      />
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, vodStatus: visible }))
                    }
                    visible={visibleOptions.vodStatus}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '상태' : 'Status'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? vodStatus === 'All'
                            ? '전체'
                            : (vodStatus as VodStatus) === VodStatus.Active
                            ? '판매중'
                            : (vodStatus as VodStatus) === VodStatus.Available
                            ? '판매가능'
                            : (vodStatus as VodStatus) === VodStatus.Delete
                            ? '삭제'
                            : (vodStatus as VodStatus) === VodStatus.Fail
                            ? '실패'
                            : (vodStatus as VodStatus) === VodStatus.Wait
                            ? '등록대기'
                            : vodStatus
                          : vodStatus}
                        &nbsp;
                        {vodsLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
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
                  <Input.Search
                    name="searchText"
                    placeholder={locale === 'ko' ? '타이틀' : 'Title'}
                    loading={vodsLoading}
                    onChange={onTitleChange}
                  />
                </Space>
              </div>

              {vodsLoading ? (
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
                              pathname: '/vod/backup/[id]',
                              query: {
                                ...router.query,
                                id: column && column._id ? column._id : '',
                              },
                            })
                          },
                        }
                      }}
                      dataSource={
                        vodsData
                          ? vodsData.vods.vods?.map(
                              (
                                { _id, vodStatus, title, paymentAmount, createDate },
                                index: number
                              ) => {
                                const vodStatusValue =
                                  locale === 'ko'
                                    ? vodStatus === VodStatus.Active
                                      ? '판매중'
                                      : vodStatus === VodStatus.Available
                                      ? '판매가능'
                                      : vodStatus === VodStatus.Delete
                                      ? '삭제'
                                      : vodStatus === VodStatus.Fail
                                      ? '실패'
                                      : vodStatus === VodStatus.Wait
                                      ? '등록대기'
                                      : vodStatus
                                    : vodStatus
                                return {
                                  key: index,
                                  index: index + 1 + pageSize * (page - 1),
                                  _id: _id,
                                  vodStatus: vodStatusValue,
                                  title: title,
                                  paymentAmount: paymentAmount + ' G',
                                  createDate: DATE_FORMAT('YYYY-MM-DD', createDate),
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
                    <span>
                      <b>Total</b> {vodsData?.vods.totalResults?.toLocaleString()}
                    </span>
                    <Pagination
                      pageSize={pageSize}
                      current={page}
                      total={vodsData?.vods.totalResults || undefined}
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

export default Vods
