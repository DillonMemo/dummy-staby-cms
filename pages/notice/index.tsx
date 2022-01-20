import { useMutation } from '@apollo/client'
import { Button, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import moment from 'moment'

/** components */
import Layout from '../../components/Layout'
import { NoticesMutation, NoticesMutationVariables } from '../../generated'
import { NOTICES_MUTATION } from '../../graphql/mutations'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

type Props = styleMode

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
      title: locale === 'ko' ? '등록일' : 'creation date',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '30%',
      responsive: ['md'],
    },
  ]

  const [notices, { data: noticesData, loading: noticesLoading }] = useMutation<
    NoticesMutation,
    NoticesMutationVariables
  >(NOTICES_MUTATION)

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
                    <Skeleton active title={false} paragraph={{ rows: 20 }}></Skeleton>
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
                              query: { id: column && column._id ? column._id : '' },
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
