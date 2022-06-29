import { Dispatch, SetStateAction } from 'react'
import { styleMode } from '../styles/styles'
import { S3 } from '../lib/awsClient'
import { toast } from 'react-toastify'

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
    toast.error(
      locale === 'ko'
        ? '직분배의 총합은 100 이 되고 우선 환수지분의 총합은 100 또는 0이어야 합니다.'
        : 'Has been completed',
      {
        theme: localStorage.theme || 'light',
        autoClose: 5000,
      }
    )

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

//라이브 이미지 확장자 체크 및 s3업로드
/**
 *
 * @param inputElement img input
 * @param id objID
 * @param nowDate s3, db 에 등록되는 img file name. - `{id}_main_{data}.확장자` 의 형식을 가진다.
 * @param locale 언어설정
 * @param playType "vod","live"
 * @returns
 */
export const liveImgCheckExtension = async (
  inputElement: HTMLInputElement | null,
  id: string,
  locale: string | undefined,
  playType: string
) => {
  let mainImgFileName = '' //메인 썸네일

  if (inputElement && inputElement?.files && inputElement?.files[0] instanceof File) {
    if (
      inputElement.files[0].type.includes('jpg') ||
      inputElement.files[0].type.includes('png') ||
      inputElement.files[0].type.includes('jpeg')
    ) {
      const fileExtension =
        inputElement.files[0].name.split('.')[inputElement.files[0].name.split('.').length - 1]
      const fileName = `${id.toString()}_main_${nowDateStr}.${fileExtension}`

      mainImgFileName = `${
        process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
      }/going/${playType}/${id.toString()}/main/${fileName}`
      process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
        (await S3.upload({
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: mainImgFileName,
          Body: inputElement.files[0],
          ACL: 'public-read',
        }).promise())

      return fileName
    } else {
      toast.error(
        locale && locale === 'ko'
          ? '이미지의 확장자를 확인해주세요.'
          : 'Please check the Img extension.',
        {
          theme: localStorage.theme || 'light',
        }
      )
      return false
    }
  }

  return false
}

/**
 * 배열 아이템의 위치를 다른곳으로 이동시키는 유틸 함수 입니다.
 * @param {Array<any>} array 이동시킬 배열 아이템. (required)
 * @param {number} fromIndex 이동시 시작 지점. (required)
 * @param {number} toIndex 이동 완료 지점. (required)
 */
export const swap = (array: Array<any>, fromIndex: number, toIndex: number) => {
  const item = array[fromIndex]
  const length = array.length
  const diff = fromIndex - toIndex

  if (diff > 0) {
    // move left or move down
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, fromIndex),
      ...array.slice(fromIndex + 1, length),
    ]
  } else if (diff < 0) {
    // move right or move up
    const targetIndex = toIndex + 1
    return [
      ...array.slice(0, fromIndex),
      ...array.slice(fromIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length),
    ]
  }

  return array
}
