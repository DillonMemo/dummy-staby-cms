import { useQuery } from '@apollo/client'
import { omit } from 'lodash'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Input, Segmented, Skeleton } from 'antd'
import { CSSProperties } from 'react'

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
} from '../../generated'
import { FIND_MEMBERS_BY_TYPE_QUERY, LIVE_QUERY } from '../../graphql/queries'

/** utils */
import { Edit, Form, MainWrapper, styleMode } from '../../styles/styles'
import { Controller, useForm } from 'react-hook-form'
import { LiveCreateForm } from './createLive'

type Props = styleMode

interface LiveEditForm extends LiveCreateForm {
  liveStatus: LiveStatus
}

const TestLiveDetail: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, reload, query, push } = useRouter()

  const {
    getValues,
    watch,
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
  })

  /**
   * 최종 저장 버튼 이벤트 핸들러
   */
  const onSubmit = async () => {
    console.log('submit', getValues())
  }

  console.log(memberData, liveData)
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
                          },
                          {
                            label: locale === 'ko' ? '준비' : LiveStatus.Display,
                            value: LiveStatus.Display,
                          },
                          {
                            label: locale === 'ko' ? '송출' : LiveStatus.Active,
                            value: LiveStatus.Active,
                          },
                          {
                            label: locale === 'ko' ? '종료' : LiveStatus.Finish,
                            value: LiveStatus.Finish,
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

export default TestLiveDetail
