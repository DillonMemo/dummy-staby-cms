import Layout from '../../components/Layout'

import { NextPage } from 'next'
import Link from 'next/link'

import { nowDateStr, nowDateYYMMDD, Props } from '../../Common/commonFn'
import { Edit, Form, MainWrapper } from '../../styles/styles'
import { useRouter } from 'next/router'
import { Button, DatePicker, Input, message, notification, Radio, Select, Upload } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import moment from 'moment'
import { useEffect, useState } from 'react'

import {
  CREATE_ADVERTISEMENT_MUTATION,
  LIVES_MUTATION,
  VODS_MUTATION,
} from '../../graphql/mutations'
import { S3 } from '../../lib/awsClient'

import {
  CreateAdvertisementMutation,
  CreateAdvertisementMutationVariables,
  DisplayDeviceType,
  DisplayType,
  LinkType,
  LivesMutation,
  LivesMutationVariables,
  MyQuery,
  MyQueryVariables,
  VodsMutation,
  VodsMutationVariables,
} from '../../generated'
import { useMutation, useQuery } from '@apollo/client'
import { InboxOutlined } from '@ant-design/icons'
import { MY_QUERY } from '../../graphql/queries'

export interface AdCreateForm {
  displayType: DisplayType
  title: string
  mainImageName: string
  linkType: LinkType
  linkUrl: string
  displayDeviceType: DisplayDeviceType
  startDate: any
  endDate: Date
}

/**
 *
 * //handleSubmit Test 다시 해볼것
 */

const CreateAd: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const { RangePicker } = DatePicker
  const { Dragger } = Upload

  const [linkTypeState, setLinkTypeState] = useState('')
  const [mainImgFile, setMainImgFile] = useState<any>()

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

  const [createAd, { loading: createLoading }] = useMutation<
    CreateAdvertisementMutation,
    CreateAdvertisementMutationVariables
  >(CREATE_ADVERTISEMENT_MUTATION)

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
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AdCreateForm>({
    mode: 'onChange',
  })

  const linkTypeSelect = (linkType: string) => {
    setValue('linkUrl', '')
    setLinkTypeState(linkType)
  }

  const onSubmit = async () => {
    try {
      const { displayType, title, linkType, displayDeviceType, linkUrl, startDate } = getValues()

      let mainImgFileName = '' //메인 썸네일
      const id = memberData?.my._id || ''
      //MainThumbnail upload
      if (mainImgFile && mainImgFile.originFileObj && mainImgFile.originFileObj instanceof File) {
        mainImgFileName = `${
          process.env.NODE_ENV === 'development' ? 'dev' : 'dev'
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
      const { data } = await createAd({
        variables: {
          createAdvertisementInput: {
            displayDeviceType: displayDeviceType,
            displayType: displayType,
            linkType: linkType,
            linkUrl,
            mainImageName: mainImgFileName,
            title,
            startDate: new Date(startDate[0]._d),
            endDate: new Date(startDate[1]._d),
          },
        },
      })

      if (!data?.createAdvertisement.ok) {
        const message =
          locale === 'ko'
            ? data?.createAdvertisement.error?.ko
            : data?.createAdvertisement.error?.en
        notification.error({
          message,
        })
        throw new Error(message)
      } else {
        notification.success({
          message: locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed',
        })
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
      } catch (error) {
        console.error(error)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    const fetch = async () => {
      try {
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
            <Form name="createAd" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <div className="form-group">
                  <span>DisplayType</span>
                  <Controller
                    control={control}
                    name="displayType"
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
                  <span>Title</span>
                  <Controller
                    control={control}
                    name="title"
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
                  <span>MainImg</span>
                  <Controller
                    control={control}
                    name="mainImageName"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
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
                {errors.mainImageName?.message && (
                  <div className="form-message">
                    <span>{errors.mainImageName.message}</span>
                  </div>
                )}
              </div>

              <div className="form-item">
                <div className="form-group">
                  <span>DiviceType</span>
                  <Controller
                    control={control}
                    name="displayDeviceType"
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
                  <span>LinkType</span>
                  <Controller
                    control={control}
                    name="linkType"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
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
                  <span>LinkUrl</span>
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
                  <span>Estimated start date</span>
                  <Controller
                    control={control}
                    name="startDate"
                    rules={{
                      required: '위 항목은 필수 항목입니다.',
                    }}
                    render={({ field: { value, onChange } }) => (
                      <RangePicker
                        disabledDate={(current) => current && current.valueOf() <= Date.now()}
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
                    htmlType="submit"
                    className="submit-button"
                    loading={createLoading}>
                    {locale === 'ko' ? '추가' : 'create'}
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

export default CreateAd
