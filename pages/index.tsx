import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'

/** components */
import Layout from '../components/Layout'

/** styles */
import { MainWrapper, md, styleMode, xl } from '../styles/styles'

/** graphql */
import TotalMemberCard from '../components/dashboard/TotalMemberCard'
import ContentsViewCard from '../components/dashboard/ContentsViewCard'
import DailyAccessorCard from '../components/dashboard/DailyAccessorCard'

type Props = styleMode
enum Dashboard {
  GOING = 'GOING',
  GO = 'GO',
}

const Home: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <Tabs className="custom-dashboard" defaultActiveKey={Dashboard.GOING}>
          <Tabs.TabPane tab="Going" key={Dashboard.GOING}>
            <ContentWrapper className="main-content">
              <div className="dashboard-section-2 gap">
                <div className="grid col-2 gap">
                  <TotalMemberCard />
                  <ContentsViewCard />
                  <DailyAccessorCard />
                </div>
              </div>
              {/* {isGoingLoading ? (
                <>
                </>
              ) : goingData ? (
                <>
                  <div className="col-4 gap">
                    <div className="grid col-2 gap">
                      <div className="card" style={{ minHeight: '12.5rem' }}>
                        <h6>{locale === 'ko' ? '누적 포인트' : 'Earned Point'}</h6>
                        <p>{moment(new Date()).format('MM.DD')}</p>
                        <div className="content">
                          <div className="odometer-content">
                            <Odometer value={odometerValue.earnedPoint} format="(,ddd)" />
                            {currencyConvert(100000000).symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                </>
              ) : (
                <>
                  <h3>
                    {locale === 'ko'
                      ? '해당 권한은 대시보드 이용이 불가능 합니다.'
                      : 'This permission is not available on the dashboard.'}
                  </h3>
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
              )} */}
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

    .ant-picker .ant-picker-input {
      font-size: 0.75rem;
      > input {
        font-size: 0.75rem;
      }
    }
  }

  .mh-10 {
    min-height: 10rem;
  }
  .mh-14 {
    min-height: 14rem;
  }

  .col-2 {
    grid-template-columns: 1fr 1fr;
  }
  .col-4 {
    grid-template-columns: 1fr 1fr 1fr 1fr;
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

    .ant-skeleton-active {
      width: 100% !important;
      height: 100% !important;
      .ant-skeleton-button {
        width: 100%;
        min-height: 14rem;

        ${md} {
          min-height: 10rem;
        }
      }
    }
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

  .apexcharts-canvas {
    margin: 0 auto;
  }
`

export default Home
