import { ColumnsType } from 'antd/lib/table'
import { debounce, pick } from 'lodash'
import { NextPage } from 'next'
import router, { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Button, Dropdown, Input, Menu, Pagination, Select, Skeleton, Space, Table } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** components */
import Layout from '../../components/Layout'
import RangePicker from '../../components/RangePicker'

/** graphql */
import {
  BoardStatus,
  InquiriesMutation,
  InquiriesMutationVariables,
  QuestionType,
} from '../../generated'
import { useMutation } from '@apollo/client'
import { INQUIRIES_MUTATION } from '../../graphql/mutations'

/** utils */
import { PAGE, PAGESIZE } from '../../lib/constants'

type Props = styleMode
type BoardStatusKey = keyof Pick<typeof BoardStatus, 'Wait' | 'Completed'>
interface Filters {
  questionType: keyof typeof QuestionType | 'All'
  boardStatus: BoardStatusKey | 'All'
}
interface Options extends Filters {
  page: number
  pageSize: number
  searchSelect: 'Email' | 'Title'
  searchText: string
  dates: moment.Moment[]
}

type Visible = Record<keyof Filters, boolean>

export interface InquiryForm {
  answer: string
  createDate: Date
}

/** Inquiry */
const Inquiry: NextPage<Props> = (props) => {
  const { locale, push } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '분류' : 'group',
      dataIndex: 'questionType',
      key: 'questionType',
    },
    {
      title: locale === 'ko' ? '제목' : 'title',
      dataIndex: 'title',
      key: 'title',
      render: (text, _, index) => (
        <div className="responsive-cell" key={index}>
          {text}
        </div>
      ),
    },
    {
      title: locale === 'ko' ? '문의자' : 'inquirer',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '응답상태' : 'responsive status',
      dataIndex: 'boardStatus',
      key: 'boardStatus',
    },
    {
      title: locale === 'ko' ? '접수일' : 'received date',
      dataIndex: 'createDate',
      key: 'createDate',
      responsive: ['md'],
    },
  ]
  const [
    { page, pageSize, questionType, boardStatus, dates, searchSelect, searchText },
    setFilterOptions,
  ] = useState<Options>({
    page: PAGE,
    pageSize: PAGESIZE,
    questionType: 'All',
    boardStatus: 'All',
    dates: [],
    searchSelect: 'Title',
    searchText: '',
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    questionType: false,
    boardStatus: false,
  })
  const [inquiries, { data: inquiriesData, loading: isInquiryLoading }] = useMutation<
    InquiriesMutation,
    InquiriesMutationVariables
  >(INQUIRIES_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await inquiries({
        variables: {
          inquiriesInput: {
            page,
            pageView: pageSize,
            questionType: questionType !== 'All' ? (questionType as QuestionType) : undefined,
            boardStatus: boardStatus !== 'All' ? (boardStatus as BoardStatus) : undefined,
            ...(dates && dates.length > 0 && { dates }),
            ...(searchSelect === 'Email'
              ? { email: searchText }
              : searchSelect === 'Title'
              ? { title: searchText }
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
   * 문의 분류 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   * @param {MenuInfo} info Menu Click params
   */
  const onQuestionTypeMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (questionType !== key) {
        const { data } = await inquiries({
          variables: {
            inquiriesInput: {
              page: PAGE,
              pageView: PAGESIZE,
              ...(key !== 'All' && { questionType: key as QuestionType }),
              ...(boardStatus !== 'All' && { boardStatus: boardStatus as BoardStatus }),
              ...(dates && dates.length > 0 && { dates }),
              ...(searchSelect === 'Email'
                ? { email: searchText }
                : searchSelect === 'Title'
                ? { title: searchText }
                : {}),
            },
          },
        })

        if (data?.inquiries.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            questionType: key as Filters['questionType'],
          }))
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, page: PAGE, pageSize: PAGESIZE, questionType: key },
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
   * 응답상태 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   * @param {MenuInfo} info Menu Click params
   */
  const onBoardStatusMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (boardStatus !== key) {
        const { data } = await inquiries({
          variables: {
            inquiriesInput: {
              page: PAGE,
              pageView: PAGESIZE,
              ...(questionType !== 'All' && { questionType: questionType as QuestionType }),
              ...(key !== 'All' && { boardStatus: key as BoardStatus }),
              ...(dates && dates.length > 0 && { dates }),
              ...(searchSelect === 'Email'
                ? { email: searchText }
                : searchSelect === 'Title'
                ? { title: searchText }
                : {}),
            },
          },
        })

        if (data?.inquiries.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: PAGE,
            pageSize: PAGESIZE,
            boardStatus: key as Filters['boardStatus'],
          }))
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, page: PAGE, pageSize: PAGESIZE, boardStatus: key },
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
      await inquiries({
        variables: {
          inquiriesInput: {
            page: PAGE,
            pageView: PAGESIZE,
            ...(questionType !== 'All' && { questionType: questionType as QuestionType }),
            ...(boardStatus !== 'All' && { boardStatus: boardStatus as BoardStatus }),
            ...(value && value.length > 0 && { dates: value }),
            ...(searchSelect === 'Email'
              ? { email: searchText }
              : searchSelect === 'Title'
              ? { title: searchText }
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
   * 검색 변경 이벤트 핸들러 입니다.
   */
  const onSearchChange = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await inquiries({
          variables: {
            inquiriesInput: {
              page: PAGE,
              pageView: PAGESIZE,
              ...(questionType !== 'All' && { questionType: questionType as QuestionType }),
              ...(boardStatus !== 'All' && { boardStatus: boardStatus as BoardStatus }),
              ...(dates && dates.length > 0 && { dates }),
              ...(searchSelect === 'Email'
                ? { email: value }
                : searchSelect === 'Title'
                ? { title: value }
                : {}),
            },
          },
        })

        if (data?.inquiries.ok)
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
    [page, pageSize, questionType, boardStatus, searchSelect, searchText, dates]
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await inquiries({
          variables: {
            inquiriesInput: {
              page: +(router.query.page || page),
              pageView: +(router.query.pageSize || pageSize),
              ...(router.query.questionType &&
                router.query.questionType !== 'All' && {
                  questionType: router.query.questionType as QuestionType,
                }),
              ...(router.query.boardStatus &&
                router.query.boardStatus !== 'All' && {
                  boardStatus: router.query.boardStatus as BoardStatus,
                }),
              ...(router.query.dates &&
                router.query.dates.length > 0 && {
                  dates: [moment(router.query.dates[0]), moment(router.query.dates[1])],
                }),
            },
          },
        })

        if (data?.inquiries.ok) {
          setFilterOptions((prev) => ({
            ...prev,
            page: +(router.query.page || prev.page),
            pageSize: +(router.query.pageSize || prev.pageSize),
            ...(router.query.questionType && {
              questionType: router.query.questionType as Filters['questionType'],
            }),
            ...(router.query.boardStatus && {
              boardStatus: router.query.boardStatus as Filters['boardStatus'],
            }),
            ...(router.query.dates && {
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
    <Layout {...pick(props, ['toggleStyle', 'theme'])}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '문의' : 'Inquiry'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>{locale === 'ko' ? '문의' : 'Inquiry'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <div className="table-wrapper">
              <div className="filter-container">
                <Space>
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={onQuestionTypeMenuClick}
                        items={[
                          { key: 'All', label: locale === 'ko' ? '전체' : 'All' },
                          ...Object.keys(QuestionType).map((type) => {
                            const questionTypeValue =
                              locale === 'ko'
                                ? (type as QuestionType).toUpperCase() === QuestionType.Etc
                                  ? '기타'
                                  : (type as QuestionType).toUpperCase() === QuestionType.Event
                                  ? '이벤트/혜택'
                                  : (type as QuestionType).toUpperCase() === QuestionType.Payment
                                  ? '결제/취소/환불'
                                  : (type as QuestionType).toUpperCase() === QuestionType.Play
                                  ? '재생 및 사용오류'
                                  : (type as QuestionType).toUpperCase() === QuestionType.Service
                                  ? '서비스 이용 문의'
                                  : type
                                : type

                            return {
                              key: QuestionType[type as keyof typeof QuestionType],
                              label: questionTypeValue,
                            }
                          }),
                        ]}
                      />
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, questionType: visible }))
                    }
                    visible={visibleOptions.questionType}
                    disabled={isInquiryLoading}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '분류' : 'group'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? (questionType as QuestionType) === QuestionType.Etc
                            ? '기타'
                            : (questionType as QuestionType) === QuestionType.Event
                            ? '이벤트/혜택'
                            : (questionType as QuestionType) === QuestionType.Payment
                            ? '결제/취소/환불'
                            : (questionType as QuestionType) === QuestionType.Play
                            ? '재생 및 사용오류'
                            : (questionType as QuestionType) === QuestionType.Service
                            ? '서비스 이용 문의'
                            : questionType === 'All'
                            ? '전체'
                            : questionType
                          : questionType}
                        &nbsp;
                        {isInquiryLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={onBoardStatusMenuClick}
                        items={[
                          { key: 'All', label: locale === 'ko' ? '전체' : 'All' },
                          ...Object.keys(pick(BoardStatus, ['Wait', 'Completed'])).map((type) => {
                            const boardStatusValue =
                              locale === 'ko'
                                ? type.toUpperCase() === BoardStatus.Wait
                                  ? '대기'
                                  : type.toUpperCase() === BoardStatus.Completed
                                  ? '완료'
                                  : type
                                : type
                            return {
                              key: BoardStatus[type as keyof typeof BoardStatus],
                              label: boardStatusValue,
                            }
                          }),
                        ]}
                      />
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, boardStatus: visible }))
                    }
                    visible={visibleOptions.boardStatus}
                    disabled={isInquiryLoading}>
                    <div className="dropdown">
                      <span className="title">
                        {locale === 'ko' ? '응답상태' : 'responsive status'}
                      </span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {locale === 'ko'
                          ? boardStatus === 'All'
                            ? '전체'
                            : (boardStatus as Uppercase<Filters['boardStatus']>) === 'WAIT'
                            ? '대기'
                            : (boardStatus as Uppercase<Filters['boardStatus']>) === 'COMPLETED'
                            ? '완료'
                            : boardStatus
                          : boardStatus}
                        &nbsp;
                        {isInquiryLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                  <RangePicker
                    locale={locale}
                    title={locale === 'ko' ? '접수일' : 'Date of receipt'}
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
                      <Select.Option value="Title">
                        {locale === 'ko' ? '제목' : 'Title'}
                      </Select.Option>
                    </Select>
                    <Input.Search
                      name="searchText"
                      placeholder={
                        searchSelect === 'Email'
                          ? locale === 'ko'
                            ? '이메일'
                            : 'Email'
                          : searchSelect === 'Title'
                          ? locale === 'ko'
                            ? '제목'
                            : 'Title'
                          : searchSelect
                      }
                      loading={isInquiryLoading}
                      onChange={onSearchChange}
                    />
                  </Input.Group>
                </Space>
              </div>

              {isInquiryLoading ? (
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
                            {
                              pathname: '/inquiry/[id]',
                              query: { ...router.query, id: column._id },
                            },
                            `/inquiry/[id]`,
                            { locale }
                          ),
                      })}
                      dataSource={
                        inquiriesData
                          ? inquiriesData.inquiries.inquiries?.map(
                              (
                                {
                                  _id,
                                  createMember: { email },
                                  title,
                                  questionType,
                                  boardStatus,
                                  createDate,
                                }: any,
                                index: number
                              ) => {
                                const questionTypeValue =
                                  locale === 'ko'
                                    ? questionType === 'ETC'
                                      ? '기타'
                                      : questionType === 'EVENT'
                                      ? '이벤트/혜택'
                                      : questionType === 'PAYMENT'
                                      ? '결제/취소/환불'
                                      : questionType === 'PLAY'
                                      ? '재생 및 사용오류'
                                      : questionType === 'SERVICE'
                                      ? '서비스 이용 문의'
                                      : questionType
                                    : questionType
                                const boardStatusValue =
                                  locale === 'ko'
                                    ? boardStatus === 'WAIT'
                                      ? '대기'
                                      : boardStatus === 'COMPLETED'
                                      ? '완료'
                                      : boardStatus
                                    : boardStatus
                                return {
                                  key: index,
                                  _id,
                                  title,
                                  email,
                                  questionType: questionTypeValue,
                                  boardStatus: boardStatusValue,
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
                      <b>Total</b> {inquiriesData?.inquiries.totalResults?.toLocaleString()}
                    </span>
                    <Pagination
                      pageSize={20}
                      current={page}
                      total={inquiriesData?.inquiries.totalResults || undefined}
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

export default Inquiry
