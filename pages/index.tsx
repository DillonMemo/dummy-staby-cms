import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Skeleton, Tabs } from 'antd'
import dynamic from 'next/dynamic'
import moment from 'moment'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
const Odometer: React.ComponentType<any> = dynamic(import('react-odometerjs'), { ssr: false })

/** components */
import Layout from '../components/Layout'

/** styles */
import { MainWrapper, md, styleMode, xl } from '../styles/styles'
import { useQuery } from '@apollo/client'
import { GetGoingDashboardQuery, GetGoingDashboardQueryVariables } from '../generated'
import { GET_GOING_DASHBOARD } from '../graphql/queries'
import { currencyConvert } from '../Common/commonFn'

type Props = styleMode
enum Dashboard {
  GOING = 'GOING',
  GO = 'GO',
}

const tooltip = (color = '#00E396'): ApexTooltip => ({
  marker: { fillColors: [color] },
  x: { show: false },
})

const stroke = (color = '#00E396'): ApexStroke => ({
  colors: [color],
  width: 2,
  curve: 'smooth',
})

const markers = (color = '#00E396'): ApexMarkers => ({
  size: 2,
  colors: color,
  strokeColors: color,
  strokeWidth: 2,
  hover: {
    sizeOffset: 2,
  },
  discrete: [
    {
      seriesIndex: 0,
      dataPointIndex: 5,
      fillColor: '#ffffff',
      strokeColor: color,
      size: 5,
      shape: 'circle',
    },
  ],
})

