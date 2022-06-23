import { NextPage } from 'next'
import { onDeleteBtn, Props } from '../../Common/commonFn'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Edit, Form, MainWrapper } from '../../styles/styles'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, notification, Select } from 'antd'
import { CREATE_MAIN_BANNER_LIVE_MUTATION } from '../../graphql/mutations'
import {
  CreateMainBannerLiveContentsMutation,
  CreateMainBannerLiveContentsMutationVariables,
  FindLiveByTypesQuery,
  FindLiveByTypesQueryVariables,
  LiveStatus,
  MainBannerLiveContentsQuery,
  MainBannerLiveContentsQueryVariables,
} from '../../generated'
import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { FIND_LIVD_BY_TYPES_QUERY, MAIN_BANNER_LIVE_CONTENTS_QUERY } from '../../graphql/queries'
import { omit } from 'lodash'
import ReactDragListView from 'react-drag-listview'
import Spinner from '../../components/Spinner'

export interface ContentsInfo {
  liveId: string
  title?: string | null
}

const Contents: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const [upLoading, setUploading] = useState(false) //스피너
  //라이브 Data
  const [getLives, { data: livesData }] = useLazyQuery<
    FindLiveByTypesQuery,
    FindLiveByTypesQueryVariables
  >(FIND_LIVD_BY_TYPES_QUERY)

  //contents mutation
  const [createContents] = useMutation<
    CreateMainBannerLiveContentsMutation,
    CreateMainBannerLiveContentsMutationVariables
  >(CREATE_MAIN_BANNER_LIVE_MUTATION)

  //contents queries
  const { data: contentsData } = useQuery<
    MainBannerLiveContentsQuery,
    MainBannerLiveContentsQueryVariables
  >(MAIN_BANNER_LIVE_CONTENTS_QUERY)

  const [contentsInfo, setContentsInfo] = useState<Array<ContentsInfo>>([])

  const onDragEnd = (fromIndex: any, toIndex: any) => {
    if (toIndex < 0) return // Ignores if outside designated area

    const items = [...contentsInfo]
    const item = items.splice(fromIndex, 1)[0]
    items.splice(toIndex, 0, item)

    setContentsInfo(items)
  }

  const {
    formState: { errors },
    control,
  } = useForm({
    mode: 'onChange',
  })

  const onSubmit = async () => {
    const mainBannerLive = []
    setUploading(true)

    for (let i = 0; i < contentsInfo.length; i++) {
      mainBannerLive.push({
        liveId: contentsInfo[i].liveId,
        listingOrder: i,
      })
    }

    const { data } = await createContents({
      variables: {
        createMainBannerLiveInput: { mainBannerLive },
      },
    })

    if (!data?.createMainBannerLiveContents.ok) {
      const message =
        locale === 'ko'
          ? data?.createMainBannerLiveContents.error?.ko
          : data?.createMainBannerLiveContents.error?.en
      notification.error({
        message,
      })
      throw new Error(message)
    } else {
      notification.success({
        message: locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed',
      })

      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await getLives({
          variables: {
            findLiveByTypesInput: {
              liveStatus: [LiveStatus['Display'], LiveStatus['Active'], LiveStatus['Finish']],
            },
          },
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (
      contentsData &&
      contentsData?.mainBannerLiveContents &&
      contentsData?.mainBannerLiveContents.mainBannerLives
    ) {
      const infoResult = contentsData?.mainBannerLiveContents.mainBannerLives.map((data) => {
        return omit(data, ['__typename', 'listingOrder'])
      }) //liveInfoArr result

      setContentsInfo(infoResult)
    }
  }, [contentsData])

  return (
    <>
      {upLoading && <Spinner />}
      <Layout toggleStyle={toggleStyle} theme={theme}>
        <MainWrapper>
          <div className="main-header">
            <h2>Contents</h2>
            <ol>
              <li>
                <Link href="/">
                  <a>{locale === 'ko' ? '홈' : 'Home'}</a>
                </Link>
              </li>
              <li>Contents</li>
              <li>{locale === 'ko' ? 'Contents 관리' : 'Contents Edit'}</li>
            </ol>
          </div>
          <div className="main-content">
            <Edit className="card">
              <Form>
                <div className="form-item">
                  <div className="form-group">
                    <span>Contents</span>
                    <Controller
                      control={control}
                      name="live"
                      render={({ field: { value } }) => (
                        <>
                          <Select
                            id="liveSelect"
                            value={value}
                            onChange={(value) => {
                              contentsInfo.length < 10 &&
                                setContentsInfo(
                                  contentsInfo.concat({
                                    liveId: value?.split('/')[0],
                                    title: value?.split('/')[1],
                                  })
                                )
                            }}
                            placeholder="라이브선택">
                            {livesData &&
                              livesData?.findLiveByTypes &&
                              livesData?.findLiveByTypes.lives?.map((data, index) => {
                                return (
                                  <Select.Option value={`${data._id}/${data.title}`} key={index}>
                                    {data.title}
                                  </Select.Option>
                                )
                              })}
                          </Select>
                        </>
                      )}
                    />
                  </div>

                  <div className="form-item">
                    <ReactDragListView nodeSelector=".contentsInfo" onDragEnd={onDragEnd}>
                      {contentsInfo.map((data, index) => {
                        return (
                          <div key={index} className="contentsInfo">
                            <div>
                              <em className="fontSize12 mrT5">{index + 1}</em>
                              <Button
                                className="delectBtn"
                                onClick={() => onDeleteBtn(index, setContentsInfo, contentsInfo)}>
                                삭제
                              </Button>
                            </div>

                            <Input
                              className="input"
                              name={`contents_${index}`}
                              value={data.title !== null ? data.title : data.liveId}
                              readOnly
                            />
                          </div>
                        )
                      })}
                    </ReactDragListView>
                  </div>
                  {errors.live?.message && (
                    <div className="form-message">
                      <span>{errors.live.message}</span>
                    </div>
                  )}
                  <div className="form-item mrT5">
                    <div className="button-group">
                      <Button
                        type="primary"
                        role="button"
                        onClick={onSubmit}
                        className="submit-button">
                        {locale === 'ko' ? '저장' : 'save'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </Edit>
          </div>
        </MainWrapper>
      </Layout>
    </>
  )
}

export default Contents
