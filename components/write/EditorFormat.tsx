import React from 'react'
import styled from 'styled-components'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { md, opacityHex } from '../../styles/styles'

interface props {
  content: any
  onBeforeChange: (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => void
  onChange: (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => void
  innerRef: React.RefObject<CodeMirror>
}
const EditorFormat: React.FC<props> = ({ content, onBeforeChange, onChange, innerRef }) => {
  //   /** editor 변경 전 이벤트 핸들러 */
  //   const handleCodeMirrorBeforeChange = useCallback(
  //     (_editor: CodeMirror.Editor, _data: CodeMirror.EditorChange, value: string): void =>
  //       onChangeContent(value),
  //     [content]
  //   )

  //   const handleCodeMirrorChange = (
  //     editor: CodeMirror.Editor,
  //     _data: CodeMirror.EditorChange,
  //     _value: string
  //   ): void => {
  //     const doc = editor.getDoc()
  //     const { line } = doc.getCursor()
  //     const last = doc.lastLine()

  //     if (last - line < 5) {
  //       const preview = document.getElementById('preview')
  //       if (!preview) return
  //       preview.scrollTop = preview.scrollHeight
  //     }
  //   }
  return (
    <CodeMirrorWrapper
      ref={innerRef}
      value={content}
      onBeforeChange={onBeforeChange}
      onChange={onChange}
      options={{
        mode: 'markdown',
        theme: 'one-light',
        lineNumbers: false,
        lineWrapping: true,
        ...({ placeholder: '내용을 적어보세요...' } as any),
      }}
    />
  )
}

const CodeMirrorWrapper = styled(CodeMirror)`
  .CodeMirror {
    min-height: 0;
    height: auto;
    flex: 1;
    font-size: 1.125rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.card};
    font-family: 'Montserrat', 'Noto Sans KR', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    ${md} {
      font-size: 1rem;
    }

    .CodeMirror-lines {
      padding: 4px 0;
      padding-bottom: 3rem;

      *::selection {
        background: red !important;
      }
    }
    .CodeMirror-cursors {
      .CodeMirror-cursor {
        border-right: 1px solid ${({ theme }) => theme.text};
      }
    }
    .CodeMirror-selected {
      background: ${({ theme }) => `${theme.text}${opacityHex._30}`};
    }
    .CodeMirror-placeholder {
      color: ${({ theme }) => `${theme.text}${opacityHex._40}`};
      font-style: italic;
    }
  }
`

export default EditorFormat
