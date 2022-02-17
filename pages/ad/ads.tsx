import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'
import { Button, Dropdown, Menu, notification, Pagination, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { MenuInfo } from 'rc-menu/lib/interface'

/** components */
import Layout from '../../components/Layout'
import { LoadingOutlined } from '@ant-design/icons'

/** graphql */
import { useMutation } from '@apollo/client'
import {
  AdvertisementsMutation,
  AdvertisementsMutationVariables,
  AdvertiseStatus,
  ChangeAdvertisementStatusMutation,
  ChangeAdvertisementStatusMutationVariables,
  DisplayType,
} from '../../generated'
import {
  ADVERTISEMENTS_MUTATION,
  CHANGE_ADVERTISEMENT_STATUS_MUTATION,
} from '../../graphql/mutations'
import { Maybe } from 'graphql/jsutils/Maybe'
import { DATE_FORMAT } from '../../Common/commonFn'

type Props = styleMode

/** filter 옵션 인터페이스 */
interface Filters {
  displayType: DisplayType | 'All'
}
/** filter 옵션 인터페이스를 상속 정의한 테이블 옵션 인터페이스 */
interface Options extends Filters {
  page: number
}
/** 필터 드롭다운 Visible 옵션 */
type Visible = Record<keyof Filters, boolean>

const Ads: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  /** Table component에 들어가는 column 데이터 정보 입니다. */
  const columns: ColumnsType<any> = [
    {
      title: locale === 'ko' ? '제목' : 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: locale === 'ko' ? '타입' : 'Type',
      dataIndex: 'type',
      key: 'type',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '상태' : 'adStatus',
      dataIndex: 'adStatus',
      key: 'adStatus',
      responsive: ['md'],
    },
    {
      title: locale === 'ko' ? '등록일' : 'createDate',
      dataIndex: 'createDate',
      key: 'createDate',
      fixed: 'right',
    },
  ]
  const [{ page, displayType }, setFilterOptions] = useState<Options>({
    page: 1,
    displayType: 'All',
  })
  const [visibleOptions, setVisibleOptions] = useState<Visible>({
    displayType: false,
  })

  const [ads, { data: adsData, loading: adsLoading }] = useMutation<
    AdvertisementsMutation,
    AdvertisementsMutationVariables
  >(ADVERTISEMENTS_MUTATION)

  //광고 상태 수정 뮤테이션
  const [editAdStatus] = useMutation<
    ChangeAdvertisementStatusMutation,
    ChangeAdvertisementStatusMutationVariables
  >(CHANGE_ADVERTISEMENT_STATUS_MUTATION)

  /**
   * pagination 클릭 이벤트 핸들러 입니다.
   * @param {Number} page 이동할 페이지 번호
   * @param {Number} _pageSize 페이지당 리스트 개수 `default: 20`
   */
  const onPageChange = async (page: number, _pageSize?: number) => {
    try {
      await ads({
        variables: {
          advertisementsInput: { page },
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
      if (displayType !== key) {
        const { data } = await ads({
          variables: {
            advertisementsInput: {
              page,
              displayType: key !== 'All' ? (key as Maybe<DisplayType>) : undefined,
            },
          },
        })
        if (data?.advertisements.ok) {
          //@ts-expect-error
          setFilterOptions((prev) => ({ ...prev, displayType: key as Maybe<DisplayType> }))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  //스테이터스 수정
  const onStatusChange = async (id: any, adStatus: string) => {
    try {
      const { data } = await editAdStatus({
        variables: {
          changeAdvertisementStatusInput: {
            _id: id,
            advertiseStatus:
              adStatus === 'WAIT' ? AdvertiseStatus['Display'] : AdvertiseStatus['Wait'],
          },
        },
      })
      if (!data?.changeAdvertisementStatus.ok) {
        const message =
          locale === 'ko'
            ? data?.changeAdvertisementStatus.error?.ko
            : data?.changeAdvertisementStatus.error?.en
        notification.error({
          message,
        })
        throw new Error(message)
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await ads({
          variables: {
            advertisementsInput: {},
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
            <li>AD</li>
            <li>{locale === 'ko' ? 'AD 관리' : 'AD Management'}</li>
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
                        {Object.keys(DisplayType).map((type) => (
                          //@ts-expect-error
                          <Menu.Item key={DisplayType[type]}>{type}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    onVisibleChange={(visible) =>
                      setVisibleOptions((prev) => ({ ...prev, displayType: visible }))
                    }
                    visible={visibleOptions.displayType}>
                    <div className="dropdown">
                      <span className="title">{locale === 'ko' ? '타입' : 'Type'}</span>
                      <Button onClick={(e) => e.preventDefault()}>
                        {displayType}&nbsp;
                        {adsLoading && <LoadingOutlined style={{ fontSize: '12px' }} />}
                      </Button>
                    </div>
                  </Dropdown>
                </Space>
              </div>
              <>
                <div>
                  <Table
                    style={{ width: '100%' }}
                    columns={columns}
                    onRow={(column) => {
                      return {
                        onClick: (e) => {
                          if (
                            e.target === e.currentTarget.querySelector('.adStatusBtn') ||
                            e.target === e.currentTarget.querySelector('.adStatusBtn span')
                          ) {
                            return
                          }
                          router.push({
                            pathname: '/ad/[id]',
                            query: {
                              id: column && column._id ? column._id : '',
                            },
                          })
                        },
                      }
                    }}
                    dataSource={
                      adsData
                        ? adsData.advertisements.advertisements?.map((ad: any, index: number) => ({
                            key: index,
                            _id: ad._id,
                            title: ad.title,
                            type: ad.displayType,
                            adStatus: (
                              <Button
                                onClick={() => onStatusChange(ad._id, ad.advertiseStatus)}
                                className="adStatusBtn">
                                {locale === 'ko'
                                  ? ad.advertiseStatus === 'WAIT'
                                    ? '비노출'
                                    : '노출'
                                  : ad.advertiseStatus}
                              </Button>
                            ),
                            createDate: DATE_FORMAT('YYYY/MM/DD', ad.createDate),
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
                    total={adsData?.advertisements.totalResults || undefined}
                    onChange={onPageChange}
                    responsive
                  />
                </div>
              </>
            </div>
          </ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default Ads
