import { useMutation } from '@apollo/client'
import { Button, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import moment from 'moment'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** graphql */
import { NoticesMutation, NoticesMutationVariables } from '../../generated'
import { NOTICES_MUTATION } from '../../graphql/mutations'

type Props = styleMode

/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options {
  page: number
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
  const [{ page }, setFilterOptions] = useState<Options>({
    page: 1,
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
          noticesInput: { page },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await notices({
          variables: {
            noticesInput: {},
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
              <div className="filter-container">
                <div></div>
                <Space>
                  <Button
                    onClick={() => push(`/notice/create`, `/notice/create`, { locale })}
                    className="default-btn"
                    loading={noticesLoading}>
                    {locale === 'ko' ? '등록하기' : 'Create'}
                  </Button>
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
                      style={{ width: '100%' }}
                      columns={columns}
                      onRow={(column) => ({
                        onClick: () =>
                          push(
                            {
                              pathname: '/notice/[id]',
                              query: { id: column._id },
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
                        pageSize: 20,
                        hideOnSinglePage: true,
                      }}
                    />
                  </div>
                  <div className="pagination-content">
                    <Pagination
                      pageSize={20}
                      current={page}
                      total={noticesData?.notices.totalResults || undefined}
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

export default Notice
