import { pick } from 'lodash'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Select } from 'antd'

/** components */
import { FaqForm } from '.'
import Layout from '../../components/Layout'

/** styles */
import { Form, MainWrapper, ManagementWrapper, styleMode } from '../../styles/styles'

/** graphql */
import { CreateFaqMutation, CreateFaqMutationVariables, FaqType } from '../../generated'
import { useMutation } from '@apollo/client'
import { CREATE_FAQ_MUTATION } from '../../graphql/mutations'
import WriteEditor from '../../components/write/WriteEditor'

type Props = styleMode

/** FAQ 작성 폼 랜딩페이지 */
const Create: NextPage<Props> = (props) => {
  const { locale, push } = useRouter()
  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<FaqForm>({ mode: 'onChange' })
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const onCompleted = (data: CreateFaqMutation) => {
    const {
      createFaq: { ok },
    } = data

    if (ok) {
      toast.success(locale === 'ko' ? '등록되었습니다' : 'Is registered', {
        autoClose: 1000,
        theme: localStorage.theme || 'light',
      })

      push('/faq', '/faq', { locale })
    }
  }
  const [createFaq] = useMutation<CreateFaqMutation, CreateFaqMutationVariables>(
    CREATE_FAQ_MUTATION,
    { onCompleted }
  )
  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  const onChangeContent = useCallback((content: string) => setContent(content), [content])
  const onSubmit = async () => {
    try {
      if (!title) return
      if (!content) return

      const { faqType } = getValues()
      createFaq({
        variables: {
          createFaqInput: {
            title,
            content,
            faqType,
          },
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout {...pick(props, ['toggleStyle', 'theme'])}>
      <MainWrapper className="card">
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
            <div className="write-wrapper">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-item">
                  <div className="form-group">
                    <Controller
                      name="faqType"
                      control={control}
                      rules={{
                        required: locale === 'ko' ? '분류는 필수 선택입니다' : 'Group is required',
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          onChange={onChange}
                          placeholder={locale === 'ko' ? '분류를 선택하세요' : 'Choose the group'}>
                          {Object.keys(FaqType).map((data, index) => (
                            <Select.Option value={data.toUpperCase()} key={`type-${index}`}>
                              {data}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.faqType?.message && (
                      <div className="form-message">
                        <span>{errors.faqType.message}</span>
                      </div>
                    )}
                  </div>
                </div>
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
