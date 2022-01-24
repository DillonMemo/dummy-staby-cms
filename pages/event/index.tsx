import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'
import { Button, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** graphql */
import { useMutation } from '@apollo/client'
import { EventsMutation, EventsMutationVariables } from '../../generated'
import { EVENTS_MUTATION } from '../../graphql/mutations'
import moment from 'moment'

type Props = styleMode

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
      title: locale === 'ko' ? '등록일' : 'creation date',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '30%',
      responsive: ['md'],
    },
  ]

  const [events, { data: eventsData, loading: eventsLoading }] = useMutation<
    EventsMutation,
    EventsMutationVariables
  >(EVENTS_MUTATION)

  useEffect(() => {
    const fetch = async () => {
      try {
        await events({ variables: { eventsInput: {} } })
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
              <div className="filter-container">
                <div></div>
                <Space>
                  <Button
                    onClick={() => push(`/event/create`, `/event/create`, { locale })}
                    className="default-btn"
                    loading={eventsLoading}>
                    {locale === 'ko' ? '등록하기' : 'Create'}
                  </Button>
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
                            { pathname: '/event/[id]', query: { id: column._id } },
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

export default Event
