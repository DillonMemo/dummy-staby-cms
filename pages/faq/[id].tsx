import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { pick } from 'lodash'
import { useMutation, useQuery } from '@apollo/client'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import Parser from 'html-react-parser'
import { Controller, useForm } from 'react-hook-form'
import { FaqForm } from '.'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { Form, MainWrapper, ManagementWrapper, md, styleMode } from '../../styles/styles'

/** graphql */
import {
  BoardStatus,
  DeleteBoardMutation,
  DeleteBoardMutationVariables,
  EditFaqMutation,
  EditFaqMutationVariables,
  FaqType,
  FindBoardByIdQuery,
  FindBoardByIdQueryVariables,
} from '../../generated'
import { FIND_BOARD_BY_ID_QUERY } from '../../graphql/queries'
import { DELETE_BOARD_MUTATION, EDIT_FAQ_MUTATION } from '../../graphql/mutations'
import { Button, Select, Skeleton } from 'antd'
import WriteEditor, { ContentStyled, TitleStyled } from '../../components/write/WriteEditor'

type Props = styleMode

const FaqDetail: NextPage<Props> = (props) => {
  const { push, locale, query } = useRouter()
  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
    setValue,
  } = useForm<FaqForm>({ mode: 'onChange' })
  const boardId = query.id ? query.id?.toString() : ''
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  /** FAQ 정보를 가져오는 Query */
  const {
    data: boardData,
    refetch: refreshBoard,
    loading: isBoardLoading,
  } = useQuery<FindBoardByIdQuery, FindBoardByIdQueryVariables>(FIND_BOARD_BY_ID_QUERY, {
    variables: { boardInput: { boardId } },
  })
  /** FAQ 정보를 수정 하는 Mutation */
  const [editFaq, { loading: isEditLoading }] = useMutation<
    EditFaqMutation,
    EditFaqMutationVariables
  >(EDIT_FAQ_MUTATION)
  /** FAQ 정보를 삭제 하는 Mutation */
  const [deleteFaq, { loading: isDeleteLoading }] = useMutation<
    DeleteBoardMutation,
    DeleteBoardMutationVariables
  >(DELETE_BOARD_MUTATION)

  /** 제목 변경 이벤트 핸들러 */
  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  /** 내용 변경 이벤트 핸들러 */
  const onChangeContent = useCallback((content: string) => setContent(content), [content])
  /** FAQ 저장 클릭 이벤트 핸들러 */
  const onSave = async () => {
    try {
      if (!title) return
      if (!content) return
      const { faqType } = getValues()

      const { data } = await editFaq({
        variables: {
          editFaqInput: {
            _id: boardId,
            ...(title !== '' && { title }),
            ...(content !== '' && { content }),
            faqType,
          },
        },
      })

      if (!data?.editFaq.ok) {
        const message = locale === 'ko' ? data?.editFaq.error?.ko : data?.editFaq.error?.en

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
  /** FAQ 수정 클릭 이벤트 핸들러 */
  const onEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsEdit(!isEdit)
  }
  /** FAQ 삭제 클릭 이벤트 핸들러 */
  const onDelete = async () => {
    try {
      const { data } = await deleteFaq({
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
        push('/faq', '/faq', { locale })
        toast.success(locale === 'ko' ? '삭제가 완료 되었습니다.' : 'Delete has been completed', {
          theme: localStorage.theme || 'light',
          autoClose: 1000,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderingLocale = () => {
    const renderFaqType =
      locale === 'ko'
        ? boardData?.findBoardById.board?.faqType === 'CONTENT'
          ? '콘텐츠'
          : boardData?.findBoardById.board?.faqType === 'PAYMENT'
          ? '결제/환불'
          : boardData?.findBoardById.board?.faqType === 'ETC'
          ? '기타'
          : boardData?.findBoardById.board?.faqType
        : boardData?.findBoardById.board?.faqType

    return { renderFaqType }
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
        setValue('faqType', boardData.findBoardById.board.faqType as FaqType)
      }
    }
  }, [boardData])

  return (
    <Layout {...pick(props, ['toggleStyle', 'theme'])}>
      <MainWrapper>
        <div className="main-header">
          <h2>FAQ</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>FAQ</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <Form className="write-wrapper" onSubmit={handleSubmit(onSave)}>
              <Wrapper isEdit={isEdit}>
                {isBoardLoading ? (
                  <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                  <>
                    <EditContainer>
                      {isEdit ? (
                        <>
                          {boardData && boardData.findBoardById.board && (
                            <div className="form-item">
                              <div className="form-group">
                                <Controller
                                  name="faqType"
                                  control={control}
                                  rules={{
                                    required:
                                      locale === 'ko'
                                        ? '분류는 필수 선택입니다'
                                        : 'Group is required',
                                  }}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <Select
                                        value={value}
                                        onChange={onChange}
                                        placeholder={
                                          locale === 'ko' ? '분류를 선택하세요' : 'Choose the group'
                                        }>
                                        {Object.keys(FaqType).map((data, index) => (
                                          <Select.Option
                                            value={data.toUpperCase()}
                                            key={`type-${index}`}>
                                            {data}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </>
                                  )}
                                />
                                {errors.faqType?.message && (
                                  <div className="form-message">
                                    <span>{errors.faqType.message}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          <WriteEditor
                            title={title}
                            content={content}
                            onChangeTitle={onChangeTitle}
                            onChangeContent={onChangeContent}
                          />
                        </>
                      ) : (
                        <div className="preview">
                          <div className="faqType">{renderingLocale().renderFaqType}</div>
                          <TitleStyled>{title}</TitleStyled>
                          <ContentStyled>{Parser(content)}</ContentStyled>
                        </div>
                      )}
                    </EditContainer>
                  </>
                )}
              </Wrapper>
              <ButtonGroup isEdit={isEdit}>
                {useMemo(
                  () =>
                    isBoardLoading ? (
                      <>
                        <Skeleton.Button active />
                        <Skeleton.Button active />
                      </>
                    ) : isEdit ? (
                      <>
                        <Button
                          className="default-btn"
                          role="button"
                          htmlType="submit"
                          loading={isEditLoading}
                          disabled={isEditLoading}>
                          {locale === 'ko' ? '저장' : 'Save'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="default-btn"
                          role="button"
                          htmlType="button"
                          onClick={onEdit}
                          loading={isDeleteLoading}>
                          {locale === 'ko' ? '수정' : 'Edit'}
                        </Button>
                        <Button
                          className="default-btn"
                          role="button"
                          htmlType="button"
                          onClick={onDelete}
                          loading={isDeleteLoading}>
                          {locale === 'ko' ? '삭제' : 'Delete'}
                        </Button>
                      </>
                    ),
                  [isEdit, isBoardLoading, title, content, boardData, locale]
                )}
              </ButtonGroup>
            </Form>
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

  .preview {
    > * {
      margin-bottom: 1rem;

      &:not(:last-child) {
        padding-bottom: 1rem;
        border-bottom: 1px solid ${({ theme }) => theme.border};
      }
    }

    .faqType {
      font-size: 1.125rem;

      ${md} {
        font-size: 1rem;
      }
    }
  }
`

export default FaqDetail
