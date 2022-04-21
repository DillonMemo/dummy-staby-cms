import { ConfigProvider, DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/ko'
import ko_KR from 'antd/lib/locale/ko_KR'
import en_US from 'antd/lib/locale/en_US'
import { RangeValue } from 'rc-picker/lib/interface'

interface Props {
  locale?: string
  title: string
  value: moment.Moment[]
  onCalendarChange?: (value: RangeValue<moment.Moment>) => void
  onPickerChange?: (value: RangeValue<moment.Moment>) => void
  onPickerOpen?: (open: boolean) => void
}

const RangePicker: React.FC<Props> = ({
  locale,
  title,
  value,
  onCalendarChange,
  onPickerChange,
  onPickerOpen,
}) => {
  return (
    <div className="range-picker">
      <span className="title">{title}</span>
      <ConfigProvider locale={locale === 'ko' ? ko_KR : en_US}>
        <DatePicker.RangePicker
          value={value ? [value[0], value[1]] : undefined}
          format={'YYYY.MM.DD'}
          onCalendarChange={onCalendarChange}
          onChange={onPickerChange}
          onOpenChange={onPickerOpen}
        />
      </ConfigProvider>
    </div>
  )
}

export default RangePicker
