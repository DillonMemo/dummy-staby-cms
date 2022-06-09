import { useLazyQuery } from '@apollo/client'
import { ConfigProvider, DatePicker, DatePickerProps, Skeleton, Space } from 'antd'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

/** graphql */
import { GetNewMembersQuery, GetNewMembersQueryVariables } from '../../generated'
import { GET_NEW_MEMBERS } from '../../graphql/queries'

/** utils */
import ko_KR from 'antd/lib/locale/ko_KR'
import en_US from 'antd/lib/locale/en_US'
import { RangePickerProps } from 'antd/lib/date-picker'
import { markers, stroke, tooltip } from '../../lib/apexCharts'

const ContentsViewCard: React.FC = () => {
  const { locale } = useRouter()
  const [date, setDate] = useState<moment.Moment>(moment())

  /** 신규 가입자 정보를 가져오는 Query */
  const [getNewMembers, { data, loading: isLoading }] = useLazyQuery<
    GetNewMembersQuery,
    GetNewMembersQueryVariables
  >(GET_NEW_MEMBERS, {
    variables: {
      getNewMembersInput: {
        date,
      },
    },
  })

  const onChange: DatePickerProps['onChange'] = (date, _) => date && setDate(date)
  const disabledDate: RangePickerProps['disabledDate'] = (current) =>
    current && current > moment().endOf('day')

  useEffect(() => {
    getNewMembers({
      variables: {
        getNewMembersInput: {
          date,
        },
      },
    })
  }, [date])

  return isLoading && !data ? (
    <div>
      <Skeleton.Button active />
    </div>
  ) : (
    <>
      <div className="card mh-14">
        <h6>{locale === 'ko' ? '신규 가입자수' : 'New Members'}</h6>
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
        <div style={{ flexGrow: 2 }}>
          <Chart
            options={{
              chart: { id: 'line-bar', toolbar: { show: false } },
              xaxis: {
                categories: [
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
              stroke: stroke('#00E396'),
              markers: markers('#00E396'),
              tooltip: tooltip('#00E396'),
            }}
            series={[
              {
                name: locale === 'ko' ? '횟수' : 'Count',
                data: data?.getNewMembers.counts,
              },
            ]}
            type="line"
            width="100%"
            height="85%"
          />
        </div>
      </div>
    </>
  )
}

export default ContentsViewCard
