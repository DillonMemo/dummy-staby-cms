import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'antd'
import { NoticeForm } from '.'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { Form, MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'
import WriteEditor from '../../components/write/WriteEditor'
import { useMutation } from '@apollo/client'
import { CreateNoticeMutation, CreateNoticeMutationVariables } from '../../generated'
import { CREATE_NOTICE_MUTATION } from '../../graphql/mutations'

type Props = styleMode

/** News 작성 폼 랜딩페이지 */
const Create: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale, push } = useRouter()
  const { handleSubmit } = useForm<NoticeForm>({ mode: 'onChange' })
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const onCompleted = (data: CreateNoticeMutation) => {
    const {
      createNotice: { ok },
    } = data

    if (ok) {
      push('/notice', '/notice', { locale })
    }
  }
  const [createNotice] = useMutation<CreateNoticeMutation, CreateNoticeMutationVariables>(
    CREATE_NOTICE_MUTATION,
    {
      onCompleted,
    }
  )

  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  const onChangeContent = useCallback((content: string) => setContent(content), [content])
  const onSubmit = async () => {
    try {
      if (!title) return
      if (!content) return
      createNotice({
        variables: {
          createNoticeInput: {
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
