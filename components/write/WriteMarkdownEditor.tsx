import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { Skeleton } from 'antd'
/** components */
import Title from './Title'
import Toolbar from './Toolbar'

/** lib */
import detectIOS from '../../lib/detectIOS'
import React, { createRef, useCallback, useRef, useState } from 'react'
import { md } from '../../styles/styles'

/** codemirror (codeFormat) */
import 'codemirror/lib/codemirror.css'
import { Controlled as CodeMirror } from 'react-codemirror2'
const EditorFormat = dynamic(
  () => {
    import('codemirror/mode/markdown/markdown' as any)
    import('codemirror/mode/javascript/javascript' as any)
    import('codemirror/mode/jsx/jsx' as any)
    import('codemirror/addon/display/placeholder' as any)
    return import('./EditorFormat')
  },
  { ssr: false, loading: () => <Skeleton active title={false} paragraph={{ rows: 10 }} /> }
)

export interface MarkdownEditorProps {
  title: string
  content: string
  onChangeTitle: (title: string) => void
  onChangeContent: (content: string) => void
}

const WriteMarkdownEditor: React.FC<MarkdownEditorProps> = ({
  title,
  content,
  onChangeTitle,
  onChangeContent,
}) => {
  const [hideUpper] = useState<boolean>(false)
  const toolbarElement = createRef<HTMLDivElement>()
  const editorElement = useRef<CodeMirror | null>(null)

  const isIOS = detectIOS()

  /** 제목 변경 이벤트 핸들러 */
  const handleTitleChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => onChangeTitle(value),
    [title]
  )

  /** toolbar 클릭 이벤트 핸들러 */
  const handleToolbarClick = (mode: string) => {
    if (!editorElement.current) return
    console.log(editorElement.current)
  }

  return (
    <>
      <div className="editor-container">
        <Title placeholder="제목을 입력하세요" value={title} onChange={handleTitleChange} />
        <HorizontalBar />
        <Toolbar
          shadow={hideUpper}
          mode="MARKDOWN"
          onClick={handleToolbarClick}
          onConvert={() => console.log('toolbar onConvert')}
          innerRef={toolbarElement}
          ios={isIOS}
        />
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

export default WriteMarkdownEditor
