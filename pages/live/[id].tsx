import { useQuery } from '@apollo/client'
import { omit, pick } from 'lodash'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Button,
  DatePicker,
  Image,
  Input,
  InputNumber,
  Segmented,
  Select,
  Skeleton,
  Switch,
  Tooltip,
  Upload,
} from 'antd'
import { CSSProperties, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import moment from 'moment'
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons'
import styled from 'styled-components'

/** components */
import Layout from '../../components/Layout'

/** graphql */
import {
  FindLiveByIdQuery,
  FindLiveByIdQueryVariables,
  FindMembersByTypeQuery,
  FindMembersByTypeQueryVariables,
  LiveStatus,
  MemberType,
  RatioType,
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY, LIVE_QUERY } from '../../graphql/queries'

/** utils */
import { Edit, Form, MainWrapper, md, styleMode } from '../../styles/styles'
import { LiveCreateForm, LiveInfo, PreviewImgType } from './createLive'
import { delayedEntryTimeArr } from '../../Common/commonFn'

type Props = styleMode

interface LiveEditForm extends LiveCreateForm {
  liveStatus: LiveStatus
}

const LiveDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload, query, push } = useRouter()
  const [previewImg, setPreviewImg] = useState<PreviewImgType>({
    isVisible: false,
    progress: 0,
    status: 'normal',
  })
  const [liveInfo, setLiveInfo] = useState<LiveInfo[]>([
    { listingOrder: 0, linkPath: '', checked: false },
  ])

  const {
    getValues,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<LiveEditForm>({ mode: 'onChange' })

  /** Business 타입 멤버 정보 쿼리 */
  const { data: memberData, loading: isMemberLoading } = useQuery<
    FindMembersByTypeQuery,
    FindMembersByTypeQueryVariables
  >(FIND_MEMBERS_BY_TYPE_QUERY, {
    variables: { membersByTypeInput: { memberType: MemberType.Business } },
  })
  /** Live 정보 쿼리 */
  const {
    data: liveData,
    refetch: refreshLive,
    loading: isLiveLoading,
  } = useQuery<FindLiveByIdQuery, FindLiveByIdQueryVariables>(LIVE_QUERY, {
    variables: {
      liveInput: {
        liveId: (query.id as string) || '',
      },
    },
    onCompleted: (data: FindLiveByIdQuery) => {
      if (data.findLiveById.ok) {
        const liveInfo = data.findLiveById.live?.liveLinkInfo.map((info) =>
          pick(info, ['listingOrder', 'linkPath'])
        )
        if (data.findLiveById.live) {
          for (const info of data.findLiveById.live.liveLinkInfo) {
            console.log(info)
          }
        }
      }
    },
  })

  /**
   * 최종 저장 버튼 이벤트 핸들러
   */
  const onSubmit = async () => {
    console.log('submit', getValues())
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: '/live/lives',
                  query: { ...omit(query, 'id') },
                }}
                as={'/live/lives'}
                locale={locale}>
                <a>{locale === 'ko' ? 'Live' : 'Live'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Live 관리' : 'Live Edit'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            {!isMemberLoading && !isLiveLoading ? (
              <Form name="editLiveForm" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Controller
                    control={control}
                    key={liveData?.findLiveById.live?.liveStatus}
                    defaultValue={liveData?.findLiveById.live?.liveStatus}
                    name="liveStatus"
                    render={({ field: { value, onChange } }) => (
                      <Segmented
                        options={[
                          {
                            label: locale === 'ko' ? '비노출' : LiveStatus.Hide,
                            value: LiveStatus.Hide,
                            disabled: liveData?.findLiveById.live?.liveStatus !== LiveStatus.Hide,
                          },
                          {
                            label: locale === 'ko' ? '준비' : LiveStatus.Display,
                            value: LiveStatus.Display,
                            disabled:
                              liveData?.findLiveById.live?.liveStatus === LiveStatus.Active ||
                              liveData?.findLiveById.live?.liveStatus === LiveStatus.Finish,
                          },
                          {
                            label: locale === 'ko' ? '송출' : LiveStatus.Active,
                            value: LiveStatus.Active,
                            disabled: liveData?.findLiveById.live?.liveStatus === LiveStatus.Finish,
                          },
                          {
                            label: locale === 'ko' ? '종료' : LiveStatus.Finish,
                            value: LiveStatus.Finish,
                            disabled:
                              liveData?.findLiveById.live?.liveStatus === LiveStatus.Hide ||
                              liveData?.findLiveById.live?.liveStatus === LiveStatus.Display,
                          },
                        ]}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                <div className="form-grid col-3 gap-1 mt-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                      <Controller
                        control={control}
                        key={liveData?.findLiveById.live?.title}
                        defaultValue={liveData?.findLiveById.live?.title}
                        name="title"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
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
                        key={liveData?.findLiveById.live?.hostName}
                        defaultValue={liveData?.findLiveById.live?.hostName}
                        name="hostName"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
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
                        key={liveData?.findLiveById.live?.paymentAmount}
                        defaultValue={liveData?.findLiveById.live?.paymentAmount}
                        name="paymentAmount"
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
                        key={liveData?.findLiveById.live?.liveRatioType}
                        defaultValue={liveData?.findLiveById.live?.liveRatioType}
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Select value={value} onChange={onChange}>
                            {Object.keys(RatioType).map((data, index) => (
                              <Select.Option key={`type-${index}`} value={data.toUpperCase()}>
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
                      {errors.liveRatioType?.message && (
                        <div className="form-message">
                          <span>{errors.liveRatioType.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>
                        {locale === 'ko' ? 'Live 시작 예정 시간' : 'Live estimated start date'}
                      </span>
                      <Controller
                        control={control}
                        name="livePreviewDate"
                        key={liveData?.findLiveById.live?.livePreviewDate}
                        defaultValue={liveData?.findLiveById.live?.livePreviewDate}
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            value={moment(value).isValid() ? moment(value) : undefined}
                            onChange={onChange}
                            showTime={{
                              defaultValue: moment('00:00', 'HH:mm'),
                              format: 'HH:mm',
                            }}
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
                        {locale === 'ko' ? '시작 후 구매가능 시간' : 'Set the purchase time'}
                      </span>
                      <Controller
                        control={control}
                        name="delayedEntryTime"
                        key={liveData?.findLiveById.live?.delayedEntryTime}
                        defaultValue={liveData?.findLiveById.live?.delayedEntryTime}
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            value={value}
                            onChange={onChange}
                            placeholder={
                              locale === 'ko'
                                ? '라이브 시작 시간 이후'
                                : 'After the live start time'
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
                        key={liveData?.findLiveById.live?.mainImageName}
                        defaultValue={liveData?.findLiveById.live?.mainImageName}
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Upload
                              name="liveThumbnail"
                              showUploadList={false}
                              maxCount={1}
                              accept=".jpg, .png, .jpeg"
                              onChange={(target) => {
                                if (target.file.originFileObj instanceof File) {
                                  const src = URL.createObjectURL(target.file.originFileObj)

                                  setPreviewImg((prev) => ({ ...prev, src }))
                                }
                                return onChange(target)
                              }}
                              style={{ width: '100%' }}>
                              <Button
                                icon={<UploadOutlined />}
                                className="mt-half"
                                style={{ width: '100%' }}>
                                {locale === 'ko' ? '파일 선택 (최대: 1)' : 'Select File (Max: 1)'}
                              </Button>
                            </Upload>
                            {value && (
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
                                  src={
                                    previewImg.src ||
                                    `https://image.staby.co.kr/${
                                      process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
                                    }/going/live/${liveData?.findLiveById.live?._id}/main/${value}`
                                  }
                                  preview={{
                                    visible: previewImg.isVisible,
                                    src:
                                      previewImg.src ||
                                      `https://image.staby.co.kr/${
                                        process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
                                      }/going/live/${
                                        liveData?.findLiveById.live?._id
                                      }/main/${value}`,
                                    onVisibleChange: (bol) =>
                                      setPreviewImg((prev) => ({ ...prev, isVisible: bol })),
                                  }}
                                />
                              </>
                            )}
                          </>
                        )}
                      />
                      {errors.liveThumbnail?.message && (
                        <div className="form-message">
                          <span>{errors.liveThumbnail.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <InlineFlexContainer>
                        <span>
                          Live&nbsp;
                          <Tooltip
                            title={
                              <small>
                                {locale === 'ko'
                                  ? '※ live는 최대 8개까지 추가할 수 있습니다.'
                                  : '※ Can add up to 8 Live.'}
                              </small>
                            }
                            placement="right">
                            <QuestionCircleOutlined style={{ cursor: 'help', fontSize: 12 }} />
                          </Tooltip>
                        </span>
                        <Tooltip
                          title={
                            <small>
                              {locale === 'ko'
                                ? '※ 라이브를 일괄 변경합니다.'
                                : '※ Change Live in batches.'}
                              <br />
                              {locale === 'ko'
                                ? '※ 라이브 생성에서는 이용 불가능 합니다.'
                                : '※ Not available in live creation.'}
                            </small>
                          }
                          placement="left">
                          <Switch disabled />
                        </Tooltip>
                      </InlineFlexContainer>
                    </div>
                    <Button
                      type="dashed"
                      htmlType="button"
                      onClick={() => console.log('click')}
                      style={{ width: '100%' }}>
                      {locale === 'ko' ? '추가 (최대: 8)' : 'Add (Max: 8)'}
                    </Button>
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
            ) : (
              <Form>
                <div>
                  <Skeleton.Button active style={{ minWidth: '13rem' }} />
                </div>
                <div className="form-grid col-3 gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                </div>
                <div className="form-grid col-3 gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                </div>
                <div className="form-grid col-3 merge gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '10rem' }}
                  />
                </div>
                <div className="form-grid col-2 gap-1 mt-1">
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '15rem' }}
                  />
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '8rem' }}
                  />
                </div>
                <div className="form-item">
                  <div className="button-group">
                    <Skeleton.Button size="large" active />
                    <Skeleton.Button size="large" active />
                  </div>
                </div>
              </Form>
            )}
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const SkeletonStyle: CSSProperties = { width: '100%', minHeight: '3.714rem' }

const InlineFlexContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 0.5rem;

  ${md} {
    padding: 1rem 0;
  }
`

export default LiveDetail
