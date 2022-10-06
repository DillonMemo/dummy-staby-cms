import { useMutation, useQuery } from '@apollo/client'
import { Badge, Button, Drawer, Skeleton, Switch, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

/** graphql */
// import {
//   ChannelStatusMutation,
//   ChannelStatusMutationVariables,
//   EditChannelMutation,
//   EditChannelMutationVariables,
//   FindLiveByIdQuery,
//   FindLiveByIdQueryVariables,
//   LiveChannelsQuery,
//   LiveChannelsQueryVariables,
//   LiveLinkInfo,
// } from '../../generated'
import { CHANNEL_STATUS_MUTATION, EDIT_CHANNEL_MUTATION } from '../../graphql/mutations'
import { LIVE_CHANNELS, LIVE_QUERY } from '../../graphql/queries'

/** utils */
import { getError } from '../../Common/commonFn'
import { LiveInfo } from '../../pages/live/createLive'
import styled from 'styled-components'
import { ReloadOutlined } from '@ant-design/icons'

export interface StateProps {
  id?: string
  title?: string
  isVisible: boolean
}
interface Props extends StateProps {
  onClose: (params: StateProps) => void
}

type EditLiveInfo = LiveInfo & { loading: boolean }

const Channel: React.FC<Props> = ({ id, title, isVisible, onClose }) => {
  const { locale } = useRouter()

  const [liveInfo, setLiveInfo] = useState<EditLiveInfo[]>([])

  /** live 조회 */
  const { data: liveData, loading: isLiveLoading } = useQuery<
    FindLiveByIdQuery,
    FindLiveByIdQueryVariables
  >(LIVE_QUERY, {
    variables: {
      liveInput: {
        liveId: id || '',
      },
    },
  })

  /** 채널 상태 조회 */
  const [channelsStatus, { loading: isChannelStatusLoading }] = useMutation<
    ChannelStatusMutation,
    ChannelStatusMutationVariables
  >(CHANNEL_STATUS_MUTATION, { fetchPolicy: 'network-only' })

  /** 모든 채널 조회 */
  const { data: liveChannelsData, loading: isChannelLoading } = useQuery<
    LiveChannelsQuery,
    LiveChannelsQueryVariables
  >(LIVE_CHANNELS)

  /** 채널 상태 변경 */
  const [editChannel, { loading: isEditChannelLoading }] = useMutation<
    EditChannelMutation,
    EditChannelMutationVariables
  >(EDIT_CHANNEL_MUTATION)

  /** switch 변경 이벤트 핸들러 */
  const onChangeSwitch = useCallback(
    (index: number) => async (checked: boolean) => {
      try {
        setLiveInfo((prev) => [
          ...prev.slice(0, index),
          { ...prev[index], loading: true },
          ...prev.slice(index + 1, prev.length),
        ])
        const channelId = liveInfo[index].linkPath
        if (channelId) {
          const { data } = await editChannel({
            variables: {
              editChannelInput: {
                checked,
                channelId,
              },
            },
          })

          if (data?.editChannel.ok) {
            setLiveInfo((prev) => [
              ...prev.slice(0, index),
              { ...prev[index], loading: false, checked, code: checked ? 'deploying' : 'stopping' },
              ...prev.slice(index + 1, prev.length),
            ])
          } else {
            const message =
              locale === 'ko' ? data?.editChannel.error?.ko : data?.editChannel.error?.en
            throw new Error(message)
          }
        }
      } catch (error) {
        getError(error)
        onReloadClick()
      }
    },
    [liveInfo]
  )

  /** 전체 채널 일괄 변경 이벤트 핸들러 */
  const onChangeAllSwitch = useCallback(
    async (checked: boolean) => {
      try {
        const filterLiveInfo = liveInfo.reduce((calc, compare) => {
          if (calc.length > 0) {
            return calc.findIndex((d) => d.linkPath === compare.linkPath) !== -1
              ? calc
              : [...calc, compare]
          } else {
            return [...calc, compare]
          }
        }, [] as EditLiveInfo[])

        for (const info of filterLiveInfo) {
          info.loading = true
        }
        const response: EditLiveInfo[] = await Promise.all(
          filterLiveInfo.map(async ({ listingOrder, linkPath, code, checked: infoChecked }) => {
            if (typeof linkPath === 'string') {
              if (checked !== infoChecked) {
                const { data } = await editChannel({
                  variables: {
                    editChannelInput: {
                      channelId: linkPath,
                      checked,
                    },
                  },
                })

                if (!data?.editChannel.ok) {
                  const message =
                    locale === 'ko' ? data?.editChannel.error?.ko : data?.editChannel.error?.en
                  throw new Error(message)
                } else {
                  return {
                    listingOrder,
                    linkPath,
                    checked,
                    code: checked ? 'deploying' : 'stopping',
                    loading: false,
                  }
                }
              } else {
                return {
                  listingOrder,
                  linkPath,
                  checked,
                  code,
                  loading: false,
                }
              }
            } else {
              throw new Error(
                `일부 라이브 채널의 채널 ID가 존재 하지 않습니다. (채널 ID : ${linkPath})`
              )
            }
          })
        )

        setLiveInfo(response)
      } catch (error) {
        getError(error)
        onReloadClick()
      }
    },
    [liveInfo]
  )

  const onReloadClick = useCallback(async () => {
    try {
      const response: EditLiveInfo[] = await Promise.all(
        liveInfo.map(async ({ listingOrder, linkPath }) => {
          if (typeof linkPath === 'string') {
            const { data } = await channelsStatus({
              variables: {
                channelStatusInput: {
                  channelId: linkPath,
                },
              },
            })

            if (!data?.channelStatus.ok) {
              const message =
                locale === 'ko' ? data?.channelStatus.error?.ko : data?.channelStatus.error?.en
              throw new Error(message)
            } else {
              return {
                listingOrder,
                linkPath,
                checked: !(
                  data.channelStatus.code === 'stopped' || data.channelStatus.code === 'stopping'
                ),
                code: data.channelStatus.code || 'unauthorized',
                loading: false,
              }
            }
          } else {
            throw new Error(
              `일부 라이브 채널의 채널 ID가 존재 하지 않습니다. (채널 ID : ${linkPath})`
            )
          }
        })
      )

      setLiveInfo(response)
    } catch (error) {
      getError(error)
    }
  }, [liveInfo])

  useEffect(() => {
    const fetch = async (liveInfo: LiveLinkInfo[]) => {
      try {
        const response: EditLiveInfo[] = await Promise.all(
          liveInfo.map(async ({ listingOrder, linkPath }) => {
            if (typeof linkPath === 'string') {
              const { data } = await channelsStatus({
                variables: {
                  channelStatusInput: {
                    channelId: linkPath,
                  },
                },
              })

              if (!data?.channelStatus.ok) {
                const message =
                  locale === 'ko' ? data?.channelStatus.error?.ko : data?.channelStatus.error?.en
                throw new Error(message)
              } else {
                return {
                  listingOrder,
                  linkPath,
                  checked: !(
                    data.channelStatus.code === 'stopped' || data.channelStatus.code === 'stopping'
                  ),
                  code: data.channelStatus.code || 'unauthorized',
                  loading: false,
                }
              }
            } else {
              throw new Error('일부 라이브 채널의 채널 ID가 존재 하지 않습니다.')
            }
          })
        )

        setLiveInfo(response)
      } catch (error) {
        getError(error)
      }
    }

    if (!isLiveLoading && id && isVisible) {
      if (liveData?.findLiveById.ok) {
        const liveInfo = liveData.findLiveById.live?.liveLinkInfo
        if (liveInfo) fetch(liveInfo)
      }
    }

    return () => setLiveInfo([])
  }, [isLiveLoading, id, isVisible])

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={() => onClose({ id, title, isVisible: !isVisible })}
      visible={isVisible}
      mask
      maskClosable={false}>
      {!isLiveLoading && !isChannelLoading && !isChannelStatusLoading ? (
        <>
          {liveInfo.length > 0 && (
            <Tool
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tooltip title={<small>Reload</small>} placement="right">
                <Button onClick={onReloadClick} icon={<ReloadOutlined className="" />} />
              </Tooltip>
              <Tooltip title={<small>{locale === 'ko' ? '전체' : 'All'}</small>} placement="left">
                <Switch
                  checked={liveInfo.findIndex((info) => !info.checked) === -1}
                  onChange={onChangeAllSwitch}
                  loading={
                    isEditChannelLoading || liveInfo.findIndex((info) => info.loading) !== -1
                  }
                />
              </Tooltip>
            </Tool>
          )}
          {liveInfo
            .reduce((calc, compare) => {
              if (calc.length > 0) {
                return calc.findIndex((d) => d.linkPath === compare.linkPath) !== -1
                  ? calc
                  : [...calc, compare]
              } else {
                return [...calc, compare]
              }
            }, [] as EditLiveInfo[])
            .map((info, index) => (
              <Container key={`ch-${index}`} className="mt-half">
                <div>
                  <Tooltip title={<small>{info.code}</small>} placement="left">
                    <Badge
                      className="channel-status no-title"
                      {...(info.code === 'stopped'
                        ? { status: 'error' }
                        : info.code === 'playing'
                        ? { status: 'processing' }
                        : info.code === 'waiting'
                        ? { status: 'success' }
                        : { status: 'warning' })}
                      style={{ cursor: 'help' }}
                    />
                  </Tooltip>
                </div>
                <div>
                  <small>CH {index + 1}</small>
                </div>
                <div>
                  {
                    liveChannelsData?.liveChannels.liveChannels?.find(
                      (channel) => channel.channelId === info.linkPath
                    )?.name
                  }
                </div>
                <div>
                  <Switch
                    checked={info.checked}
                    onChange={onChangeSwitch(index)}
                    loading={info.loading}
                  />
                </div>
              </Container>
            ))}
        </>
      ) : (
        <div>
          <Skeleton active title paragraph={false} />
          <Skeleton className="mt-half" active title paragraph={false} />
          <Skeleton className="mt-half" active title paragraph={false} />
          <Skeleton className="mt-half" active title paragraph={false} />
          <Skeleton className="mt-half" active title paragraph={false} />
          <Skeleton className="mt-half" active title paragraph={false} />
          <Skeleton className="mt-half" active title paragraph={false} />
          <Skeleton className="mt-half" active title paragraph={false} />
        </div>
      )}
    </Drawer>
  )
}

const Tool = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-btn-icon-only {
    width: 1.3rem;
    height: 1.3rem;
    &:hover,
    &:focus {
      transition: transform 0.5s ease-in-out;
      transform: rotate(180deg);
    }
  }
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 2fr 1fr;

  & + & {
    margin-top: 0.5rem;
  }

  > div:last-child {
    justify-self: end;
  }
`

export default Channel
