import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { Button, Skeleton } from 'antd'
import Parser from 'html-react-parser'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { MainWrapper, ManagementWrapper, md, styleMode } from '../../styles/styles'

/** graphql */
import { FIND_BOARD_BY_ID_QUERY } from '../../graphql/queries'
import { FindBoardByIdQuery, FindBoardByIdQueryVariables } from '../../generated'
import { ContentStyled, TitleStyled } from '../../components/write/WriteEditor'

type Props = styleMode
export interface NoticeEditForm {
  title: string
  content: string
}
const NoticeDetail: NextPage<Props> = (props) => {
  const { push, locale, query } = useRouter()
  const boardId = query.id ? query.id?.toString() : ''
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const {
    data: boardData,
    refetch: refreshBoard,
    loading: boardLoading,
  } = useQuery<FindBoardByIdQuery, FindBoardByIdQueryVariables>(FIND_BOARD_BY_ID_QUERY, {
    variables: { boardInput: { boardId } },
  })

  useEffect(() => {
    if (boardId) {
      refreshBoard()
    }
  }, [query])
  return (
    <Layout {...props}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '공지사항' : 'Notice'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>{locale === 'ko' ? '공지사항' : 'Notice'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <Wrapper isEdit={isEdit}>
              {boardLoading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
              ) : (
                <>
                  <ViewContainer>
                    <TitleStyled>{boardData?.findBoardById.board?.title}</TitleStyled>
                    <ContentStyled>
                      {Parser(boardData?.findBoardById.board?.content as string)}
                    </ContentStyled>
                  </ViewContainer>
                  <EditContainer>
                    {isEdit && (
                      <>
                        <h2>Hello Edit container</h2>
                        <h3>Description!!</h3>
                      </>
                    )}
                  </EditContainer>
                </>
              )}
            </Wrapper>
            <ButtonGroup isEdit={isEdit}>
              {useMemo(
                () =>
                  boardLoading ? (
                    <>
                      <Skeleton.Button active />
                      <Skeleton.Button active />
                    </>
                  ) : (
                    <>
                      <Button className="default-btn" onClick={() => setIsEdit(true)}>
                        {locale === 'ko' ? '수정' : 'Edit'}
                      </Button>
                      <Button className="default-btn" onClick={() => console.log('삭제1')}>
                        {locale === 'ko' ? '삭제' : 'Delete'}
                      </Button>
                    </>
                  ),
                [isEdit, boardLoading]
              )}
            </ButtonGroup>
          </ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const Wrapper = styled.div<{ isEdit: boolean }>`
  display: grid;
  grid-template-columns: ${({ isEdit }) => (isEdit ? `1fr 1fr` : `1fr`)};
  transition: 0.5s ease-in-out;
  position: relative;

  padding: ${({ isEdit }) => (isEdit ? `0` : `1rem 3rem`)};

  ${md} {
    padding: 0;
  }
`

const ButtonGroup = styled.div<{ isEdit: boolean }>`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: ${({ isEdit }) => (isEdit ? `0` : `1.5rem 3rem`)};
`

const ViewContainer = styled.div`
  min-width: 0;
  margin: 0;
  position: relative;
`

const EditContainer = styled.div`
  min-width: 0;
  margin: 0;
  position: relative;
`

export default NoticeDetail
