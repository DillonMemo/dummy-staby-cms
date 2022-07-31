import { useQuery } from '@apollo/client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'

/** components */
import Layout from '../../components/Layout'

/** graphql */
import {
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  MemberType,
  RatioType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY } from '../../graphql/queries'

/** utils */
import { delayedEntryTimeArr, getError } from '../../Common/commonFn'
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Button, DatePicker, Image, Input, InputNumber, Select, Upload } from 'antd'
import moment from 'moment'
import { RcFile, UploadFile } from 'antd/lib/upload'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'

type Props = styleMode

export interface LiveCreateForm {
  title: string
  hostName: string
  paymentAmount: number
  liveRatioType: RatioType
  livePreviewDate: Date
  delayedEntryTime: number
  liveThumbnail: string
}

type PreviewImgType = {
  isVisible: boolean
  src?: string
}

const NewCreateLive: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()
  const [previewImg, setPreviewImg] = useState<PreviewImgType>({
    isVisible: false,
  })
  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LiveCreateForm>({ mode: 'onChange' })

  const { data: memberData } = useQuery<FindMembersByTypeQuery, FindMembersByTypeQueryVariables>(
    FIND_MEMBERS_BY_TYPE_QUERY,
    {
      variables: {
        membersByTypeInput: {
          memberType: MemberType.Business,
        },
      },
    }
  )

  const onSubmit = async () => {
    try {
      console.log('submit', getValues())
    } catch (error) {
      getError(error)
    }
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'Live 추가' : 'Live Create'}</h2>
          <ol>
            <li>
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link href="/live/lives" locale={locale}>
                <a>{locale === 'ko' ? 'Live' : 'Live'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Live 추가' : 'Create Live'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card" style={{ maxWidth: 'inherit' }}>
            <Form name="createLiveForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid col-3 gap-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                    <Controller
                      control={control}
                      name="title"
                      rules={{
                        required:
                          locale === 'ko' ? '위 항목은 필수 항목입니다' : 'This input is required',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className="input"
                          placeholder={locale === 'ko' ? '제목 입력' : 'Enter the title'}
                          value={value}
                          onChange={onChange}
                          maxLength={100}
                        />
                      )}
                    />
                    {errors.title?.message && (
                      <div className="form-message">
                        <span>{errors.title.message}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '주최자' : 'HostName'}</span>
                    <Controller
                      control={control}
                      name="hostName"
                      rules={{
                        required:
                          locale === 'ko' ? '위 항목은 필수 항목입니다' : 'This input is required',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className="input"
                          placeholder={locale === 'ko' ? '주최자 입력' : 'Enter the hostName'}
                          value={value}
                          onChange={onChange}
                          maxLength={50}
                        />
                      )}
                    />
                    {errors.hostName?.message && (
                      <div className="form-message">
                        <span>{errors.hostName.message}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                    <Controller
                      control={control}
                      name="paymentAmount"
                      defaultValue={0}
                      rules={{
                        required: true,
                        min: {
                          value: 0,
                          message:
                            locale === 'ko'
                              ? '0 ~ 65535까지 입력 가능 합니다'
                              : 'You can enter from 0 to 65535',
                        },
                        max: {
                          value: 65535,
                          message:
                            locale === 'ko'
                              ? '0 ~ 65535까지 입력 가능 합니다'
                              : 'You can enter from 0 to 65535',
                        },
                      }}
                      render={({ field: { value, onChange } }) => (
                        <InputNumber
                          className="input"
                          placeholder={locale === 'ko' ? '가격 입력' : 'Enter the paymentAmount'}
                          value={value}
                          max={65535}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          onInput={
                            (text) => text.replace(/[^0-9.]/g, '') /*.replace(/(\..*)\./g, '$1')*/
                          }
                          onChange={onChange}
                        />
                      )}
                    />
                    {errors.paymentAmount?.message && (
                      <div className="form-message">
                        <span>{errors.paymentAmount.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-grid col-3 gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                    <Controller
                      control={control}
                      name="liveRatioType"
                      rules={{
                        required:
                          locale === 'ko' ? '위 항목은 필수 항목입니다' : 'This input is required',
                      }}
                      defaultValue={RatioType.Horizontal}
                      render={({ field: { value, onChange } }) => (
                        <Select value={value} onChange={onChange}>
                          {Object.keys(RatioType).map((data, index) => (
                            <Select.Option value={data.toUpperCase()} key={`type-${index}`}>
                              {locale === 'ko'
                                ? data.toUpperCase() === RatioType.Horizontal
                                  ? '가로'
                                  : data.toUpperCase() === RatioType.Vertical
                                  ? '세로'
                                  : data
                                : data}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                  </div>
                  {errors.liveRatioType?.message && (
                    <div className="form-message">
                      <span>{errors.liveRatioType.message}</span>
                    </div>
                  )}
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>
                      {locale === 'ko' ? 'Live 시작 예정 시간' : 'Live estimated start date'}
                    </span>
                    <Controller
                      control={control}
                      name="livePreviewDate"
                      rules={{
                        required:
                          locale === 'ko' ? '위 항목은 필수 항목입니다' : 'This input is required',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          disabledDate={(current) => current && current <= moment().endOf('hour')}
                          showTime={{ defaultValue: moment('00:00', 'HH:mm'), format: 'HH:mm' }}
                          value={moment(value).isValid() ? moment(value) : undefined}
                          onChange={onChange}
                          allowClear
                        />
                      )}
                    />
                    {errors.livePreviewDate?.message && (
                      <div className="form-message">
                        <span>{errors.livePreviewDate.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-item">
                  <div className="form-group">
                    <span>
                      {locale === 'ko' ? '시작 후  구매가능 시간' : 'Set the puchase time'}
                    </span>
                    <Controller
                      control={control}
                      name="delayedEntryTime"
                      rules={{
                        required:
                          locale === 'ko' ? '위 항목은 필수 항목입니다' : 'This input is required',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          onChange={onChange}
                          placeholder={
                            locale === 'ko' ? '라이브 시작 시간 이후' : 'After the live start time'
                          }>
                          <Select.Option value={0} key={'start'}>
                            {locale === 'ko' ? '구매불가' : 'Unable to purchase'}
                          </Select.Option>
                          {delayedEntryTimeArr.map((time, index) => (
                            <Select.Option value={time} key={index}>
                              {time}
                              {locale === 'ko' ? '분' : 'min'}
                            </Select.Option>
                          ))}
                          <Select.Option value={999} key={'end'}>
                            {locale === 'ko' ? '라이브 종료까지' : 'Until the end of the live'}
                          </Select.Option>
                        </Select>
                      )}
                    />
                    {errors.delayedEntryTime?.message && (
                      <div className="form-message">
                        <span>{errors.delayedEntryTime.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-grid col-3 merge gap-1 mt-1">
                <div className="form-item">
                  <div className="form-group">
                    <span>{locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                    <Controller
                      control={control}
                      name="liveThumbnail"
                      rules={{
                        required:
                          locale === 'ko' ? '위 항목은 필수 항목입니다' : 'This input is required',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <>
                          <Upload
                            name="liveThumbnail"
                            showUploadList={true}
                            maxCount={1}
                            accept=".jpg, .png, .jpeg"
                            beforeUpload={(file: RcFile) => {
                              console.log('beforeUpload', file)
                            }}
                            onChange={(target) => {
                              if (target.file.originFileObj instanceof File) {
                                const src = URL.createObjectURL(target.file.originFileObj)

                                setPreviewImg((prev) => ({ ...prev, src }))
                              }
                              return onChange(target)
                            }}
                            style={{ width: '100%' }}>
                            <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                              {locale === 'ko' ? '파일 선택 (최대: 1)' : 'Select File (Max: 1)'}
                            </Button>
                          </Upload>
                          {value && (value as any).fileList.length > 0 && (
                            <>
                              <Button
                                type="primary"
                                className="mt-half"
                                onClick={() =>
                                  setPreviewImg((prev) => ({ ...prev, isVisible: true }))
                                }>
                                {locale === 'ko' ? '이미지 미리보기' : 'Show image preview'}
                              </Button>
                              <Image
                                width={200}
                                style={{ display: 'none' }}
                                src={previewImg.src}
                                preview={{
                                  visible: previewImg.isVisible,
                                  src: previewImg.src,
                                  onVisibleChange: (bol) =>
                                    setPreviewImg((prev) => ({ ...prev, isVisible: bol })),
                                }}
                              />
                            </>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-group">
                    <span>test2</span>
                  </div>
                </div>
              </div>
              <div className="form-item">
                <div className="button-group">
                  <Link href="/live/lives" locale={locale}>
                    <a>
                      <Button className="submit-button" type="primary" role="button">
                        {locale === 'ko' ? '목록' : 'List'}
                      </Button>
                    </a>
                  </Link>
                  <Button
                    type="primary"
                    role="button"
                    htmlType="submit"
                    className="submit-button"
                    disabled={Object.keys(errors).length > 0}
                    loading={false}>
                    {locale === 'ko' ? '저장' : 'Save'}
                  </Button>
                </div>
              </div>
            </Form>
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default NewCreateLive
