import { Dispatch, SetStateAction } from 'react'
import { styleMode } from '../styles/styles'
import { notification } from 'antd'

export type Props = styleMode

export type DateType = 'ALL' | 'YYYYMMDD'

// Date Format YYYYMMDD_HHMMSS <-- 이걸로 요청 드려요
export const DATE_FORMAT = (type: DateType): string => {
  switch (type) {
    case 'ALL':
      return new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace('T', '_')
        .replace(/-/gi, '')
        .replace(/:/gi, '')
        .replace(/\..*/, '')
    case 'YYYYMMDD':
      return new Date(+new Date() + 3240 * 10000).toISOString().split('T')[0].replace(/-/gi, '')
    default:
      throw new Error('type error')
  }
}
//date format YYMMDD_HHMMSS
export const nowDate = new Date()
export const nowDateYYMMDD = `${nowDate.getFullYear().toString().padStart(4, '0')}${(
  nowDate.getMonth() + 1
)
  .toString()
  .padStart(2, '0')}${nowDate.getDate().toString().padStart(2, '0')}`
export const nowDateStr = `${nowDateYYMMDD}_${nowDate
  .getHours()
  .toString()
  .padStart(2, '0')}${nowDate.getMinutes().toString().padStart(2, '0')}${nowDate
  .getSeconds()
  .toString()
  .padStart(2, '0')}`

//livd delayedEntryTime
export const delayedEntryTimeArr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] //라이브 시작 후 결제 가능 시간

//라이브, VOD, 사용자등 삭제 버튼
export const onDeleteBtn = (index: number, setState: Dispatch<SetStateAction<any>>, state: any) => {
  setState(
    state.filter((data: any, i: number) => {
      return i !== index
    })
  )
  return
}

//지분 체크
export const shareCheck = (shareArray: Array<any>, locale?: string) => {
  let priorityShare = 0
  let directShare = 0

  for (let i = 0; i < shareArray.length; i++) {
    priorityShare += shareArray[i].priorityShare
    directShare += shareArray[i].directShare
  }

  if (priorityShare > 100 || directShare !== 100) {
    notification.error({
      message:
        locale === 'ko'
          ? '직분배의 총합은 100 이 되고 우선 환수지분의 총합은 100 이 넘으면 안됩니다.'
          : 'Has been completed',
    })
    return false
  }
  return true
}