const Home: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const [odometerValue, setOdometerValue] = useState<{ [key: string]: number }>({
    totalMember: 0,
    earnedPoint: 0,
  })

  /** going dashboard query */
  const { data: goingData, loading: isGoingLoading } = useQuery<
    GetGoingDashboardQuery,
    GetGoingDashboardQueryVariables
  >(GET_GOING_DASHBOARD)

  useEffect(() => {
    if (!isGoingLoading) {
      const timer = setTimeout(() => {
        setOdometerValue({
          totalMember: goingData?.getGoingDashboard.dashboard?.totalMemberCount || 0,
          earnedPoint: currencyConvert(100000000).currency,
        })
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isGoingLoading])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <Tabs defaultActiveKey={Dashboard.GOING}>
          <Tabs.TabPane tab="Going" key={Dashboard.GOING}>
            <ContentWrapper className="main-content">
              {isGoingLoading ? (
                <>
                  <div className="col-4 gap">
                    <div className="grid col-2 gap">
                      <Skeleton.Button active />
                      <Skeleton.Button active />
                    </div>
                    <Skeleton.Button active />
                    <Skeleton.Button active />
                    <Skeleton.Button active />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-4 gap">
                    <div className="grid col-2 gap">
                      <div className="card" style={{ minHeight: '12.5rem' }}>
                        <h6>{locale === 'ko' ? '총 회원수' : 'Total Members'}</h6>
                        <div className="content">
                          <div className="odometer-content">
                            <Odometer value={odometerValue.totalMember} format="(,ddd)" />
                          </div>
                        </div>
                      </div>
                      <div className="card" style={{ minHeight: '12.5rem' }}>
                        <h6>{locale === 'ko' ? '오늘 적립 포인트' : 'Today Earned Point'}</h6>
                        <div className="content">
                          <div className="odometer-content">
                            <Odometer value={odometerValue.earnedPoint} format="(,ddd)" />
                            {currencyConvert(100000000).symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card" style={{ minHeight: '12.5rem' }}>
                      <h6>{locale === 'ko' ? '일별 로그인수' : 'Daily number of login'}</h6>
                      <p>
                        {`${moment(new Date(new Date().setDate(new Date().getDate() - 5))).format(
                          'MM.DD'
                        )} - ${moment(new Date()).format('MM.DD')}`}
                      </p>
                      <ChartWrapper>
                        <Chart
                          options={{
                            chart: { id: 'line-bar', toolbar: { show: false } },
                            xaxis: {
                              categories: [
                                moment(
                                  new Date(new Date().setDate(new Date().getDate() - 5))
                                ).format('MM-DD'),
                                moment(
                                  new Date(new Date().setDate(new Date().getDate() - 4))
                                ).format('MM-DD'),
                                moment(
                                  new Date(new Date().setDate(new Date().getDate() - 3))
                                ).format('MM-DD'),
                                moment(
                                  new Date(new Date().setDate(new Date().getDate() - 2))
                                ).format('MM-DD'),
                                moment(
                                  new Date(new Date().setDate(new Date().getDate() - 1))
                                ).format('MM-DD'),
                                moment(new Date()).format('MM-DD'),
                              ],
                              labels: { show: false },
                              axisBorder: { show: false },
                              axisTicks: { show: false },
                              floating: true,
                            },
                            yaxis: {
                              show: false,
                            },
                            grid: {
                              xaxis: { lines: { show: false } },
                              yaxis: { lines: { show: false } },
                            },
                            stroke: stroke('#00E396'),
                            markers: markers('#00E396'),
                            tooltip: tooltip('#00E396'),
                          }}
                          series={[
                            {
                              name: 'count',
                              data: goingData?.getGoingDashboard.dashboard?.loginCountByDate,
                            },
                          ]}
                          type="line"
                          width="100%"
                          height="120px"
                        />
                      </ChartWrapper>
                    </div>
                    <div className="card" style={{ minHeight: '12.5rem' }}>
                      {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                    </div>
                    <div className="card" style={{ minHeight: '12.5rem' }}>
                      {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                    </div>
                  </div>
                  <div className="dashboard-section-2 gap">
                    <div className="grid col-2 gap">
                      <div className="card" style={{ minHeight: '10rem' }}>
                        {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                      </div>
                      <div className="card" style={{ minHeight: '10rem' }}>
                        {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                      </div>
                      <div className="card" style={{ gridColumn: '1/3', minHeight: '10rem' }}>
                        {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                      </div>
                    </div>
                    <div className="card">{locale === 'ko' ? '준비중 입니다' : 'Comming soon'}</div>
                  </div>
                </>
              )}
            </ContentWrapper>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Go" key={Dashboard.GO}>
            <ContentWrapper className="main-content">
              <div className="col-2 gap">
                <div className="card" style={{ minHeight: '12.5rem' }}>
                  {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                </div>
                <div className="card" style={{ minHeight: '12.5rem' }}>
                  {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                </div>
              </div>
              <div className="dashboard-section-2 gap">
                <div className="grid grid-col-2 gap">
                  <div className="card" style={{ minHeight: '10rem' }}>
                    {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                  </div>
                  <div className="card" style={{ minHeight: '10rem' }}>
                    {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                  </div>
                  <div className="card" style={{ gridColumn: '1/3', minHeight: '10rem' }}>
                    {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
                  </div>
                </div>
                <div className="card">{locale === 'ko' ? '준비중 입니다' : 'Comming soon'}</div>
              </div>
            </ContentWrapper>
          </Tabs.TabPane>
        </Tabs>
      </MainWrapper>
    </Layout>
  )
}

const ContentWrapper = styled.div`
  display: grid;
  gap: 1.5rem;

  > div {
    display: grid;
    ${md} {
      grid-template-columns: 1fr !important;
    }
  }

  .card {
    display: flex;
    flex-flow: column nowrap;
    position: relative;

    h2 {
      margin-bottom: 1rem;
      font-size: 1.714rem;
      font-weight: 600;
      line-height: 1.2;

      ${xl} {
        font-size: 1.325rem;
      }

      ${md} {
        font-size: 1.714rem;
      }
    }
    h6 {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.2;

      ${xl} {
        font-size: 0.825rem;
      }

      ${md} {
        font-size: 1rem;
      }
    }
  }

  .col-2 {
    grid-template-columns: 1fr 1fr;
  }
  .col-4 {
    grid-template-columns: 1fr 1fr 1fr 1fr;

    .ant-skeleton-button {
      width: 100%;
      min-height: 14rem;

      ${md} {
        min-height: 10rem;
      }
    }
  }

  .dashboard-section-2 {
    grid-template-columns: 1fr 1fr;
  }

  .grid {
    display: grid;
  }

  .responsive-col-2 {
    grid-template-columns: 1fr 1fr;

    ${md} {
      grid-template-columns: 1fr;
    }
  }

  .gap {
    gap: 1.5rem;
  }

  .content {
    display: inline-grid;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    .odometer-content {
      display: inline-flex;
      font-size: 2rem;

      ${xl} {
        font-size: 1.25rem;
      }

      ${md} {
        font-size: 1.75rem;
      }
    }
  }
`

const ChartWrapper = styled.div`
  .apexcharts-canvas {
    margin: 0 auto;
  }
`

export default Home
