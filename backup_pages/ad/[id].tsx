import Layout from '../../components/Layout'

import { NextPage } from 'next'
import Link from 'next/link'

import { DATE_FORMAT, nowDateStr, nowDateYYMMDD, Props } from '../../Common/commonFn'
import { Edit, Form, MainWrapper } from '../../styles/styles'
import { useRouter } from 'next/router'
import {
  Button,
  DatePicker,
  Image,
  Input,
  message,
  notification,
  Radio,
  Select,
  Upload,
} from 'antd'
import { Controller, useForm } from 'react-hook-form'
import moment from 'moment'
import { useEffect, useState } from 'react'

import {
  CHANGE_ADVERTISEMENT_STATUS_MUTATION,
  EDIT_ADVERTISEMENTS_MUTATION,
  LIVES_MUTATION,
  VODS_MUTATION,
} from '../../graphql/mutations'
import { S3 } from '../../lib/awsClient'

import {
  AdvertiseStatus,
  ChangeAdvertisementStatusMutation,
  ChangeAdvertisementStatusMutationVariables,
  DisplayDeviceType,
  DisplayType,
  EditAdvertisementMutation,
  EditAdvertisementMutationVariables,
  FindAdvertisementByIdQuery,
  FindAdvertisementByIdQueryVariables,
  LinkType,
  LivesMutation,
  LivesMutationVariables,
  MyQuery,
  MyQueryVariables,
  VodsMutation,
  VodsMutationVariables,
} from '../../generated'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { InboxOutlined } from '@ant-design/icons'
import { FIND_ADVERTISEMENT_BY_ID_QUERY, MY_QUERY } from '../../graphql/queries'

export interface AdCreateForm {
  displayType: DisplayType
  title: string
  mainImageName: string
  linkType: LinkType
  linkUrl: string
  displayDeviceType: DisplayDeviceType
  startDate: Date | any
  endDate: Date
}

/**
 *
 * //handleSubmit Test 다시 해볼것
 */

const AdDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const router = useRouter()
  const { locale } = useRouter()
  const { RangePicker } = DatePicker
  const { Dragger } = Upload

  const [linkTypeState, setLinkTypeState] = useState('')
  const [mainImgFile, setMainImgFile] = useState<any>()
  //링크 타입 변경시 linkUrl 초기화오류_초기 defaultValue 설정시
  const [linkTypeFirstSet, setLinkTypeFirstSet] = useState(true)

  //ad 아이디
  const adId = router.query.id ? router.query.id?.toString() : ''

  //이미지 업로드시 멤버 아이디를 넣기 위한 쿼리
  const { data: memberData } = useQuery<MyQuery, MyQueryVariables>(MY_QUERY)

  //live 뮤테이션
  const [getLives, { data: livesData }] = useMutation<LivesMutation, LivesMutationVariables>(
    LIVES_MUTATION
  )

  //vod 뮤데이션
  const [getVods, { data: vodsData }] = useMutation<VodsMutation, VodsMutationVariables>(
    VODS_MUTATION
  )

  //edit 수정 뮤테이션
  const [editAd, { loading: editLoading }] = useMutation<
    EditAdvertisementMutation,
    EditAdvertisementMutationVariables
  >(EDIT_ADVERTISEMENTS_MUTATION)

  //광고 상태 수정 뮤테이션
  const [daleteAd] = useMutation<
    ChangeAdvertisementStatusMutation,
    ChangeAdvertisementStatusMutationVariables
  >(CHANGE_ADVERTISEMENT_STATUS_MUTATION)

  const [getAd, { data: adData }] = useLazyQuery<
    FindAdvertisementByIdQuery,
    FindAdvertisementByIdQueryVariables
  >(FIND_ADVERTISEMENT_BY_ID_QUERY)

  //drag file
  const props = {
    name: 'file',
    multiple: true,
    onChange(info: any) {
      const { status } = info.file
      const fileInput: HTMLInputElement | null = document.querySelector('input[name=mainImgInput]')
      if (status !== 'uploading') {
        //console.log(info.file, info.fileList)
        setMainImgFile(info.file)
        if (fileInput) fileInput.value = info.file.name
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e: any) {
      const fileInput: HTMLInputElement | null = document.querySelector('input[name=mainImgInput]')
      setMainImgFile(e.dataTransfer.files[0])
      if (fileInput) fileInput.value = e.dataTransfer.files[0].name
    },
  }

  const {
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useForm<AdCreateForm>({
    mode: 'onChange',
  })

  //라이브 삭제
  const adDelete = async () => {
    const { data } = await daleteAd({
      variables: {
        changeAdvertisementStatusInput: {
          _id: adData?.findAdvertisementById.advertisement?._id || '',
          advertiseStatus: AdvertiseStatus['Removed'],
        },
      },
    })

    if (!data?.changeAdvertisementStatus.ok) {
      const message =
        locale === 'ko'
          ? data?.changeAdvertisementStatus.error?.ko
          : data?.changeAdvertisementStatus.error?.en
      notification.error({
        message,
      })
      throw new Error(message)
    } else {
      notification.success({
        message: locale === 'ko' ? '삭제가 완료 되었습니다.' : 'Has been completed',
      })

      setTimeout(() => {
        window.location.href = '/ad/ads'
      }, 500)
    }
  }

  const linkTypeSelect = (linkType: string) => {
    setLinkTypeState(linkType)

    if (linkTypeFirstSet && adData?.findAdvertisementById.advertisement?.linkUrl) {
      setValue('linkUrl', adData?.findAdvertisementById.advertisement?.linkUrl)
      setLinkTypeFirstSet(false)
    } else {
      setValue('linkUrl', '')
    }
  }

  const onSubmit = async () => {
    try {
      const { displayType, title, linkType, displayDeviceType, linkUrl, startDate } = getValues()
      let mainImgFileName = '' //메인 썸네일
      const id = memberData?.my._id || ''
      //MainThumbnail upload
      if (mainImgFile && mainImgFile.originFileObj && mainImgFile.originFileObj instanceof File) {
        mainImgFileName = `${
          process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
        }/going/ad/${nowDateYYMMDD}/${id.toString()}_${nowDateStr}.png`
        process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
          (await S3.upload({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: mainImgFileName,
            Body: mainImgFile.originFileObj,
            ACL: 'public-read',
          }).promise())

        mainImgFileName = `${id.toString()}_${nowDateStr}.png`
      }
      const { data } = await editAd({
        variables: {
          editAdvertisementInput: {
            _id: adData?.findAdvertisementById.advertisement?._id,
            displayDeviceType: displayDeviceType,
            displayType: displayType,
            linkType: linkType,
            linkUrl,
            mainImageName:
              mainImgFileName === ''
                ? adData?.findAdvertisementById.advertisement?.mainImageName
                : mainImgFileName,
            title,
            startDate: startDate
              ? new Date(startDate[0]._d)
              : adData?.findAdvertisementById.advertisement?.startDate,
            endDate: startDate
              ? new Date(startDate[1]._d)
              : adData?.findAdvertisementById.advertisement?.endDate,
          },
        },
      })

      if (!data?.editAdvertisement.ok) {
        const message =
          locale === 'ko' ? data?.editAdvertisement.error?.ko : data?.editAdvertisement.error?.en
        notification.error({
          message,
        })
        throw new Error(message)
      } else {
        notification.success({
          message: locale === 'ko' ? '수정이 완료 되었습니다.' : 'Has been completed',
        })

        setTimeout(() => {
          location.reload()
        }, 500)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await getLives({
          variables: {
            livesInput: {},
          },
        })
        await getVods({
          variables: {
            vodsInput: {},
          },
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    getAd({
      variables: {
        findAdvertisementByIdInput: {
          _id: adId,
        },
      },
    })
    if (
      adData &&
      adData?.findAdvertisementById.advertisement &&
      adData?.findAdvertisementById.advertisement?.linkType
    ) {
      linkTypeSelect(adData?.findAdvertisementById.advertisement?.linkType)
      //setLinkUrlState(adData?.findAdvertisementById.advertisement?.linkUrl)
    }
  }, [adData])

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? 'AD 추가' : 'AD Create'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>AD</li>
            <li>{locale === 'ko' ? 'AD 추가' : 'AD Create'}</li>
          </ol>
        </div>
        <div className="main-content">
          <Edit className="card">
            <Form name="createAd">
              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '타입' : 'DisplayType'}</span>
                  <Controller
                    control={control}
                    name="displayType"
                    key={adData?.findAdvertisementById.advertisement?.displayType}
                    defaultValue={adData?.findAdvertisementById.advertisement?.displayType}
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
                          {Object.values(DisplayType).map((data, i) => {
                            return (
                              <Radio.Button value={data} key={i}>
                                {data}
                              </Radio.Button>
                            )
                          })}
                        </Radio.Group>
                      </>
                    )}
                  />
                </div>
                {errors.displayType?.message && (
                  <div className="form-message">
                    <span>{errors.displayType.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                  <Controller
                    control={control}
                    name="title"
                    key={adData?.findAdvertisementById.advertisement?.title}
                    defaultValue={adData?.findAdvertisementById.advertisement?.title}
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Input
                          className="input"
                          placeholder="Please enter the title."
                          value={value}
                          onChange={onChange}
                          maxLength={50}
                        />
                      </>
                    )}
                  />
                </div>
                {errors.title?.message && (
                  <div className="form-message">
                    <span>{errors.title.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '현재 메인 이미지' : 'Now MainImg Edit'}</span>
                  <Image
                    width={150}
                    src={`https://image.staby.co.kr/dev/going/ad/${
                      adData?.findAdvertisementById.advertisement?.mainImageName.split('_')[1]
                    }/${adData?.findAdvertisementById.advertisement?.mainImageName}`}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '메인 이미지 변경' : 'MainImg Edit'}</span>
                  <Controller
                    control={control}
                    name="mainImageName"
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Input
                          className="input"
                          id="mainImgInput"
                          type="hidden"
                          placeholder="Please enter the mainImageName."
                          value={value}
                          onChange={onChange}
                        />
                        <Dragger {...props} maxCount={1}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading
                            company data or other band files
                          </p>
                        </Dragger>
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? 'OS 타입' : 'DiviceType'}</span>
                  <Controller
                    control={control}
                    name="displayDeviceType"
                    key={adData?.findAdvertisementById.advertisement?.displayDeviceType}
                    defaultValue={adData?.findAdvertisementById.advertisement?.displayDeviceType}
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
                          {Object.values(DisplayDeviceType).map((data, i) => {
                            return (
                              <Radio.Button value={data} key={i} onChange={onChange}>
                                {data}
                              </Radio.Button>
                            )
                          })}
                        </Radio.Group>
                      </>
                    )}
                  />
                </div>
                {errors.displayDeviceType?.message && (
                  <div className="form-message">
                    <span>{errors.displayDeviceType.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '링크 타입' : 'LinkType'}</span>
                  <Controller
                    control={control}
                    name="linkType"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    key={adData?.findAdvertisementById.advertisement?.linkType}
                    defaultValue={adData?.findAdvertisementById.advertisement?.linkType}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
                          {Object.values(LinkType).map((data, i) => {
                            return (
                              <Radio.Button
                                value={data}
                                onChange={() => linkTypeSelect(data.toString())}
                                key={i}>
                                {data}
                              </Radio.Button>
                            )
                          })}
                        </Radio.Group>
                      </>
                    )}
                  />
                </div>
                {errors.linkType?.message && (
                  <div className="form-message">
                    <span>{errors.linkType.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '링크 Url' : 'LinkUrl'}</span>
                  <Controller
                    control={control}
                    name="linkUrl"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        {linkTypeState === 'VOD' ? (
                          <Select
                            value={value}
                            onChange={onChange}
                            placeholder="Please enter the vod">
                            {vodsData &&
                              vodsData?.vods &&
                              vodsData?.vods.vods &&
                              vodsData?.vods.vods.map((data, i) => {
                                return (
                                  <Select.Option value={data._id} key={i}>
                                    {data.title}
                                  </Select.Option>
                                )
                              })}
                          </Select>
                        ) : linkTypeState === 'LIVE' ? (
                          <Select
                            value={value}
                            onChange={onChange}
                            placeholder="Please enter the live">
                            {livesData &&
                              livesData?.lives &&
                              livesData?.lives.lives &&
                              livesData?.lives.lives.map((data, i) => {
                                return (
                                  <Select.Option value={data._id} key={i}>
                                    {data.title}
                                  </Select.Option>
                                )
                              })}
                          </Select>
                        ) : linkTypeState === 'WEB' ? (
                          <Input
                            className="input"
                            placeholder="Please enter the mainImageName."
                            onChange={onChange}
                            maxLength={50}
                          />
                        ) : null}
                      </>
                    )}
                  />
                </div>

                {errors.linkUrl?.message && (
                  <div className="form-message">
                    <span>{errors.linkUrl.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>{locale === 'ko' ? '노출날짜' : 'Date'}</span>
                  <Controller
                    control={control}
                    name="startDate"
                    key={adData?.findAdvertisementById.advertisement?.startDate}
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <RangePicker
                        disabledDate={(current) => current && current.valueOf() <= Date.now()}
                        key={adData?.findAdvertisementById.advertisement?.startDate}
                        defaultValue={[
                          moment(
                            DATE_FORMAT(
                              'YYYY-MM-DD',
                              adData?.findAdvertisementById.advertisement?.startDate
                            ),
                            'YYYY-MM-DD,HH:mm'
                          ),
                          moment(
                            DATE_FORMAT(
                              'YYYY-MM-DD',
                              adData?.findAdvertisementById.advertisement?.endDate
                            ),
                            'YYYY-MM-DD,HH:mm'
                          ),
                        ]}
                        showTime={{
                          defaultValue: [moment('00:00', 'HH:mm'), moment('00:00', 'HH:mm')],
                        }}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                {errors.linkUrl?.message && (
                  <div className="form-message">
                    <span>{errors.linkUrl.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="button-group">
                  <Button
                    type="primary"
                    role="button"
                    className="submit-button"
                    onClick={onSubmit}
                    loading={editLoading}>
                    {locale === 'ko' ? '추가' : 'create'}
                  </Button>
                  <Button
                    type="primary"
                    role="button"
                    htmlType="button"
                    className="submit-button"
                    loading={editLoading}
                    onClick={adDelete}
                    style={{ marginLeft: '10px' }}>
                    {locale === 'ko' ? '삭제' : 'Remove'}
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

export default AdDetail
