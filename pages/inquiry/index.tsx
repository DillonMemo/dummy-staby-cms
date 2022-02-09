import { ColumnsType } from 'antd/lib/table'
import { pick } from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Dropdown, Menu, Pagination, Skeleton, Space, Table } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import { LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** components */
import Layout from '../../components/Layout'

/** graphql */
import {
  BoardStatus,
  InquiriesMutation,
  InquiriesMutationVariables,
  QuestionType,
} from '../../generated'
import { useMutation } from '@apollo/client'
import { INQUIRIES_MUTATION } from '../../graphql/mutations'
import { Maybe } from 'graphql/jsutils/Maybe'

type Props = styleMode
type QuestionTypeKey = keyof typeof QuestionType
type BoardStatusKey = keyof Pick<typeof BoardStatus, 'Wait' | 'Completed'>
interface Filters {
  questionType: QuestionType | 'All'
  boardStatus: BoardStatusKey | 'All'
}
interface Options extends Filters {
  page: number
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
  const [{ page, questionType, boardStatus }, setFilterOptions] = useState<Options>({
    page: 1,
    questionType: 'All',
    boardStatus: 'All',
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
          inquiriesInput: { page },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page }))
    } catch (error) {
      console.error(error)
    }
  }

  const onQuestionTypeMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (questionType !== key) {
        const { data } = await inquiries({
          variables: {
            inquiriesInput: {
              page,
              questionType: key !== 'All' ? (key as Maybe<QuestionType>) : undefined,
              boardStatus: boardStatus !== 'All' ? (boardStatus as Maybe<BoardStatus>) : undefined,
            },
          },
        })

        if (data?.inquiries.ok) {
          setFilterOptions((prev) => ({ ...prev, questionType: key as Filters['questionType'] }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onBoardStatusMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (boardStatus !== key) {
        const { data } = await inquiries({
          variables: {
            inquiriesInput: {
              page,
              questionType: questionType !== 'All' ? questionType : undefined,
              boardStatus: key !== 'All' ? (key as Maybe<BoardStatus>) : undefined,
            },
          },
        })

        if (data?.inquiries.ok) {
          setFilterOptions((prev) => ({ ...prev, boardStatus: key as Filters['boardStatus'] }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await inquiries({
          variables: {
            inquiriesInput: {},
          },
        })
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
                      <Menu onClick={onQuestionTypeMenuClick}>
                        <Menu.Item key="All">{locale === 'ko' ? '전체' : 'All'}</Menu.Item>
                        {(Object.keys(QuestionType) as QuestionTypeKey[]).map((type) => (
                          <Menu.Item key={QuestionType[type]}>
                            {locale === 'ko'
                              ? type === 'Etc'
                                ? '기타'
                                : type === 'Event'
                                ? '이벤트/혜택'
                                : type === 'Payment'
                                ? '결제/취소/환불'
                                : type === 'Play'
                                ? '재생 및 사용오류'
                                : type === 'Service'
                                ? '서비스 이용 문의'
                                : type
                              : type}
                          </Menu.Item>
                        ))}
                      </Menu>
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
                      <Menu onClick={onBoardStatusMenuClick}>
                        <Menu.Item key="All">{locale === 'ko' ? '전체' : 'All'}</Menu.Item>
                        {(
                          Object.keys(pick(BoardStatus, ['Wait', 'Completed'])) as BoardStatusKey[]
                        ).map((type) => (
                          <Menu.Item key={BoardStatus[type]}>
                            {locale === 'ko'
                              ? type === 'Wait'
                                ? '대기'
                                : type === 'Completed'
                                ? '완료'
                                : type
                              : type}
                          </Menu.Item>
                        ))}
                      </Menu>
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
                </Space>
                <Space></Space>
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
                            { pathname: '/inquiry/[id]', query: { id: column._id } },
                            `/inquiry/[id]`,
                            { locale }
                          ),
                      })}
                      dataSource={
                        inquiriesData
                          ? inquiriesData.inquiries.inquiries?.map(
                              (
                                { _id, email, title, questionType, boardStatus, createDate }: any,
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
                        pageSize: 20,
                        hideOnSinglePage: true,
                      }}
                    />
                  </div>
                  <div className="pagination-content">
                    <Pagination
                      pageSize={20}
                      current={page}
                      total={inquiriesData?.inquiries.totalResults || undefined}
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

export default Inquiry
