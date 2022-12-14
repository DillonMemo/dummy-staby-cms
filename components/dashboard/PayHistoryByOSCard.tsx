import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { delay } from 'lodash'
import { randomSeries } from '../../Common/commonFn'

/** graphql */
// import { useQuery } from '@apollo/client'
// import { GetPayHistoryByOsQuery, GetPayHistoryByOsQueryVariables } from '../../generated'
// import { GET_PAY_HISTORY_BY_OS } from '../../graphql/queries'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const PayHistoryByOSCard: React.FC = () => {
  const { locale } = useRouter()

  /** OS별 포인트 충전 이력 정보를 가져오는 Query */
  // const { data, loading: isLoading } = useQuery<
  //   GetPayHistoryByOsQuery,
  //   GetPayHistoryByOsQueryVariables
  // >(GET_PAY_HISTORY_BY_OS)
  /** Dummy Handler */
  const [isLoading, setIsLoading] = useState<{ history: boolean }>({ history: true })

  useEffect(() => {
    delay(() => {
      setIsLoading((prev) => ({ ...prev, history: false }))
    }, 1000)
  }, [])

  // return isLoading ? (
  //   <>
  //     <Skeleton.Button active style={{ height: '100%' }} />
  //     <Skeleton.Button active style={{ height: '100%' }} />
  //   </>
  // ) : (
  //   <>
  //     <div className="card">
  //       <h6>{locale === 'ko' ? 'AOS 포인트 정보' : 'Point info about AOS'}</h6>
  //       <div
  //         style={{
  //           flexGrow: 2,
  //           display: 'inline-flex',
  //           alignItems: 'flex-end',
  //           justifyContent: 'center',
  //         }}>
  //         <Chart
  //           options={{
  //             chart: {
  //               id: 'aos-pay-history-radar',
  //               toolbar: { show: false },
  //               zoom: { enabled: false },
  //               offsetX: 6,
  //               offsetY: 18,
  //             },
  //             dataLabels: { enabled: true },
  //             xaxis: {
  //               categories: data?.getPayHistoryByOS.android
  //                 ? Object.keys(
  //                     JSON.parse(data?.getPayHistoryByOS.android) as { [s: string]: number }
  //                   )
  //                 : [],
  //             },
  //             yaxis: {
  //               labels: {
  //                 formatter: (val, i) => {
  //                   if (i % 2 === 0) {
  //                     return val.toString()
  //                   } else {
  //                     return ''
  //                   }
  //                 },
  //               },
  //             },
  //             plotOptions: {
  //               radar: {
  //                 size: 80,
  //                 polygons: {
  //                   strokeColors: localStorage.getItem('theme') === 'dark' ? '#575757' : '#e9e9e9',
  //                   fill: {
  //                     colors:
  //                       localStorage.getItem('theme') === 'dark'
  //                         ? ['#dfdfdf', '#f8f8f8']
  //                         : ['#f8f8f8', '#fff'],
  //                   },
  //                 },
  //               },
  //             },
  //             colors: ['#785dd0'],
  //             tooltip: {
  //               marker: { fillColors: ['#785dd0'] },
  //               x: { show: false },
  //               y: {
  //                 formatter: (value) => value.toString(),
  //               },
  //             },
  //             responsive: [
  //               {
  //                 breakpoint: 1200,
  //                 options: {
  //                   chart: {
  //                     offsetY: 12,
  //                   },
  //                   plotOptions: {
  //                     radar: {
  //                       size: 65,
  //                     },
  //                   },
  //                 },
  //               },
  //             ],
  //           }}
  //           series={[
  //             {
  //               name: 'AOS',
  //               data: data?.getPayHistoryByOS.android
  //                 ? Object.values(
  //                     JSON.parse(data?.getPayHistoryByOS.android) as { [s: string]: number }
  //                   )
  //                 : [],
  //             },
  //           ]}
  //           type={'radar'}
  //           width="100%"
  //           height="100%"
  //         />
  //       </div>
  //     </div>
  //     <div className="card">
  //       <h6>{locale === 'ko' ? 'IOS 포인트 정보' : 'Point info about IOS'}</h6>
  //       <div
  //         style={{
  //           flexGrow: 2,
  //           display: 'inline-flex',
  //           alignItems: 'flex-end',
  //           justifyContent: 'center',
  //         }}>
  //         <Chart
  //           options={{
  //             chart: {
  //               id: 'ios-pay-history-radar',
  //               toolbar: { show: false },
  //               zoom: { enabled: false },
  //               offsetX: 6,
  //               offsetY: 18,
  //             },
  //             dataLabels: { enabled: true },
  //             xaxis: {
  //               categories: data?.getPayHistoryByOS.ios
  //                 ? Object.keys(JSON.parse(data?.getPayHistoryByOS.ios) as { [s: string]: number })
  //                 : [],
  //             },
  //             yaxis: {
  //               labels: {
  //                 formatter: (val, i) => {
  //                   if (i % 2 === 0) {
  //                     return val.toString()
  //                   } else {
  //                     return ''
  //                   }
  //                 },
  //               },
  //             },
  //             plotOptions: {
  //               radar: {
  //                 size: 80,
  //                 polygons: {
  //                   strokeColors: localStorage.getItem('theme') === 'dark' ? '#575757' : '#e9e9e9',
  //                   fill: {
  //                     colors:
  //                       localStorage.getItem('theme') === 'dark'
  //                         ? ['#dfdfdf', '#f8f8f8']
  //                         : ['#f8f8f8', '#fff'],
  //                   },
  //                 },
  //               },
  //             },
  //             colors: ['#feb219'],
  //             tooltip: {
  //               marker: { fillColors: ['#feb219'] },
  //               x: { show: false },
  //               y: {
  //                 formatter: (value) => value.toString(),
  //               },
  //             },
  //             responsive: [
  //               {
  //                 breakpoint: 1200,
  //                 options: {
  //                   chart: {
  //                     offsetY: 12,
  //                   },
  //                   plotOptions: {
  //                     radar: {
  //                       size: 65,
  //                     },
  //                   },
  //                 },
  //               },
  //             ],
  //           }}
  //           series={[
  //             {
  //               name: 'IOS',
  //               data: data?.getPayHistoryByOS.ios
  //                 ? Object.values(
  //                     JSON.parse(data?.getPayHistoryByOS.ios) as { [s: string]: number }
  //                   )
  //                 : [],
  //             },
  //           ]}
  //           type={'radar'}
  //           width="100%"
  //           height="100%"
  //         />
  //       </div>
  //     </div>
  //   </>
  // )
  /** Dummy Handler */
  return isLoading.history ? (
    <>
      <Skeleton.Button active style={{ height: '100%' }} />
      <Skeleton.Button active style={{ height: '100%' }} />
    </>
  ) : (
    <>
      <div className="card">
        <h6>{locale === 'ko' ? 'AOS 포인트 정보' : 'Point info about AOS'}</h6>
        <div
          style={{
            flexGrow: 2,
            display: 'inline-flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <Chart
            options={{
              chart: {
                id: 'aos-pay-history-radar',
                toolbar: { show: false },
                zoom: { enabled: false },
                offsetX: 6,
                offsetY: 18,
              },
              dataLabels: { enabled: true },
              xaxis: {
                categories: ['50', '100', '150', '200', '250', '300'],
              },
              yaxis: {
                labels: {
                  formatter: (val, i) => {
                    if (i % 2 === 0) {
                      return val.toString()
                    } else {
                      return ''
                    }
                  },
                },
              },
              plotOptions: {
                radar: {
                  size: 80,
                  polygons: {
                    strokeColors: localStorage.getItem('theme') === 'dark' ? '#575757' : '#e9e9e9',
                    fill: {
                      colors:
                        localStorage.getItem('theme') === 'dark'
                          ? ['#dfdfdf', '#f8f8f8']
                          : ['#f8f8f8', '#fff'],
                    },
                  },
                },
              },
              colors: ['#785dd0'],
              tooltip: {
                marker: { fillColors: ['#785dd0'] },
                x: { show: false },
                y: {
                  formatter: (value) => value.toString(),
                },
              },
              responsive: [
                {
                  breakpoint: 1200,
                  options: {
                    chart: {
                      offsetY: 12,
                    },
                    plotOptions: {
                      radar: {
                        size: 65,
                      },
                    },
                  },
                },
              ],
            }}
            series={[
              {
                name: 'AOS',
                data: [
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                ],
              },
            ]}
            type={'radar'}
            width="100%"
            height="100%"
          />
        </div>
      </div>
      <div className="card">
        <h6>{locale === 'ko' ? 'IOS 포인트 정보' : 'Point info about IOS'}</h6>
        <div
          style={{
            flexGrow: 2,
            display: 'inline-flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <Chart
            options={{
              chart: {
                id: 'ios-pay-history-radar',
                toolbar: { show: false },
                zoom: { enabled: false },
                offsetX: 6,
                offsetY: 18,
              },
              dataLabels: { enabled: true },
              xaxis: {
                categories: ['50', '100', '150', '200', '250', '300'],
              },
              yaxis: {
                labels: {
                  formatter: (val, i) => {
                    if (i % 2 === 0) {
                      return val.toString()
                    } else {
                      return ''
                    }
                  },
                },
              },
              plotOptions: {
                radar: {
                  size: 80,
                  polygons: {
                    strokeColors: localStorage.getItem('theme') === 'dark' ? '#575757' : '#e9e9e9',
                    fill: {
                      colors:
                        localStorage.getItem('theme') === 'dark'
                          ? ['#dfdfdf', '#f8f8f8']
                          : ['#f8f8f8', '#fff'],
                    },
                  },
                },
              },
              colors: ['#feb219'],
              tooltip: {
                marker: { fillColors: ['#feb219'] },
                x: { show: false },
                y: {
                  formatter: (value) => value.toString(),
                },
              },
              responsive: [
                {
                  breakpoint: 1200,
                  options: {
                    chart: {
                      offsetY: 12,
                    },
                    plotOptions: {
                      radar: {
                        size: 65,
                      },
                    },
                  },
                },
              ],
            }}
            series={[
              {
                name: 'IOS',
                data: [
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                  randomSeries(10, 100),
                ],
              },
            ]}
            type={'radar'}
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </>
  )
}

export default PayHistoryByOSCard
