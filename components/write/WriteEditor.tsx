import { Skeleton } from 'antd'
import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import Parser from 'html-react-parser'
import { find } from 'lodash'

/** lib */
import detectIOS from '../../lib/detectIOS'
import { md, opacityHex } from '../../styles/styles'

/** components */
import Title from './Title'
import Toolbar from './Toolbar'

/** Quill */
import 'react-quill/dist/quill.snow.css'
import { Delta } from 'quill'
import ReactQuill from 'react-quill'
const Quill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />
    }
  },
  {
    ssr: false,
    loading: () => <Skeleton title={false} paragraph={{ rows: 10 }} />,
  }
)
// const Quill = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <Skeleton title={false} paragraph={{ rows: 10 }} />,
// })

interface WriteEditorProps {
  title: string
  content: string
  onChangeTitle: (title: string) => void
  onChangeContent: (content: string) => void
}
const WriteEditor: React.FC<WriteEditorProps> = ({
  title,
  content,
  onChangeTitle,
  onChangeContent,
}) => {
  const quillRef = useRef<ReactQuill | null>(null)
  const [hideUpper] = useState<boolean>(false)
  const isIOS = detectIOS()
  const modules: { [key: string]: any } = {
    toolbar: {
      container: '#toolbar',
    },
  }

  /** 제목 변경 이벤트 핸들러 */
  const handleTitleChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => onChangeTitle(value),
    [title]
  )

  /** 내용 변경 이벤트 핸들러 */
  const handleContentChange = useCallback(
    (content: string, delta: Delta) => {
      const quill = quillRef.current

      if (quill) {
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
      }
      onChangeContent(content)
    },
    [content]
  )

  return (
    <Wrapper>
      <EditorContainer>
        <Title placeholder="제목을 입력하세요" value={title} onChange={handleTitleChange} />
        <HorizontalBar />
        <Toolbar shadow={hideUpper} ios={isIOS} />
        <QuillWrapper>
          <Quill
            forwardedRef={quillRef}
            theme="snow"
            modules={modules}
            placeholder="내용을 입력해주세요..."
            onChange={handleContentChange}
          />
        </QuillWrapper>
      </EditorContainer>
      <PreviewContainer className="preview-container">
        <div className="title">{title}</div>
        <div>{Parser(content)}</div>
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

  .title {
    font-weight: bold;
    font-size: 1.75rem;
    margin-bottom: 1.5rem;

    ${md} {
      font-size: 1.25rem;
    }
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

export default WriteEditor
