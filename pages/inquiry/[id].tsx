import { pick } from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Skeleton } from 'antd'
import Parser from 'html-react-parser'
import styled from 'styled-components'
import { toast } from 'react-toastify'

/** components */
import Layout from '../../components/Layout'
import WriteEditor from '../../components/write/WriteEditor'

/** styles */
import { MainWrapper, ManagementWrapper, md, styleMode, xxxs } from '../../styles/styles'

/** graphql */
import { useMutation, useQuery } from '@apollo/client'
import {
  BoardStatus,
  CreateAnswerMutation,
  CreateAnswerMutationVariables,
  FindBoardByIdQuery,
  FindBoardByIdQueryVariables,
} from '../../generated'
import { FIND_BOARD_BY_ID_QUERY } from '../../graphql/queries'
import moment from 'moment'
import { CREATE_ANSWER_MUTATION } from '../../graphql/mutations'

type Props = styleMode

const InquiryDetail: NextPage<Props> = (props) => {
  const { push, locale, query } = useRouter()
  const boardId = query.id ? query.id.toString() : ''
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  /** 문의 정보를 가져오는 Query */
  const {
    data: boardData,
    refetch: refreshBoard,
    loading: isBoardLoading,
  } = useQuery<FindBoardByIdQuery, FindBoardByIdQueryVariables>(FIND_BOARD_BY_ID_QUERY, {
    variables: { boardInput: { boardId } },
  })
  /** 문의 답변하는 Mutation */
  const [createAnswer, { loading: isCreateAnswerLoading }] = useMutation<
    CreateAnswerMutation,
    CreateAnswerMutationVariables
  >(CREATE_ANSWER_MUTATION)

  /** 제목 변경 이벤트 핸들러 */
  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  /** 내용 변경 이벤트 핸들러 */
  const onChangeContent = useCallback((content: string) => setContent(content), [content])
  /** 문의 답변 클릭 이벤트 핸들러 */
  const onAnswer = async () => {
    try {
      const { data } = await createAnswer({
        variables: {
          createAnswerInput: {
            _id: boardId,
            answerInfo: {
              answer: content,
              createDate: new Date(),
            },
          },
        },
      })
      if (!data?.createAnswer.ok) {
        const message =
          locale === 'ko' ? data?.createAnswer.error?.ko : data?.createAnswer.error?.en

        toast.error(message, { theme: localStorage.theme || 'light' })
        throw new Error(message)
      } else {
        toast.success(locale === 'ko' ? '답변이 완료 되었습니다' : 'Answer has been completed', {
          theme: localStorage.theme || 'light',
        })

        setIsEdit(!isEdit)
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
        if (boardData.findBoardById.board.answerInfo) {
          setContent(boardData.findBoardById.board.answerInfo.answer)
        } else {
          setIsEdit(true)
        }
      }
    }
  }, [boardData])

  return (
    <Layout {...pick(props, ['toggleStyle', 'theme'])}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '문의' : 'Inquiry'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>
              <Link href="/inquiry">
                <a>{locale === 'ko' ? '문의' : 'Inquiry'}</a>
              </Link>
            </li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <Wrapper isEdit={isEdit}>
              {isBoardLoading ? (
                <Skeleton active title={false} paragraph={{ rows: 10 }} />
              ) : (
                <>
                  <div>
                    {boardData && boardData.findBoardById.board && (
                      <>
                        <div className="item">
                          <span>{locale === 'ko' ? '제목' : 'Title'}</span>
                          <p>{boardData.findBoardById.board.title}</p>
                        </div>
                        <div className="item">
                          <span>{locale === 'ko' ? '분류' : 'Group'}</span>
                          <p>
                            {locale === 'ko'
                              ? boardData.findBoardById.board.questionType === 'ETC'
                                ? '기타'
                                : boardData.findBoardById.board.questionType === 'EVENT'
                                ? '이벤트/혜택'
                                : boardData.findBoardById.board.questionType === 'PAYMENT'
                                ? '결제/취소/환불'
                                : boardData.findBoardById.board.questionType === 'PLAY'
                                ? '재생 및 사용오류'
                                : boardData.findBoardById.board.questionType === 'SERVICE'
                                ? '서비스 이용 문의'
                                : boardData.findBoardById.board.questionType
                              : boardData.findBoardById.board.questionType}
                          </p>
                        </div>
                        <div className="item">
                          <span>{locale === 'ko' ? '이메일' : 'Email'}</span>
                          <p>{boardData.findBoardById.board.createMember.email}</p>
                        </div>
                        <div className="item">
                          <span>{locale === 'ko' ? '접수일' : 'Receipt date'}</span>
                          <p>
                            {moment(boardData.findBoardById.board.createDate).format('YYYY.MM.DD')}
                          </p>
                        </div>
                        <div className="item">
                          <span>{locale === 'ko' ? '응답상태' : 'Response status'}</span>
                          <p>
                            {locale === 'ko'
                              ? boardData.findBoardById.board.boardStatus === 'WAIT'
                                ? '대기'
                                : boardData.findBoardById.board.boardStatus === 'COMPLETED'
                                ? '완료'
                                : boardData.findBoardById.board.boardStatus
                              : boardData.findBoardById.board.boardStatus}
                          </p>
                        </div>
                        <div className="item">
                          <span>{locale === 'ko' ? '내용' : 'Content'}</span>
                          <p>
                            {Parser(
                              boardData.findBoardById.board.content.replace(/\n/gi, '<br />')
                            )}
                          </p>
                        </div>
                        <div className="item image">
                          {boardData.findBoardById.board.uploadImageInfo &&
                            [...boardData.findBoardById.board.uploadImageInfo]
                              .sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((data, index) => {
                                const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
                                const date = data.uploadImageName.split('_')
                                return (
                                  <div key={index}>
                                    <img
                                      src={`https://image.staby.co.kr/${mode}/going/board/${date[2]}/${data.uploadImageName}`}
                                      alt={`${data.uploadImageName}`}
                                    />
                                  </div>
                                )
                              })}
                        </div>
                      </>
                    )}
                  </div>
                  <EditContainer>
                    {isEdit ? (
                      <>
                        <span>{locale === 'ko' ? '답변하기' : 'reply'}</span>
                        <WriteEditor
                          title={title}
                          content={content}
                          onChangeTitle={onChangeTitle}
                          onChangeContent={onChangeContent}
                          isTitleVisible={false}
                        />
                      </>
                    ) : (
                      <>
                        <span>{locale === 'ko' ? '답변' : 'answer'}</span>
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
                  isBoardLoading ? (
                    <Skeleton.Button active />
                  ) : (
                    <>
                      <Button
                        className="default-btn"
                        onClick={onAnswer}
                        loading={isCreateAnswerLoading}
                        disabled={!isEdit}>
                        {locale === 'ko' ? '답변완료' : 'Confirm'}
                      </Button>
                    </>
                  ),
                [isEdit, isBoardLoading, content, locale]
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
export const Wrapper = styled.div<CommonStyleProps>`
  padding: ${({ isEdit }) => (isEdit ? `0` : `1rem 3rem`)};

  ${md} {
    padding: 0;
  }
  .item {
    line-height: 1.25;
    & + * {
      margin-top: 0.75rem;
    }

    span {
      font-size: 0.875rem;

      ${md} {
        font-size: 0.75rem;
      }
    }
    p {
      font-size: 1.125rem;

      ${md} {
        font-size: 1rem;
      }
    }
    &.image {
      display: grid;
      grid-template-columns: repeat(auto-fill, 15rem);
      gap: 1rem;

      ${md} {
        grid-template-columns: repeat(auto-fill, 100%);
      }
      ${xxxs} {
        grid-template-columns: repeat(auto-fill, 13rem);
      }

      > div {
        display: inline-flex;
        justify-content: center;
        img {
          object-fit: contain;
          max-width: 100%;
          max-height: 15rem;

          ${md} {
            max-height: 20rem;
          }

          ${xxxs} {
            max-height: 13rem;
          }
        }
      }
    }
  }
`
const EditContainer = styled.div`
  min-width: 0;
  margin: 0;
  margin-top: 4rem;
  position: relative;

  > div > div {
    padding: 0 !important;
  }
`

const ButtonGroup = styled.div<CommonStyleProps>`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: ${({ isEdit }) => (isEdit ? `0` : `1.5rem 3rem`)};
`

export const ContentStyled = styled.div`
  word-break: break-all;

  font-size: 1.125rem;

  ${md} {
    font-size: 1rem;
  }
  image,
  img {
    max-width: 100%;
  }
`

export default InquiryDetail
