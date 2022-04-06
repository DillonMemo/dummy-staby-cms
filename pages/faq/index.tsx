import { useMutation } from '@apollo/client'
import { ColumnsType } from 'antd/lib/table'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Dropdown, Menu, Pagination, Skeleton, Space, Table } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import moment from 'moment'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** graphql */
import { FaqsMutation, FaqsMutationVariables, FaqType } from '../../generated'
import { FAQS_MUTATION } from '../../graphql/mutations'
import { LoadingOutlined } from '@ant-design/icons'
import { Maybe } from 'graphql/jsutils/Maybe'

type Props = styleMode
type FaqTypeKey = keyof typeof FaqType
/** filter 옵션 인터페이스 */
interface Filters {
  faqType: FaqType | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
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
  const [{ page, faqType }, setFilterOptions] = useState<Options>({
    page: 1,
    faqType: 'All',
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
          faqsInput: { page },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page }))
    } catch (error) {
      console.error(error)
    }
  }

  const onFaqTypeMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (faqType !== key) {
        const { data } = await faqs({
          variables: {
            faqsInput: {
              page,
              faqType: key !== 'All' ? (key as Maybe<FaqType>) : undefined,
            },
          },
        })

        if (data?.faqs.ok) {
          setFilterOptions((prev) => ({ ...prev, faqType: key as FaqType | 'All' }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await faqs({
          variables: {
            faqsInput: {},
          },
        })
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
              <div className="filter-container">
                <Space>
                  <Dropdown
                    overlay={
                      <Menu onClick={onFaqTypeMenuClick}>
                        <Menu.Item key="All">All</Menu.Item>
                        {(Object.keys(FaqType) as FaqTypeKey[]).map((type) => (
                          <Menu.Item key={FaqType[type]}>{type}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, faqType: visible }))
                    }
                    visible={visibleOptions.faqType}
                    disabled={isFaqsLoading}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '분류' : 'group'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {faqType}&nbsp;
                        {isFaqsLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                </Space>
                <Space>
                  <Button
                    onClick={() => push(`/faq/create`, `/faq/create`, { locale })}
                    className="default-btn"
                    loading={isFaqsLoading}>
                    {locale === 'ko' ? '등록하기' : 'Create'}
                  </Button>
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
                          push({ pathname: '/faq/[id]', query: { id: column._id } }, `/faq/[id]`, {
                            locale,
                          }),
                      })}
                      dataSource={
                        faqsData
                          ? faqsData.faqs.faqs?.map(
                              ({ _id, title, faqType, createDate }, index: number) => {
                                const faqTypeValue =
                                  locale === 'ko'
                                    ? faqType === 'CONTENT'
                                      ? '콘텐츠'
                                      : faqType === 'PAYMENT'
                                      ? '결제/환불'
                                      : faqType === 'ETC'
                                      ? '기타'
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
                        pageSize: 20,
                        hideOnSinglePage: true,
                      }}
                    />
                  </div>
                  <div className="pagination-content">
                    <Pagination
                      pageSize={20}
                      current={page}
                      total={faqsData?.faqs.totalResults || undefined}
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

export default Faq
