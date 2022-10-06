import { Divider, Skeleton, Space } from 'antd'
import { delay } from 'lodash'
import moment from 'moment'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { randomSeries } from '../../Common/commonFn'

const Odometer: React.ComponentType<any> = dynamic(import('react-odometerjs'), { ssr: false })

/** graphql */
// import { useQuery } from '@apollo/client'
// import { GetInquiriesHistoryQuery, GetInquiriesHistoryQueryVariables } from '../../generated'
// import { GET_INQUIRIES_HISTORY } from '../../graphql/queries'

/** styles */
import { md } from '../../styles/styles'

const InquiriesHistoryCard: React.FC = () => {
  const { locale /** push */ } = useRouter()
  const [pendingInquiryValue, setPendingInquiryValue] = useState<number>(0)
  const [processedInquiryValue, setProcessedInquiryValue] = useState<number>(0)

  /** 문의내역 정보를 가져오는 Query */
  // const { data, loading: isLoading } = useQuery<
  //   GetInquiriesHistoryQuery,
  //   GetInquiriesHistoryQueryVariables
  // >(GET_INQUIRIES_HISTORY)
  /** Dummy Handler */
  const [isLoading, setIsLoading] = useState<{ inquiry: boolean }>({ inquiry: true })

  // useEffect(() => {
  //   if (data) {
  //     const timer = setTimeout(() => {
  //       setPendingInquiryValue(data.getInquiriesHistory.pendingInquiry || 0)
  //       setProcessedInquiryValue(data.getInquiriesHistory.processedInquiry || 0)
  //     }, 100)

  //     return () => clearTimeout(timer)
  //   }
  // }, [isLoading])
  /** Dummy Handler */
  useEffect(() => {
    delay(() => {
      setIsLoading((prev) => ({ ...prev, inquiry: false }))

      const timer = setTimeout(() => {
        setPendingInquiryValue(randomSeries(10, 100))
        setProcessedInquiryValue(randomSeries(10, 100))
      }, 100)

      return () => clearTimeout(timer)
    }, 1000)
  }, [])

  // return isLoading ? (
  //   <div>
  //     <Skeleton.Button active style={{ height: '100%' }} />
  //   </div>
  // ) : (
  //   <>
  //     <div className="card">
  //       <h6>
  //         {locale === 'ko' ? '문의내역' : 'Inquiries History'}
  //         &nbsp;
  //         <Link href="/inquiry">
  //           <a>&gt;</a>
  //         </Link>
  //       </h6>
  //       <Box align="center" split={<Divider type="vertical" />}>
  //         <div className="box">
  //           <h4>{locale === 'ko' ? '대기중인 문의' : 'Pending inquiry'}</h4>
  //           <div className="count">
  //             <Odometer value={pendingInquiryValue} format="(,ddd)" />
  //           </div>
  //         </div>
  //         <div className="box">
  //           <h4>{locale === 'ko' ? '금일 처리 문의' : 'Processed inquiry at today'}</h4>
  //           <div className="count">
  //             <Odometer value={processedInquiryValue} format="(,ddd)" />
  //           </div>
  //         </div>
  //       </Box>
  //       <Rows>
  //         {data?.getInquiriesHistory.inquiries?.map((inquiry, index) => (
  //           <div
  //             key={`row-${index}`}
  //             className="row"
  //             onClick={() =>
  //               push({ pathname: '/inquiry/[id]', query: { id: inquiry._id } }, `/inquiry/[id]`, {
  //                 locale,
  //               })
  //             }>
  //             <span>{inquiry.title}</span>
  //             <span className="date">{moment(inquiry.createDate).format('MM.DD HH:mm:ss')}</span>
  //             <span>{`${inquiry.createMember.email.split('@')[0]}@...`}</span>
  //           </div>
  //         ))}
  //       </Rows>
  //     </div>
  //   </>
  // )
  return isLoading.inquiry ? (
    <div>
      <Skeleton.Button active style={{ height: '100%' }} />
    </div>
  ) : (
    <>
      <div className="card">
        <h6>
          {locale === 'ko' ? '문의내역' : 'Inquiries History'}
          &nbsp;
          <Link href="/inquiry">
            <a>&gt;</a>
          </Link>
        </h6>
        <Box align="center" split={<Divider type="vertical" />}>
          <div className="box">
            <h4>{locale === 'ko' ? '대기중인 문의' : 'Pending inquiry'}</h4>
            <div className="count">
              <Odometer value={pendingInquiryValue} format="(,ddd)" />
            </div>
          </div>
          <div className="box">
            <h4>{locale === 'ko' ? '금일 처리 문의' : 'Processed inquiry at today'}</h4>
            <div className="count">
              <Odometer value={processedInquiryValue} format="(,ddd)" />
            </div>
          </div>
        </Box>
        <Rows>
          {[1, 2, 3, 4, 5].map((num) => (
            <div className="row" key={num}>
              <span>문의 {num}</span>
              <span className="date">{moment().format('MM.DD HH:mm:ss')}</span>
              <span>{`user${num}@staby.co.kr`}</span>
            </div>
          ))}
        </Rows>
      </div>
    </>
  )
}

const Box = styled(Space)`
  margin-top: 0.5rem;
  justify-content: center;
  .ant-space-item {
    width: 100%;
    display: inline-flex;
    justify-content: center;

    .count {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 5rem;
      font-size: 1.25rem;
    }
  }

  .ant-divider {
    border-left: 1px solid ${({ theme }) => theme.border};
    height: 3rem;
  }
`

const Rows = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  .row {
    padding: 0.3rem;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    display: inline-grid;
    grid-template-columns: 1.5fr 0.8fr 0.7fr;
    &:hover {
      background-color: ${({ theme }) => theme.body};
    }
    &:not(:last-child) {
      border-bottom: 1px dashed ${({ theme }) => theme.border};
    }
    ${md} {
      padding: 0.5rem 0;
      grid-template-columns: 1.5fr 1fr 0.5fr;
    }

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:not(:first-child) {
        text-align: center;
      }
    }
  }
`

export default InquiriesHistoryCard
