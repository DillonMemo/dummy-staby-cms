import { Dispatch, SetStateAction } from 'react'
import { styleMode } from '../styles/styles'
import { notification } from 'antd'

export type Props = styleMode

export type DateType = 'ALL' | 'YYYYMMDD' | 'YYYY-MM-DD' | 'YYYY/MM/DD'

// Date Format YYYYMMDD_HHMMSS <-- 이걸로 요청 드려요
// 등록용
export const DATE_FORMAT = (type: DateType, date?: Date): string | Date => {
  let year
  let month
  let day
  let hours
  let minutes

  if (date) {
    const dateTime = new Date(date)
    year = dateTime.getFullYear()
    month = dateTime.getMonth() + 1
    day = dateTime.getDate()
    hours = ('0' + dateTime.getHours()).slice(-2)
    minutes = ('0' + dateTime.getMinutes()).slice(-2)
  }

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
    case 'YYYY-MM-DD':
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
    case 'YYYY/MM/DD':
      return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes
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

  if (directShare === 100 && (priorityShare === 100 || priorityShare === 0)) {
    return true
  } else {
    notification.error({
      message:
        locale === 'ko'
          ? '직분배의 총합은 100 이 되고 우선 환수지분의 총합은 100 또는 0이어야 합니다.'
          : 'Has been completed',
    })
    return false
  }
}

// 통화 변환
export const currencyConvert = (currency: number) => {
  const billion = 1000000000
  const million = 1000000
  const thousand = 1000
  const calcCurrency =
    currency / billion > 1
      ? currency / billion
      : currency / million > 1
      ? currency / million
      : currency / thousand > 1
      ? currency / thousand
      : currency
  const symbol =
    currency / billion > 1
      ? 'B'
      : currency / million > 1
      ? 'M'
      : currency / thousand > 1
      ? 'K'
      : currency

  return {
    currency: calcCurrency,
    symbol,
  }
}

//은행 배열
export const bankList = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  '케이뱅크',
  '카카오뱅크',
  '토스뱅크',
  'NH농협은행',
  '수협은행',
  '대구은행',
  '부산은행',
  '경남은행',
  '광주은행',
  '전북은행',
  '제주은행',
]
