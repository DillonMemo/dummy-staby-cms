import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@apollo/client'
import { Button, Image, Input, InputNumber, Select, Skeleton, Tooltip, Upload } from 'antd'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

/** components */
import Layout from '../../components/Layout'
import VodUploadContainer from '../../components/vod/VodUploadContainer'

/** graphql */
import { GetLivesQuery, GetLivesQueryVariables, RatioType } from '../../generated'
import { GET_LIVES_QUERY } from '../../graphql/queries'

/** utils */
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { ShareInfo, SkeletonStyle } from '../live/createLive'

type Props = styleMode

export interface VodCreateForm {
  title: string
  paymentAmount: number
  vodRatioType: RatioType
  mainThumbnail: string
  content: string
  share: ShareInfo
  liveId: string
}

export type ProgressType = {
  progress: number
  status: 'active' | 'success' | 'exception' | 'normal'
}

export type ImgType = {
  isVisible: boolean
  src?: string
}

const CreateVod: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()

  const [progress, setProgress] = useState<ProgressType>({
    progress: 0,
    status: 'normal',
  })
  const [thumbnailImg, setThumbnailImg] = useState<ImgType>({
    isVisible: false,
  })

  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<VodCreateForm>({ mode: 'onChange' })

  const { data: liveData, loading: isLiveLoading } = useQuery<
    GetLivesQuery,
    GetLivesQueryVariables
  >(GET_LIVES_QUERY)

  /**
   * 최종 저장 버튼 이벤트 핸들러
   */
  const onSubmit = () => {
    console.log('submit')
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'Vod 추가' : 'Live Create'}</h2>
          <ol>
            <li>
              <Link href="/" locale={locale}>
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>
              <Link href="/vod/vods" locale={locale}>
                <a>{locale === 'ko' ? 'Vod' : 'Vod'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? 'Vod 추가' : 'Vod Create'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            {!isLiveLoading ? (
              <Form name="createVodForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid col-4 gap-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                      <Controller
                        control={control}
                        name="title"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목 입니다'
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
                      <span>{locale === 'ko' ? '가격' : 'Price'}</span>
                      <Controller
                        control={control}
                        name="paymentAmount"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '0 ~ 65535까지 필수 입력 입니다'
                              : 'You can enter from 0 to 65535',
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

                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '비율' : 'Ratio'}</span>
                      <Controller
                        control={control}
                        name="vodRatioType"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목 입니다'
                              : 'This input is required',
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
                      {errors.vodRatioType?.message && (
                        <div className="form-message">
                          <span>{errors.vodRatioType.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>
                        Live&nbsp;
                        <Tooltip
                          title={
                            <small>
                              {locale === 'ko'
                                ? '※ 이전 라이브에서 편집되어진 VOD일 경우.'
                                : 'If the VOD was edited from the previous live.'}{' '}
                            </small>
                          }
                          placement="right">
                          <QuestionCircleOutlined style={{ cursor: 'help', fontSize: 12 }} />
                        </Tooltip>
                      </span>
                      <Controller
                        control={control}
                        name="liveId"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            allowClear
                            showSearch
                            showArrow={false}
                            optionFilterProp="children"
                            value={value}
                            onChange={onChange}>
                            {liveData?.getLives.lives.map((live, index) => (
                              <Select.Option key={`live-${index}`} value={live._id}>
                                {live.title}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid col-3 merge gap-1 mt-1">
                  <div className="form-item">
                    <div className="form-group">
                      <span>{locale === 'ko' ? '이미지' : 'Thumbnail'}</span>
                      <Controller
                        control={control}
                        name="mainThumbnail"
                        rules={{
                          required:
                            locale === 'ko'
                              ? '위 항목은 필수 항목 입니다'
                              : 'This input is required',
                        }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Upload
                              name="mainThumbnail"
                              showUploadList={false}
                              maxCount={1}
                              accept=".jpg, .png, .jpeg"
                              onChange={(target) => {
                                if (target.file.originFileObj instanceof File) {
                                  const src = URL.createObjectURL(target.file.originFileObj)

                                  setThumbnailImg((prev) => ({ ...prev, src }))
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
                            {value && (value as any).fileList.length > 0 && (
                              <>
                                <Button
                                  type="primary"
                                  className="mt-half"
                                  onClick={() =>
                                    setThumbnailImg((prev) => ({ ...prev, isVisible: true }))
                                  }>
                                  {locale === 'ko' ? '이미지 미리보기' : 'Show image preview'}
                                </Button>
                                <Image
                                  width={200}
                                  style={{ display: 'none' }}
                                  src={thumbnailImg.src}
                                  preview={{
                                    visible: thumbnailImg.isVisible,
                                    src: thumbnailImg.src,
                                    onVisibleChange: (bol) =>
                                      setThumbnailImg((prev) => ({ ...prev, isVisible: bol })),
                                  }}
                                />
                              </>
                            )}
                          </>
                        )}
                      />
                      {errors.mainThumbnail?.message && (
                        <div className="form-message">
                          <span>{errors.mainThumbnail.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-item">
                    <div className="form-group">
                      <span>
                        VOD&nbsp;
                        <Tooltip
                          title={
                            <small>
                              {locale === 'ko'
                                ? ' ※vod 최대 8개까지 추가할 수 있습니다. '
                                : ' ※Up to eight live can be uploaded. '}
                            </small>
                          }
                          placement="right">
                          <QuestionCircleOutlined style={{ cursor: 'help', fontSize: 12 }} />
                        </Tooltip>
                      </span>
                      <VodUploadContainer />
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
                      disabled={Object.keys(errors).length > 0}>
                      {locale === 'ko' ? '저장' : 'Save'}
                    </Button>
                  </div>
                </div>
              </Form>
            ) : (
              <Form>
                <div className="form-grid col-4 gap-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                </div>
                <div className="form-grid col-3 merge gap-1 mt-1">
                  <Skeleton.Button size="large" active style={SkeletonStyle} />
                  <Skeleton.Button
                    size="large"
                    active
                    style={{ ...SkeletonStyle, minHeight: '13rem' }}
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

export default CreateVod
