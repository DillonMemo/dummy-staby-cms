import { useLazyQuery } from '@apollo/client'
import { ConfigProvider, DatePicker, DatePickerProps, Skeleton, Space } from 'antd'
import { RangePickerProps } from 'antd/lib/date-picker'
import moment from 'moment'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

/** utils */
import ko_KR from 'antd/lib/locale/ko_KR'
import en_US from 'antd/lib/locale/en_US'

/** graphql */
import { GetUserByOsQuery, GetUserByOsQueryVariables } from '../../generated'
import { GET_USER_BY_OS } from '../../graphql/queries'

const UserByOSCard: React.FC = () => {
  const { locale } = useRouter()
  const [date, setDate] = useState<moment.Moment>(moment())

  /** 일일 OS별 접속자 정보를 가져오는 Query */
  const [getUserByOs, { data, loading: isLoading }] = useLazyQuery<
    GetUserByOsQuery,
    GetUserByOsQueryVariables
  >(GET_USER_BY_OS, {
    variables: {
      getUserByOsInput: {
        date,
      },
    },
  })

  const onChange: DatePickerProps['onChange'] = (date, _) => date && setDate(date)
  const disabledDate: RangePickerProps['disabledDate'] = (current) =>
    current && current > moment().endOf('day')

  useEffect(() => {
    getUserByOs({
      variables: {
        getUserByOsInput: {
          date,
        },
      },
    })
  }, [date])

  return isLoading && !data ? (
    <div>
      <Skeleton.Button active style={{ height: '100%' }} />
    </div>
  ) : (
    <>
      <div className="card">
        <h6>{locale === 'ko' ? 'OS별 이용자수' : 'User by OS'}</h6>
        <Space>
          <ConfigProvider locale={locale === 'ko' ? ko_KR : en_US}>
            <DatePicker
              size={'small'}
              format={`~ YY.MM.DD`}
              style={{ padding: 0 }}
              value={date}
              onChange={onChange}
              disabledDate={disabledDate}
              bordered={false}
              allowClear={false}
            />
          </ConfigProvider>
        </Space>
        <div style={{ flexGrow: 2, minHeight: '12rem' }}>
          <Chart
            options={{
              chart: {
                id: 'user-by-os-line-bar',
                toolbar: { show: false },
                zoom: { enabled: false },
              },
              xaxis: {
                categories: [
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 9))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 8))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 7))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 6))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 5))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 4))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 3))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 2))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate() - 1))
                  ).format('MM-DD'),
                  moment(
                    new Date(new Date(date.format()).setDate(new Date(date.format()).getDate()))
                  ).format('MM-DD'),
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
              colors: ['rgba(254, 176, 25, 1)', 'rgba(119, 93, 208, 1)'],
              stroke: {
                curve: 'smooth',
                width: [2, 2],
              },
              markers: {
                size: 2,
                colors: ['rgba(254, 176, 25, 1)', 'rgba(119, 93, 208, 1)'],
                strokeColors: ['rgba(254, 176, 25, 1)', 'rgba(119, 93, 208, 1)'],
                hover: { sizeOffset: 2 },
                strokeWidth: 2,
              },
              tooltip: {
                marker: { fillColors: ['rgba(254, 176, 25, 1)', 'rgba(119, 93, 208, 1)'] },
                x: { show: false },
              },
              legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: -36,
                itemMargin: {
                  vertical: 6,
                  horizontal: 6,
                },
              },
            }}
            series={[
              {
                name: 'IOS',
                data: data?.getUserByOs.iosCounts as number[],
                type: 'line',
              },
              {
                name: 'AOS',
                data: data?.getUserByOs.androidCounts as number[],
                type: 'line',
              },
            ]}
            width="100%"
            height="90%"
          />
        </div>
      </div>
    </>
  )
}

export default UserByOSCard
