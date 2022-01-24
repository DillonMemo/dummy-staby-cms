import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'
import { Button, Dropdown, Input, Menu, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { debounce } from 'lodash'
import { MenuInfo } from 'rc-menu/lib/interface'

/** components */
import Layout from '../../components/Layout'
import { LoadingOutlined } from '@ant-design/icons'

/** graphql */
import { useMutation } from '@apollo/client'
import { LivesMutation, LivesMutationVariables, LiveStatus } from '../../generated'
import { LIVES_MUTATION } from '../../graphql/mutations'
import { Maybe } from 'graphql/jsutils/Maybe'
import { DATE_FORMAT } from '../../Common/commonFn'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  liveStatus: LiveStatus | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  title: string
}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>

const Lives: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '상태' : 'Status',
      dataIndex: 'liveStatus',
      key: 'liveStatus',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '제목' : 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: locale === 'ko' ? '진행자' : 'MC',
      dataIndex: 'hostName',
      key: 'hostName',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '가격' : 'price',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '시작 예정일' : 'livePreviewDate',
      dataIndex: 'livePreviewDate',
      key: 'livePreviewDate',
      fixed: 'right',
    },
  ]
  const [{ page, liveStatus, title }, setFilterOptions] = useState<Options>({
    page: 1,
    liveStatus: 'All',
    title: '',
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    liveStatus: false,
  })
  const [lives, { data: livesData, loading: livesLoading }] = useMutation<
    LivesMutation,
    LivesMutationVariables
  >(LIVES_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await lives({
        variables: {
          livesInput: { page },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page }))
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * LIVE 타입 드롭다운 메뉴 클릭 이벤트 핸들러 입니다.
   */
  const onLiveStatusMenuClick = async ({ key }: MenuInfo) => {
    try {
      if (liveStatus !== key) {
        const { data } = await lives({
          variables: {
            livesInput: {
              page,
              liveStatus: key !== 'All' ? (key as Maybe<LiveStatus>) : undefined,
            },
          },
        })

        if (data?.lives.ok) {
          //@ts-expect-error
          setFilterOptions((prev) => ({ ...prev, liveStatus: key as Maybe<LiveStatus> }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  /**
   * 검색 이벤트 핸들러 입니다.
   */
  const onSearch = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await lives({
          variables: {
            livesInput: {
              page,
              liveStatus: liveStatus !== 'All' ? liveStatus : undefined,
              title: value,
            },
          },
        })
        if (data?.lives.ok) {
          setFilterOptions((prev) => ({ ...prev, title: value }))
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, liveStatus, title]
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        await lives({
          variables: {
            livesInput: {},
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
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '관리' : 'Management'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>LIVE</li>
            <li>{locale === 'ko' ? 'LIVE 관리' : 'LIVE Management'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <div className="table-wrapper">
              <div className="filter-container">
                <Space>
                  <Dropdown
                    overlay={
                      <Menu onClick={onLiveStatusMenuClick}>
                        <Menu.Item key="All">All</Menu.Item>
                        {Object.keys(LiveStatus).map((status) => (
                          //@ts-expect-error
                          <Menu.Item key={LiveStatus[status]}>{status}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, liveStatus: visible }))
                    }
                    visible={visibleOptions.liveStatus}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '상태' : 'Status'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {liveStatus}&nbsp;
                        {livesLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                </Space>
                <Space>
                  <Input.Search
                    placeholder={locale === 'ko' ? '타이틀' : 'Title'}
                    loading={livesLoading}
                    onChange={onSearch}
                  />
                </Space>
              </div>

              {livesLoading ? (
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
                      onRow={(column) => {
                        return {
                          onClick: () => {
                            router.push({
                              pathname: '/live/[id]',
                              query: {
                                id: column && column._id ? column._id : '',
                              },
                            })
                          },
                        }
                      }}
                      dataSource={
                        livesData
                          ? livesData.lives.lives?.map((live: any, index: number) => ({
                              key: index,
                              _id: live._id,
                              liveStatus: live.liveStatus,
                              title: live.title,
                              hostName: live.hostName,
                              paymentAmount: live.paymentAmount + ' G',
                              livePreviewDate: DATE_FORMAT('YYYY-MM-DD', live.livePreviewDate),
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
                      total={livesData?.lives.totalResults || undefined}
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

export default Lives
