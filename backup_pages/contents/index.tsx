import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useState } from 'react'
import { Button, Select, Skeleton } from 'antd'
import styled from 'styled-components'
import { toast } from 'react-toastify'

/** graphql */
import {
  CreateMainBannerLiveContentsMutation,
  CreateMainBannerLiveContentsMutationVariables,
  FindLiveByTypesQuery,
  FindLiveByTypesQueryVariables,
  LiveStatus,
  MainBannerLiveContentsQuery,
  MainBannerLiveContentsQueryVariables,
} from '../../generated'
import { FIND_LIVE_BY_TYPES_QUERY, MAIN_BANNER_LIVE_CONTENTS_QUERY } from '../../graphql/queries'
import { CREATE_MAIN_BANNER_LIVE_MUTATION } from '../../graphql/mutations'

/** components */
import Layout from '../../components/Layout'
import Drag, { ItemType } from '../../components/Drag'

/** utils */
import { getError, Props } from '../../Common/commonFn'
import { MainWrapper, md } from '../../styles/styles'

const TestContents: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload } = useRouter()
  const [items, setItems] = useState<ItemType[]>([])
  const [selectLive, setSelectLiveValue] = useState<ItemType>()
  const { data: livesData } = useQuery<FindLiveByTypesQuery, FindLiveByTypesQueryVariables>(
    FIND_LIVE_BY_TYPES_QUERY,
    {
      variables: {
        findLiveByTypesInput: {
          liveStatus: [LiveStatus.Display, LiveStatus.Active, LiveStatus.Finish],
        },
      },
    }
  )
  const { loading: isContentsLoading } = useQuery<
    MainBannerLiveContentsQuery,
    MainBannerLiveContentsQueryVariables
  >(MAIN_BANNER_LIVE_CONTENTS_QUERY, {
    onCompleted: (data) => {
      const value = data.mainBannerLiveContents.mainBannerLives?.map(({ title, liveId }) => ({
        content: title || '',
        id: liveId,
      }))

      value && setItems(value)
    },
  })
  const [createContents, { loading: isCreateContentsLoading }] = useMutation<
    CreateMainBannerLiveContentsMutation,
    CreateMainBannerLiveContentsMutationVariables
  >(CREATE_MAIN_BANNER_LIVE_MUTATION)

  /**
   * ????????? ?????? ????????? ????????? ?????????.
   */
  const onAdd = async () => {
    try {
      if (items.length >= 10)
        throw new Error(
          locale === 'ko'
            ? '?????? 10????????? ????????? ????????? ???????????????.'
            : 'You can register up to 10 contents.'
        )
      if (!selectLive)
        throw new Error(locale === 'ko' ? '????????? ???????????? ????????????' : 'No live has been selected')
      const isFind = items.findIndex((item) => item.id === selectLive.id)
      if (isFind != -1) {
        throw new Error(
          locale === 'ko' ? '?????? ????????? ????????? ?????????' : "It's already content registered"
        )
      }
      const values = [selectLive, ...items].map((item, index) => ({
        liveId: item.id,
        listingOrder: index,
      }))

      const { data } = await createContents({
        variables: {
          createMainBannerLiveInput: { mainBannerLive: values },
        },
      })

      if (data?.createMainBannerLiveContents.ok) {
        reload()
      }
    } catch (error) {
      getError(error)
    }
  }

  /**
   * ?????????????????? ?????? ????????? ???????????? ????????? ????????? ?????????.
   * @param {DropResult} result
   */
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result
    if (!destination) {
      return
    }
    const { index: startIndex } = source
    const { index: endIndex } = destination

    const value = Array.from(items)
    const [removed] = value.splice(startIndex, 1)
    value.splice(endIndex, 0, removed)

    setItems(value)
  }

  /**
   * ?????? ?????? ?????? ????????? ?????????
   */
  const onSubmit = async () => {
    try {
      const result = items.map((item, index) => ({
        liveId: item.id,
        listingOrder: index,
      }))

      const { data } = await createContents({
        variables: {
          createMainBannerLiveInput: { mainBannerLive: result },
        },
      })

      if (data?.createMainBannerLiveContents.ok) {
        toast.success(locale === 'ko' ? '????????? ?????? ???????????????' : 'Has been add completed', {
          theme: localStorage.theme || 'light',
          autoClose: 750,
          onClose: () => reload(),
        })
      } else {
        const message =
          locale === 'ko'
            ? data?.createMainBannerLiveContents.error?.ko
            : data?.createMainBannerLiveContents.error?.en
        throw new Error(message)
      }
    } catch (error) {
      getError(error)
    }
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>Contents</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '???' : 'Home'}</a>
              </Link>
            </li>
            <li>Contents</li>
            <li>{locale === 'ko' ? 'Contents ??????' : 'Contents Edit'}</li>
          </ol>
        </div>
        <div className="main-content">
          <div className="card">
            {isContentsLoading ? (
              <>
                <Skeleton
                  active
                  title={{ width: '100%', style: { height: '2rem' } }}
                  paragraph={{ rows: 0 }}
                />
                <Skeleton active title={false} paragraph={{ rows: 10 }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Skeleton.Button active size="large" shape="square" />
                </div>
              </>
            ) : (
              <>
                <Options>
                  <div className="group">
                    <span>Contents</span>
                    <div className="row">
                      <Select
                        placeholder={locale === 'ko' ? '????????? ??????' : 'Choose live'}
                        onChange={(value: string) => {
                          const result = livesData?.findLiveByTypes.lives.find(
                            (live) => live._id === value
                          )

                          result && setSelectLiveValue({ id: result._id, content: result.title })
                        }}
                        loading={isCreateContentsLoading}>
                        {livesData?.findLiveByTypes.lives.map((data, index) => (
                          <Select.Option value={data._id} key={index}>
                            {data.title}
                          </Select.Option>
                        ))}
                      </Select>
                      <Button
                        type="primary"
                        role="button"
                        onClick={onAdd}
                        loading={isCreateContentsLoading}>
                        {locale === 'ko' ? '??????' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </Options>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Drag items={items} onChange={(items) => setItems(items)} />
                </DragDropContext>
                <SubmitWrapper className="mt-1">
                  <div className="button-group">
                    <Button
                      type="primary"
                      role="button"
                      className="submit-button"
                      onClick={onSubmit}
                      loading={isCreateContentsLoading}>
                      {locale === 'ko' ? '??????' : 'save'}
                    </Button>
                  </div>
                </SubmitWrapper>
              </>
            )}
          </div>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const Options = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 1rem;

  .group {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;

    .ant-select-selector {
      min-height: 2.5rem;
      align-items: center;
      background-color: ${({ theme }) => theme.card};
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.border};
    }

    .row {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      > *:nth-child(1) {
        flex: 80%;

        ${md} {
          flex: 60%;
        }
      }
      > *:nth-child(2) {
        flex: 1;
        height: 100%;
      }
    }
  }
`

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  .submit-button {
    padding: 0.786rem 1.5rem;
    border: 1px solid transparent;
    box-shadow: none;
    min-height: 2.714rem;

    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`

export default TestContents
