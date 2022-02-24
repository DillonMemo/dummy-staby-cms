import { useEffect, useState } from 'react'

const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<boolean>(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      setNetworkStatus(navigator.onLine)
      return () => setNetworkStatus(navigator.onLine)
    }
  }, [])

  return { networkStatus, setNetworkStatus }
}

export default useNetworkStatus
