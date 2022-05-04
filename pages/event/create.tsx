import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { EventForm } from '.'
import { toast } from 'react-toastify'

/** styles */
import { Form, MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** components */
import Layout from '../../components/Layout'

/** graphql */
import { useMutation } from '@apollo/client'
import { CreateEventMutation, CreateEventMutationVariables } from '../../generated'
import { CREATE_EVENT_MUTATION } from '../../graphql/mutations'
import WriteEditor from '../../components/write/WriteEditor'
import { Button } from 'antd'

type Props = styleMode

/** Event 작성 폼 랜딩 페이지 */
const Create: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()
  const { handleSubmit } = useForm<EventForm>({ mode: 'onChange' })
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const onCompleted = (data: CreateEventMutation) => {
    const {
      createEvent: { ok },
    } = data

    if (ok) {
      toast.success(locale === 'ko' ? '등록되었습니다' : 'Is registered', {
        autoClose: 1000,
        theme: localStorage.theme || 'light',
        onClose: () => push('/event', '/event', { locale }),
      })
    }
  }
  const [createEvent] = useMutation<CreateEventMutation, CreateEventMutationVariables>(
    CREATE_EVENT_MUTATION,
    { onCompleted }
  )

  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  const onChangeContent = useCallback((content: string) => setContent(content), [content])
  const onSubmit = async () => {
    try {
      if (!title) return
      if (!content) return
      createEvent({
        variables: {
          createEventInput: {
            title,
            content,
          },
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper className="card">
        <div className="main-header">
          <h2>{locale === 'ko' ? '이벤트' : 'Event'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '안내' : 'News'}</li>
            <li>{locale === 'ko' ? '이벤트' : 'Event'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card">
            <div className="write-wrapper">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <WriteEditor
                  title={title}
                  content={content}
                  onChangeTitle={onChangeTitle}
                  onChangeContent={onChangeContent}
                />
                <div className="form-item">
                  <div className="button-group add-write">
                    <Button
                      type="primary"
                      role="button"
                      htmlType="submit"
                      className="submit-button">
                      {locale === 'ko' ? '등록하기' : 'Create'}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

export default Create
