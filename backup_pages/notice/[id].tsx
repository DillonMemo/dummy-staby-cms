import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Skeleton } from 'antd'
import Parser from 'html-react-parser'
import { toast } from 'react-toastify'

/** components */
import Layout from '../../components/Layout'
import WriteEditor, { ContentStyled, TitleStyled } from '../../components/write/WriteEditor'

/** styles */
import { MainWrapper, ManagementWrapper, md, styleMode } from '../../styles/styles'

/** graphql */
import { FIND_BOARD_BY_ID_QUERY } from '../../graphql/queries'
// import {
//   BoardStatus,
//   DeleteBoardMutation,
//   DeleteBoardMutationVariables,
//   EditNoticeMutation,
//   EditNoticeMutationVariables,
//   FindBoardByIdQuery,
//   FindBoardByIdQueryVariables,
// } from '../../generated'
import { DELETE_BOARD_MUTATION, EDIT_NOTICE_MUTATION } from '../../graphql/mutations'
import { omit } from 'lodash'

type Props = styleMode

const NoticeDetail: NextPage<Props> = (props) => {
  const { push, locale, query } = useRouter()
  const boardId = query.id ? query.id?.toString() : ''
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  /** 공지사항 정보를 가져오는 Query */
  const {
    data: boardData,
    refetch: refreshBoard,
    loading: boardLoading,
  } = useQuery<FindBoardByIdQuery, FindBoardByIdQueryVariables>(FIND_BOARD_BY_ID_QUERY, {
    variables: { boardInput: { boardId } },
  })
  /** 공지사항 정보를 수정 하는 Mutation */
  const [editNotice, { loading: editLoading }] = useMutation<
    EditNoticeMutation,
    EditNoticeMutationVariables
  >(EDIT_NOTICE_MUTATION)
  /** 공지사항 정보를 삭제 하는 Mutation */
  const [deleteNotice, { loading: deleteLoading }] = useMutation<
    DeleteBoardMutation,
    DeleteBoardMutationVariables
  >(DELETE_BOARD_MUTATION)

  /** 제목 변경 이벤트 핸들러 */
  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  /** 내용 변경 이벤트 핸들러 */
  const onChangeContent = useCallback((content: string) => setContent(content), [content])
  /** 공지사항 저장 클릭 이벤트 핸들러 */
  const onSave = async () => {
    try {
      const { data } = await editNotice({
        variables: {
          editNoticeInput: {
            _id: boardId,
            ...(title !== '' && { title }),
            ...(content !== '' && { content }),
          },
        },
      })

      if (!data?.editNotice.ok) {
        const message = locale === 'ko' ? data?.editNotice.error?.ko : data?.editNotice.error?.en

        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '수정이 완료 되었습니다' : 'Modify has been completed', {
          theme: localStorage.theme || 'light',
        })

        setIsEdit(!isEdit)
      }
    } catch (error) {
      console.error(error)
    }
  }
  /** 공지사항 수정 클릭 이벤트 핸들러 */
  const onEdit = () => setIsEdit(!isEdit)
  /** 공지사항 삭제 클릭 이벤트 핸들러 */
  const onDelete = async () => {
    try {
      const { data } = await deleteNotice({
        variables: {
          deleteBoardInput: {
            boardId,
          },
        },
      })

      if (!data?.deleteBoard.ok) {
        const message = locale === 'ko' ? data?.deleteBoard.error?.ko : data?.deleteBoard.error?.en

        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        push('/notice', '/notice', { locale })
        toast.success(locale === 'ko' ? '삭제가 완료 되었습니다.' : 'Delete has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 1000,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (boardId) {
      refreshBoard()
    }
  }, [query, isEdit])
  useEffect(() => {
    if (boardData) {
      if (boardData.findBoardById.board) {
        if (boardData.findBoardById.board.boardStatus === BoardStatus.Delete) {
          toast(locale === 'ko' ? '삭제된 게시물 입니다.' : 'Deleted posts.', {
            theme: localStorage.theme || 'light',
            autoClose: 1000,
            onClose: () => push('/notice', '/notice', { locale }),
          })
        }
        setTitle(boardData.findBoardById.board.title)
        setContent(boardData.findBoardById.board.content)
      }
    }
  }, [boardData])
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
            <li>
              <Link
                href={{
                  pathname: '/notice',
                  query: { ...omit(query, 'id') },
                }}
                as={'/notice'}
                locale={locale}>
                <a>{locale === 'ko' ? '공지사항' : 'Notice'}</a>
              </Link>
            </li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <Wrapper isEdit={isEdit}>
              {boardLoading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
              ) : (
                <>
                  <EditContainer>
                    {isEdit ? (
                      <>
                        <WriteEditor
                          title={title}
                          content={content}
                          onChangeTitle={onChangeTitle}
                          onChangeContent={onChangeContent}
                        />
                      </>
                    ) : (
                      <>
                        <TitleStyled>{title}</TitleStyled>
                        <ContentStyled>{Parser(content)}</ContentStyled>
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
                  ) : isEdit ? (
                    <>
                      <Button
                        className="default-btn"
                        onClick={onSave}
                        loading={editLoading}
                        disabled={editLoading}>
                        {locale === 'ko' ? '저장' : 'Save'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="default-btn" onClick={onEdit} loading={deleteLoading}>
                        {locale === 'ko' ? '수정' : 'Edit'}
                      </Button>
                      <Button className="default-btn" onClick={onDelete} loading={deleteLoading}>
                        {locale === 'ko' ? '삭제' : 'Delete'}
                      </Button>
                    </>
                  ),
                [isEdit, boardLoading, title, content, locale]
              )}
            </ButtonGroup>
          </ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

type CommonStyleProps = {
  isEdit: boolean
}

const Wrapper = styled.div<CommonStyleProps>`
  position: relative;

  padding: ${({ isEdit }) => (isEdit ? `0` : `1rem 3rem`)};
  transition: 0.5s ease-in-out;

  ${md} {
    padding: 0;
  }
`

const ButtonGroup = styled.div<CommonStyleProps>`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: ${({ isEdit }) => (isEdit ? `0` : `1.5rem 3rem`)};
`

const EditContainer = styled.div`
  min-width: 0;
  margin: 0;
  position: relative;
`

export default NoticeDetail
