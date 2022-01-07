import type { NextPage } from 'next'
// import { useReactisveVar } from '@apollo/client'
import styled from 'styled-components'
import Layout from '../components/Layout'
import { MainWrapper, md, styleMode } from '../styles/styles'
import React, { useCallback, useState } from 'react'
// import { authTokenVar } from '../lib/apolloClient'

/** components */
import WriteEditor from '../components/write/WriteEditor'

type Props = styleMode

const Test: NextPage<Props> = ({ toggleStyle, theme }) => {
  // const getData = useReactiveVar(authTokenVar)
  // console.log(getData)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  const onChangeContent = useCallback((content: string) => setContent(content), [content])

  const onSubmit = () => {
    //  console.log('submit', { title, content })
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        {/* <QuillWrapper modules={modules} formats={formats} theme="snow" /> */}
        <ContentWrapper className="main-content">
          <div className="card write-wrapper">
            <WriteEditor
              title={title}
              content={content}
              onChangeTitle={onChangeTitle}
              onChangeContent={onChangeContent}
            />
            <div className="button-wrapper">
              <button type="button" onClick={onSubmit}>
                제출
              </button>
            </div>
          </div>
        </ContentWrapper>
      </MainWrapper>
    </Layout>
  )
}

const ContentWrapper = styled.div`
  display: grid;
  gap: 1.5rem;

  > div {
    .button-wrapper {
      display: flex;
      justify-content: flex-start;
      padding: 0 1.5rem;

      ${md} {
        padding: 0;
        justify-content: flex-end;
      }

      button {
        width: 100%;
        max-width: 5rem;
      }
    }
  }
`
export default Test
