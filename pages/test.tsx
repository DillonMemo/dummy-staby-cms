import type { NextPage } from 'next'
import { useReactiveVar } from '@apollo/client'
import styled from 'styled-components'
import Layout from '../components/Layout'
import { styleMode } from '../styles/styles'
import React, { useState } from 'react'
import { authTokenVar } from '../lib/apolloClient'
import { Button, Space, Upload } from 'antd'

type Props = styleMode

const Test: NextPage<Props> = ({ toggleStyle, theme }) => {
  const [file, setFile] = useState<any>()
  const getData = useReactiveVar(authTokenVar)

  const onSubmit = async () => {
    try {
      const formData = new FormData()
      const params = {
        id: 'testID', // string > Live ID
        paths: ['1', '2'], // string[] > 채널 링크
      }
      formData.append('json', JSON.stringify(params))
      // 이미지 파일이 여러개면 formData를 여러번 선언 해야 합니다.
      /**
       * example:
       * for (const file of files) {
       *  console.log(file)
       *  // do something...
       * }
       */
      formData.append('files', file)
      formData.append('files', file)
      // const request =
      await (
        await fetch('http://localhost:4000/uploads/live', {
          method: 'POST',
          body: formData,
        })
      ).json()
      // console.log(request)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <DivWrapper>
        <main className="main">
          <p>{getData || '토큰이 존재 하지 않습니다.'}</p>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Upload
              accept="image/*"
              multiple={false}
              onChange={(data) => setFile(data.file.originFileObj)}
              showUploadList={false}>
              <Button>Upload</Button>
            </Upload>
          </Space>
          <Button type="primary" onClick={onSubmit}>
            Submit
          </Button>
          <p>{file ? 'true' : 'false'}</p>
        </main>
      </DivWrapper>
    </Layout>
  )
}

const DivWrapper = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  main {
    padding: 5rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .grid {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 800px;
    margin-top: 3rem;
  }

  .card {
    margin: 1rem;
    padding: 1.5rem;
    text-align: left;
    color: inherit;
    text-decoration: none;
    border: ${({ theme }) => `1px solid ${theme.text}`};
    border-radius: 10px;
    transition: color 0.15s ease, border-color 0.15s ease;
    width: 45%;
  }

  .card:hover,
  .card:focus,
  .card:active {
    color: #0070f3;
    border-color: #0070f3;
  }

  .card h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .card p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }

  .logo {
    height: 1em;
    margin-left: 0.5rem;
  }

  @media (max-width: 600px) {
    .grid {
      width: 100%;
      flex-direction: column;
    }
  }
`
export default Test
