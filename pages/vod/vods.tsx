import { useCallback, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { MainWrapper, ManagementWrapper, md, styleMode } from '../../styles/styles'
import styled from 'styled-components'
import { Button, Dropdown, Input, Menu, Pagination, Skeleton, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { debounce } from 'lodash'
import { MenuInfo } from 'rc-menu/lib/interface'

/** components */
import Layout from '../../components/Layout'
import { LoadingOutlined } from '@ant-design/icons'

/** graphql */
import { useMutation } from '@apollo/client'
import { VodsMutation, VodsMutationVariables, VodStatus } from '../../generated'
import { VODS_MUTATION } from '../../graphql/mutations'
import { Maybe } from 'graphql/jsutils/Maybe'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  vodStatus: VodStatus | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
  title: string
}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>

const Vods: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
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
      title: locale === 'ko' ? '가격' : 'price',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      responsive: ['md'],
    },
  ]
  const [{ page, vodStatus, title }, setFilterOptions] = useState<Options>({
    page: 1,
    vodStatus: 'All',
    title: '',
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
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await vods({
        variables: {
          vodsInput: { page },
        },
      })

      setFilterOptions((prev) => ({ ...prev, page }))
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
              page,
              vodStatus: key !== 'All' ? (key as Maybe<VodStatus>) : undefined,
            },
          },
        })
        if (data?.vods.ok) {
          //@ts-expect-error
          setFilterOptions((prev) => ({ ...prev, vodStatus: key as Maybe<VodStatus> }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  /**
   * 닉네임 변경 이벤트 핸들러 입니다.
   */
  const onTitleChange = useCallback(
    debounce(async ({ target: { value } }) => {
      try {
        const { data } = await vods({
          variables: {
            vodsInput: {
              page,
              vodStatus: vodStatus !== 'All' ? vodStatus : undefined,
              title: value,
            },
          },
        })
        if (data?.vods.ok) {
          setFilterOptions((prev) => ({ ...prev, title: value }))
        }
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    [page, vodStatus, title]
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        await vods({
          variables: {
            vodsInput: {},
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
            <li>{locale === 'ko' ? 'VOD' : 'Member'}</li>
            <li>{locale === 'ko' ? 'VOD 관리' : 'Management'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <div className="table-wrapper">
              <div className="filter-container">
                <Space>
                  <Dropdown
                    overlay={
                      <Menu onClick={onVodStatusMenuClick}>
                        <Menu.Item key="All">All</Menu.Item>
                        {Object.keys(VodStatus).map((status) => (
                          //@ts-expect-error
                          <Menu.Item key={VodStatus[status]}>{status}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, vodStatus: visible }))
                    }
                    visible={visibleOptions.vodStatus}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '상태' : 'Status'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {vodStatus}&nbsp;
                        {vodsLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                </Space>
                <Space>
                  <Input.Search
                    placeholder={locale === 'ko' ? '타이틀' : 'Title'}
                    loading={vodsLoading}
                    onChange={onTitleChange}
                  />
                </Space>
              </div>

              {vodsLoading ? (
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
                              pathname: '/vod/[id]',
                              query: {
                                id: column && column._id ? column._id : '',
                              },
                            })
                          },
                        }
                      }}
                      dataSource={
                        vodsData
                          ? vodsData.vods.vods?.map((vod: any, index: number) => ({
                              key: index,
                              _id: vod._id,
                              vodStatus: vod.vodStatus,
                              title: vod.title,
                              paymentAmount: vod.paymentAmount + ' G',
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
                      total={vodsData?.vods.totalResults || undefined}
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

export default Vods
