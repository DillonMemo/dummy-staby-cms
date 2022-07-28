import { Skeleton } from 'antd'
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Parser from 'html-react-parser'
import { find } from 'lodash'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

/** lib */
import detectIOS from '../../lib/detectIOS'
import { md, opacityHex } from '../../styles/styles'
import { S3 } from '../../lib/awsClient'

/** components */
import Title from './Title'
import Toolbar from './Toolbar'

/** Quill */
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import { Delta } from 'quill'

/** Apollo */
import { MyQuery } from '../../generated'
import { MY_QUERY } from '../../graphql/queries'
import { DATE_FORMAT } from '../../Common/commonFn'

// const Quill = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <Skeleton title={false} paragraph={{ rows: 10 }} />,
// })
const Quill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    return function comp({ forwardedRef, ...props }: { [key: string]: any }) {
      return <RQ ref={forwardedRef} {...props} />
    }
  },
  { ssr: false, loading: () => <Skeleton active title={false} paragraph={{ rows: 15 }} /> }
)

interface WriteEditorProps {
  title: string
  content: string
  onChangeTitle: (title: string) => void
  onChangeContent: (content: string) => void
  isTitleVisible?: boolean
}
const WriteEditor: React.FC<WriteEditorProps> = ({
  title,
  content,
  onChangeTitle,
  onChangeContent,
  isTitleVisible = true,
}) => {
  const { locale } = useRouter()
  const [hideUpper] = useState<boolean>(false)
  const isIOS = detectIOS()
  const quillRef = useRef<ReactQuill>()
  const { loading, data: myData } = useQuery<MyQuery>(MY_QUERY)

  // Text Editor image 툴바 클릭 이벤트 핸들러
  const onImageHandler = () => {
    const input = document.createElement('input')

    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    document.body.appendChild(input)

    input.click()

    input.onchange = async () => {
      const file = (input.files as FileList).item(0)
      if (!file) return alert('선택한 파일이 없습니다')

      const saveFileName =
        process.env.NODE_ENV === 'development'
          ? `dev/going/editor/${DATE_FORMAT('YYYYMMDD')}/${myData?.my._id}_${DATE_FORMAT(
              'ALL'
            )}.jpg`
          : `prod/going/editor/${DATE_FORMAT('YYYYMMDD')}/${myData?.my._id}_${DATE_FORMAT(
              'ALL'
            )}.jpg`

      const result =
        process.env.NEXT_PUBLIC_AWS_BUCKET_NAME &&
        (await S3.upload({
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: saveFileName,
          Body: file,
          ACL: 'public-read',
        }).promise())

      if (result && quillRef.current) {
        const range = quillRef.current.getEditor().getSelection()
        if (range) {
          quillRef.current.getEditor().insertEmbed(range.index, 'image', result.Location)
          quillRef.current.getEditor().setSelection(range)

          document.body.querySelector(':scope > input')?.remove()
        }
      } else {
        return alert('이미지 업로드중 문제가 발생했습니다.')
      }
    }
  }

  // useMemo를 사용한 이유는 modules가 렌더링마다 변하면 에디터에서 입력이 끊기는 버그가 발생
  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolbar',
        handlers: {
          image: onImageHandler,
        },
      },
    }),
    [myData]
  )

  /** 제목 변경 이벤트 핸들러 */
  const handleTitleChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeTitle(target.value)
      target.onkeydown = (e) => {
        if (e.key === 'Tab') {
          e.preventDefault()
          quillRef.current?.focus()
        }
      }
    },
    [title]
  )

  /** 내용 변경 이벤트 핸들러 */
  const handleContentChange = useCallback(
    (content: string, delta: Delta) => {
      const findAttr = find(delta.ops, 'attributes')
      if (findAttr) {
        const findLink = find(findAttr, 'link')?.link
        // const isInternet = new RegExp(/\b(?:https?|ftp):\/\//gim)
        if (findLink) {
          // 링크 툴을 이용할때 [https://, http://] 프로토콜체크후 강제 변환 시킵니다.
          content = content.replace(/\b(href="https:\/\/)/gim, 'href="')
          content = content.replace(/\b(href="http:\/\/)/gim, 'href="')
          content = content.replace(/\b(href=")/gim, 'href="https://')
        }
      }
      onChangeContent(content)
    },
    [content]
  )

  return (
    <Wrapper>
      <EditorContainer>
        {isTitleVisible && (
          <>
            <Title
              placeholder={locale === 'ko' ? '제목을 입력하세요' : 'Enter the title'}
              value={title}
              onChange={handleTitleChange}
            />
            <HorizontalBar />
          </>
        )}
        <Toolbar shadow={hideUpper} ios={isIOS} />
        {!loading && (
          <QuillWrapper>
            <Quill
              forwardedRef={quillRef}
              className="editor"
              theme="snow"
              modules={modules}
              placeholder={locale === 'ko' ? '내용을 입력해주세요...' : 'Enter the content...'}
              onChange={handleContentChange}
              value={content || ''}
            />
          </QuillWrapper>
        )}
      </EditorContainer>
      <PreviewContainer className="preview-container">
        {loading ? (
          <Skeleton active paragraph={{ rows: 20 }} />
        ) : (
          <>
            <TitleStyled>{title}</TitleStyled>
            <ContentStyled>{Parser(content)}</ContentStyled>
          </>
        )}
      </PreviewContainer>
    </Wrapper>
  )
}
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  ${md} {
    grid-template-columns: 1fr;
  }
`
const EditorContainer = styled.div`
  min-width: 0px;
  padding: 1.5rem;
  margin: 0;
  position: relative;

  ${md} {
    padding: 0;
  }
`

const PreviewContainer = styled.div`
  padding: 1.5rem;

  ${md} {
    display: none;
  }

  a {
    text-decoration: underline;
    color: #06c;
  }
`

const HorizontalBar = styled.div`
  background: ${({ theme }) => theme.border};
  height: 2px;
  width: 4rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  ${md} {
    margin-top: 1rem;
    margin-bottom: 0.66rem;
  }
  border-radius: 1px;
`

const QuillWrapper = styled.div`
  .quill {
    .ql-container.ql-snow {
      border: none !important;
      font-size: 1rem;
    }
    .ql-editor {
      padding: 0.75rem 0.5rem;
      font-family: 'Montserrat', 'Noto Sans KR', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      user-select: text;
      -webkit-user-select: text;
      &.ql-blank::before {
        color: ${({ theme }) => `${theme.text}${opacityHex._40}`};
      }
    }
    .ql-tooltip {
      background-color: ${({ theme }) => theme.card};
      color: ${({ theme }) => theme.text};
      box-shadow: ${({ theme }) => `0px 0px 5px ${theme.card}`};
      border: ${({ theme }) => `1px solid ${theme.text}${opacityHex._40}`};
      z-index: 1000;

      input {
        outline: none;
        border: 0;
        background-color: ${({ theme }) => theme.body};
      }

      a {
        color: ${({ theme }) => theme.text};

        &:hover {
          color: #06c;
        }
      }
    }
  }
`

export const TitleStyled = styled.div`
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  white-space: pre-line;

  word-break: break-word;
  line-height: 1.25;

  ${md} {
    font-size: 1.5rem;
  }
`

export const ContentStyled = styled.div`
  word-break: break-all;
  image,
  img {
    max-width: 100%;
  }
`

export default WriteEditor
