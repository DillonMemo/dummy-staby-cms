import type { NextPage } from 'next'
import { useReactiveVar } from '@apollo/client'
import styled from 'styled-components'
import Layout from '../components/Layout'
import { MainWrapper, md, styleMode } from '../styles/styles'
import React, { useCallback, useState } from 'react'
import { authTokenVar } from '../lib/apolloClient'

/** components */
import WriteEditor from '../components/write/WriteEditor'

type Props = styleMode

const Test: NextPage<Props> = ({ toggleStyle, theme }) => {
  const getData = useReactiveVar(authTokenVar)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  console.log(getData)

  const onChangeTitle = useCallback((title: string) => setTitle(title), [title])
  const onChangeContent = useCallback((content: string) => setContent(content), [content])

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
    display: grid;
    ${md} {
      grid-template-columns: 1fr !important;
    }

    &.write-wrapper {
      display: grid;
      /* grid-template-columns: 1fr 1fr; */
      grid-template-columns: 1fr;
      gap: 2rem;

      ${md} {
        grid-template-columns: 1fr;
      }

      .editor-container {
        min-width: 0px;
        padding: 1.5rem;
        margin: 0;
        position: relative;

        ${md} {
          padding: 0;
        }
      }
    }
  }
`
export default Test
