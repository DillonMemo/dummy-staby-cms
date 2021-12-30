import { Dispatch, SetStateAction } from 'react'
import { styleMode } from '../styles/styles'

export type Props = styleMode

//date format YYMMDD_HHMMSS
export const nowDate = new Date()
export const nowDateStr = `${nowDate.getFullYear().toString().padStart(4, '0')}${(
  nowDate.getMonth() + 1
)
  .toString()
  .padStart(2, '0')}${nowDate.getDate().toString().padStart(2, '0')}_${nowDate
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
    state.filter((data, i) => {
      return i !== index
    })
  )
  return
}
