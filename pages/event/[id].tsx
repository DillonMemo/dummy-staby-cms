import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { pick } from 'lodash'
import { Button, Skeleton } from 'antd'
import Parser from 'html-react-parser'

/** components */
import Layout from '../../components/Layout'
import WriteEditor, { ContentStyled, TitleStyled } from '../../components/write/WriteEditor'

/** styles */
import { MainWrapper, ManagementWrapper, md, styleMode } from '../../styles/styles'

/** graphql */
import {
  BoardStatus,
  DeleteBoardMutation,
  DeleteBoardMutationVariables,
  EditEventMutation,
  EditEventMutationVariables,
  FindBoardByIdQuery,
  FindBoardByIdQueryVariables,
} from '../../generated'
import { FIND_BOARD_BY_ID_QUERY } from '../../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { DELETE_BOARD_MUTATION, EDIT_EVENT_MUTATION } from '../../graphql/mutations'

type Props = styleMode

const EventDetail: NextPage<Props> = (props) => {
  const { push, locale, query } = useRouter()
  const boardId = query.id ? query.id?.toString() : ''
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  /** 이벤트 정보를 가져오는 Query */
  const {
    data: boardData,
    refetch: refreshBoard,
    loading: boardLoading,
  } = useQuery<FindBoardByIdQuery, FindBoardByIdQueryVariables>(FIND_BOARD_BY_ID_QUERY, {
    variables: { boardInput: { boardId } },
  })
  /** 이벤트 정보를 수정 하는 Mutation */
  const [editEvent, { loading: editLoading }] = useMutation<
    EditEventMutation,
    EditEventMutationVariables
  >(EDIT_EVENT_MUTATION)
  /** 이벤트 정보를 삭제 하는 Mutation */
  const [deleteEvent, { loading: deleteLoading }] = useMutation<
    DeleteBoardMutation,
    DeleteBoardMutationVariables
  >(DELETE_BOARD_MUTATION)

  /** 제목 변경 이벤트 핸들러 */
  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  /** 내용 변경 이벤트 핸들러 */
  const onChangeContent = useCallback((content: string) => setContent(content), [content])
  /** 이벤트 저장 클릭 이벤트 핸들러 */
  const onSave = async () => {
    try {
      const { data } = await editEvent({
        variables: {
          editEventInput: {
            _id: boardId,
            ...(title !== '' && { title }),
            ...(content !== '' && { content }),
          },
        },
      })

      if (!data?.editEvent.ok) {
        const message = locale === 'ko' ? data?.editEvent.error?.ko : data?.editEvent.error?.en

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
  /** 이벤트 수정 클릭 이벤트 핸들러 */
  const onEdit = () => setIsEdit(!isEdit)
  /** 이벤트 삭제 클릭 이벤트 핸들러 */
  const onDelete = async () => {
    try {
      const { data } = await deleteEvent({
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
        push('/event', '/event', { locale })
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
            onClose: () => push('/event', '/event', { locale }),
          })
        }
        setTitle(boardData.findBoardById.board.title)
        setContent(boardData.findBoardById.board.content)
      }
    }
  }, [boardData])

  return (
    <Layout {...pick(props, ['toggleStyle', 'theme'])}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '이벤트' : 'Event'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>
              <Link href="/event">
                <a>{locale === 'ko' ? '이벤트' : 'Event'}</a>
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

export default EventDetail
