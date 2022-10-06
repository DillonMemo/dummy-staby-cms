import { useMutation } from '@apollo/client'
import { ColumnsType } from 'antd/lib/table'
import { NextPage } from 'next'
import router, { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Dropdown, Input, Menu, Pagination, Skeleton, Space, Table } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import moment from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'
import { debounce } from 'lodash'

/** components */
import Layout from '../../components/Layout'
import RangePicker from '../../components/RangePicker'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'
import { LoadingOutlined } from '@ant-design/icons'

/** graphql */
import { FaqsMutation, FaqsMutationVariables, FaqType } from '../../generated'
import { FAQS_MUTATION } from '../../graphql/mutations'

/** utils */
import { PAGE, PAGESIZE } from '../../lib/constants'

type Props = styleMode
/** filter 옵션 인터페이스 */
interface Filters {
  faqType: keyof typeof FaqType | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  pageSize: number
  searchText: string
  dates: moment.Moment[]
}

type Visible = Record<keyof Filters, boolean>

export interface FaqForm {
  title: string
  content: string
  faqType: FaqType
}

/** FAQ */
const Faq: NextPage<Props> = (props) => {
  const { locale, push } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '분류' : 'group',
      dataIndex: 'faqType',
      key: 'faqType',
    },
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
  const [{ page, pageSize, faqType, searchText, dates }, setFilterOptions] = useState<Options>({
    page: PAGE,
    pageSize: PAGESIZE,
    faqType: 'All',
    searchText: '',
    dates: [],
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    faqType: false,
  })

  const [faqs, { data: faqsData, loading: isFaqsLoading }] = useMutation<
    FaqsMutation,
    FaqsMutationVariables
  >(FAQS_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await faqs({
        variables: {
          faqsInput: {
            page,
            pageView: pageSize,
            faqType: faqType !== 'All' ? (faqType as FaqType) : undefined,
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
   * 질문 분류 카테고리 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   * @param {MenuInfo} info Menu Click params
   */
  const onFaqTypeMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (faqType !== key) {
        const { data } = await faqs({
          variables: {
            faqsInput: {
              page,
              pageView: pageSize,
              title: searchText,
              ...(key !== 'All' && { faqType: key as FaqType }),
              ...(dates && dates.length > 0 && { dates }),
            },
          },
        })

        if (data?.faqs.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            faqType: key as keyof typeof FaqType,
          }))
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, page: PAGE, pageSize: PAGESIZE, faqType: key },
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
      await faqs({
        variables: {
          faqsInput: {
            page: PAGE,
            pageView: PAGESIZE,
            title: searchText,
            ...(faqType !== 'All' && { faqType: faqType as FaqType }),
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
   * 검색 (input) 변경 이벤트 핸들러 입니다.
   */
  const onSearchChange = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await faqs({
          variables: {
            faqsInput: {
              page: PAGE,
              pageView: PAGESIZE,
              title: value,
              ...(faqType !== 'All' && { faqType: faqType as FaqType }),
              ...(dates && dates.length > 0 && { dates }),
            },
          },
        })

        if (data?.faqs.ok) {
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
    [page, pageSize, faqType, searchText, dates]
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await faqs({
          variables: {
            faqsInput: {
              page: +(router.query.page || page),
              pageView: +(router.query.pageSize || pageSize),
              ...(router.query.faqType &&
                router.query.faqType !== 'All' && {
                  faqType: router.query.faqType as FaqType,
                }),
              ...(router.query.dates &&
                router.query.dates.length > 0 && {
                  dates: [moment(router.query.dates[0]), moment(router.query.dates[1])],
                }),
            },
          },
        })

        if (data?.faqs.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: +(router.query.page || prev.page),
            pageSize: +(router.query.pageSize || prev.pageSize),
            ...(router.query.faqType && { faqType: router.query.faqType as keyof typeof FaqType }),
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
  }, [])

  return (
    <Layout {...props}>
      <MainWrapper>
        <div className="main-header">
          <h2>FAQ</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>FAQ</li>
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
                    onClick={() => push(`/faq/create`, `/faq/create`, { locale })}
                    className="export-btn"
                    loading={isFaqsLoading}>
                    {locale === 'ko' ? '등록하기' : 'Create'}
                  </Button>
                </Space>
              </div>
              <div className="filter-container">
                <Space>
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={onFaqTypeMenuClick}
                        items={[
                          { key: 'All', label: locale === 'ko' ? '전체' : 'All' },
                          ...Object.keys(FaqType).map((type) => {
                            const faqTypeValue =
                              locale === 'ko'
                                ? (type as FaqType).toUpperCase() === FaqType.Content
                                  ? '컨텐츠'
                                  : (type as FaqType).toUpperCase() === FaqType.Etc
                                  ? '기타'
                                  : (type as FaqType).toUpperCase() === FaqType.Member
                                  ? '회원'
                                  : (type as FaqType).toUpperCase() === FaqType.Payment
                                  ? '결제/환불'
                                  : (type as FaqType).toUpperCase() === FaqType.Play
                                  ? '재생 및 사용오류'
                                  : (type as FaqType).toUpperCase() === FaqType.Service
                                  ? '서비스'
                                  : type
                                : type

                            return {
                              key: FaqType[type as keyof typeof FaqType],
                              label: faqTypeValue,
                            }
                          }),
                        ]}
                      />
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, faqType: visible }))
                    }
                    visible={visibleOptions.faqType}
                    disabled={isFaqsLoading}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '분류' : 'group'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? faqType === 'All'
                            ? '전체'
                            : (faqType as FaqType).toUpperCase() === FaqType.Content
                            ? '컨텐츠'
                            : (faqType as FaqType).toUpperCase() === FaqType.Etc
                            ? '기타'
                            : (faqType as FaqType).toUpperCase() === FaqType.Member
                            ? '회원'
                            : (faqType as FaqType).toUpperCase() === FaqType.Payment
                            ? '결제/환불'
                            : (faqType as FaqType).toUpperCase() === FaqType.Play
                            ? '재생 및 사용오류'
                            : (faqType as FaqType).toUpperCase() === FaqType.Service
                            ? '서비스'
                            : faqType
                          : faqType}
                        &nbsp;
                        {isFaqsLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
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
                  <Input.Group compact>
                    <Input.Search
                      name="searchText"
                      placeholder={locale === 'ko' ? '제목' : 'Title'}
                      loading={isFaqsLoading}
                      onChange={onSearchChange}
                    />
                  </Input.Group>
                </Space>
              </div>

              {isFaqsLoading ? (
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
                            { pathname: '/faq/[id]', query: { ...router.query, id: column._id } },
                            `/faq/[id]`,
                            { locale }
                          ),
                      })}
                      dataSource={
                        faqsData
                          ? faqsData.faqs.faqs?.map(
                              ({ _id, title, faqType, createDate }, index: number) => {
                                const faqTypeValue =
                                  locale === 'ko'
                                    ? (faqType as FaqType) === FaqType.Content
                                      ? '컨텐츠'
                                      : (faqType as FaqType) === FaqType.Etc
                                      ? '기타'
                                      : (faqType as FaqType) === FaqType.Member
                                      ? '회원'
                                      : (faqType as FaqType) === FaqType.Payment
                                      ? '결제/환불'
                                      : (faqType as FaqType) === FaqType.Play
                                      ? '재생 및 사용오류'
                                      : (faqType as FaqType) === FaqType.Service
                                      ? '서비스'
                                      : faqType
                                    : faqType
                                return {
                                  key: index,
                                  _id,
                                  title,
                                  faqType: faqTypeValue,
                                  createDate: moment(createDate).format('YYYY-MM-DD HH:mm:ss'),
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
                      <b>Total</b> {faqsData?.faqs.totalResults?.toLocaleString()}
                    </span>
                    <Pagination
                      pageSize={pageSize}
                      current={page}
                      total={faqsData?.faqs.totalResults || undefined}
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

export default Faq
