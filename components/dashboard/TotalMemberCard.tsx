import { Skeleton } from 'antd'
import { delay } from 'lodash'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
// import { useQuery } from '@apollo/client'
// import { GetTotalMembersQuery, GetTotalMembersQueryVariables } from '../../generated'
// import { GET_TOTAL_MEMBERS } from '../../graphql/queries'

const Odometer: React.ComponentType<any> = dynamic(import('react-odometerjs'), { ssr: false })

const TotalMemberCard: React.FC = () => {
  const { locale } = useRouter()
  const [totalMemberValue, setTotalMemberValue] = useState<number>(0)

  /** total members query */
  // const { data: totalMembersData, loading: isLoading } = useQuery<
  //   GetTotalMembersQuery,
  //   GetTotalMembersQueryVariables
  // >(GET_TOTAL_MEMBERS)
  /** Dummy Handler */
  const [isLoading, setIsLoading] = useState<{ members: boolean }>({ members: true })

  // useEffect(() => {
  //   if (totalMembersData) {
  //     const timer = setTimeout(() => {
  //       setTotalMemberValue(totalMembersData.getTotalMembers.count || 0)
  //     }, 100)

  //     return () => clearTimeout(timer)
  //   }
  // }, [isLoading])
  /** Dummy Handler */
  useEffect(() => {
    delay(() => {
      setIsLoading((prev) => ({ ...prev, members: false }))
      const timer = setTimeout(() => {
        setTotalMemberValue(1213)
      }, 100)

      return () => clearTimeout(timer)
    }, 1000)
  }, [])

  return isLoading.members ? (
    <div style={{ gridColumn: '1 / span 2' }}>
      <Skeleton.Button active />
    </div>
  ) : (
    <>
      <div className="card mh-10" style={{ gridColumn: '1 / span 2' }}>
        <h6>{locale === 'ko' ? '총회원수' : 'Total Members'}</h6>
        <Description>{locale === 'ko' ? '총회원' : 'Total'}</Description>
        <div className="content">
          <div className="odometer-content">
            <Odometer value={totalMemberValue} format="(,ddd)" />
          </div>
        </div>
      </div>
    </>
  )
}

const Description = styled.p`
  font-size: 0.75rem;
  margin-top: 0.5rem;
  text-align: center;
`

export default TotalMemberCard
