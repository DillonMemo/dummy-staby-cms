import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Button, Select, Skeleton } from 'antd'
import { pick } from 'lodash'
import ReactDragListView from 'react-drag-listview'
import { toast } from 'react-toastify'

/** graphql */
import { FIND_LIVD_BY_TYPES_QUERY, MAIN_BANNER_LIVE_CONTENTS_QUERY } from '../../graphql/queries'
import { CREATE_MAIN_BANNER_LIVE_MUTATION } from '../../graphql/mutations'
import {
  CreateMainBannerLiveContentsMutation,
  CreateMainBannerLiveContentsMutationVariables,
  FindLiveByTypesQuery,
  FindLiveByTypesQueryVariables,
  LiveStatus,
  MainBannerLive,
  MainBannerLiveContentsQuery,
  MainBannerLiveContentsQueryVariables,
} from '../../generated'

/** components */
import Layout from '../../components/Layout'

/** utils */
import { onDeleteBtn, Props } from '../../Common/commonFn'

/** styles */
import { Edit, MainWrapper } from '../../styles/styles'

export interface ContentsInfo {
  liveId: string
  title: string
}

const Contents: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload } = useRouter()
  //라이브 Data
  const { data: livesData, loading: isLivesLoading } = useQuery<
    FindLiveByTypesQuery,
    FindLiveByTypesQueryVariables
  >(FIND_LIVD_BY_TYPES_QUERY, {
    variables: {
      findLiveByTypesInput: {
        liveStatus: [LiveStatus.Display, LiveStatus.Active, LiveStatus.Finish],
      },
    },
  })

  //contents queries
  const { data: contentsData, loading: isContentsLoading } = useQuery<
    MainBannerLiveContentsQuery,
    MainBannerLiveContentsQueryVariables
  >(MAIN_BANNER_LIVE_CONTENTS_QUERY)

  //contents mutation
  const [createContents, { loading: isCreateContentsLoading }] = useMutation<
    CreateMainBannerLiveContentsMutation,
    CreateMainBannerLiveContentsMutationVariables
  >(CREATE_MAIN_BANNER_LIVE_MUTATION)

  const [contentsInfo, setContentsInfo] = useState<Pick<MainBannerLive, 'title' | 'liveId'>[]>([])

  const onDragEnd = (fromIndex: any, toIndex: any) => {
    if (toIndex < 0) return // Ignores if outside designated area

    const items = [...contentsInfo]
    const item = items.splice(fromIndex, 1)[0]
    items.splice(toIndex, 0, item)

    setContentsInfo(items)
  }

  const onSubmit = async () => {
    try {
      const mainBannerLive = []
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

        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '추가가 완료 되었습니다.' : 'Has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 1000,
          onClose: () => reload(),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (
      contentsData &&
      contentsData?.mainBannerLiveContents &&
      contentsData?.mainBannerLiveContents.mainBannerLives
    ) {
      const infoResult: Pick<MainBannerLive, 'title' | 'liveId'>[] =
        contentsData?.mainBannerLiveContents.mainBannerLives.map((data) => {
          return pick(data, ['title', 'liveId'])
        }) //liveInfoArr result

      setContentsInfo(infoResult)
    }
  }, [contentsData])

  return (
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
            <div className="form-item">
              <div className="form-group">
                {isLivesLoading && isContentsLoading ? (
                  <Skeleton.Button active style={{ width: '100%', minHeight: '3rem' }} />
                ) : (
                  <>
                    <span>Contents</span>
                    <Select
                      id="liveSelect"
                      onChange={(value: string) =>
                        contentsInfo.length < 10 &&
                        setContentsInfo(
                          contentsInfo.concat({
                            liveId: value?.split('/')[0],
                            title: value?.split('/')[1],
                          })
                        )
                      }
                      placeholder={locale === 'ko' ? '라이브 선택' : 'Choose live'}>
                      {livesData?.findLiveByTypes.lives.map((data, index) => (
                        <Select.Option value={`${data._id}/${data.title}`} key={index}>
                          {data.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </>
                )}
              </div>
            </div>

            <div className="form-item">
              {isLivesLoading && isContentsLoading && !contentsData ? (
                <div style={{ marginTop: '1rem' }}>
                  <Skeleton active title={false} paragraph={{ rows: 10 }} />
                </div>
              ) : (
                <>
                  <ReactDragListView
                    nodeSelector=".contentsInfo"
                    handleSelector=".contentsInfo"
                    onDragEnd={onDragEnd}
                    lineClassName="global-drag-line">
                    {contentsInfo.map((data, index) => {
                      return (
                        <ContentsInfo key={index} className="contentsInfo">
                          <div className="content" key={`contents_${index}`}>
                            <div>{data.title ? data.title : data.liveId}</div>
                            <div>
                              <Button
                                className="deleteBtn"
                                onClick={() => onDeleteBtn(index, setContentsInfo, contentsInfo)}>
                                &#10006;
                              </Button>
                            </div>
                          </div>
                        </ContentsInfo>
                      )
                    })}
                  </ReactDragListView>
                </>
              )}
            </div>
            <div className="form-item mrT5">
              <div className="button-group">
                <Button
                  type="primary"
                  role="button"
                  onClick={onSubmit}
                  className="submit-button"
                  loading={isCreateContentsLoading}>
                  {locale === 'ko' ? '저장' : 'save'}
                </Button>
              </div>
            </div>
          </Edit>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const ContentsInfo = styled.div`
  cursor: pointer;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.body};
  border-radius: 0.428rem;

  .content {
    width: 100%;
    display: inline-flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
  }
`

export default Contents
