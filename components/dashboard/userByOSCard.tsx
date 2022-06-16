import { Skeleton } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useState } from 'react'

const UserByOSCard: React.FC = () => {
  const { locale } = useRouter()
  const [date, setDate] = useState<moment.Moment>(moment())

  return (
    <div>
      <small>developing</small>
      <Skeleton.Button active style={{ height: '100%' }} />
    </div>
  )
}

export default UserByOSCard
