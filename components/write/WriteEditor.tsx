import { Skeleton } from 'antd'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

/** lib */
import detectIOS from '../../lib/detectIOS'
import { md, opacityHex } from '../../styles/styles'

/** components */
import Title from './Title'
import Toolbar from './Toolbar'

/** Quill */
import 'react-quill/dist/quill.snow.css'
const Quill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <Skeleton title={false} paragraph={{ rows: 10 }} />,
})

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

  return (
    <>
      <div className="editor-container">
        <Title placeholder="제목을 입력하세요" value={title} onChange={handleTitleChange} />
        <HorizontalBar />
        <Toolbar shadow={hideUpper} ios={isIOS} />
        <QuillWrapper>
          <Quill theme="snow" modules={modules} placeholder="내용을 입력해주세요..." />
        </QuillWrapper>
        <button onClick={() => console.log('submit')}>제출</button>
      </div>
    </>
  )
}

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
      &.ql-blank::before {
        color: ${({ theme }) => `${theme.text}${opacityHex._40}`};
      }
    }
  }
`

export default WriteEditor
