import React, { ReactNode, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Modal } from 'antd'

/** components */
import Header from './Header'
import Footer from './Footer'

/** styles */
import { styleMode } from '../styles/styles'

/** lib */
import { TITLE } from '../lib/constants'
import { isLoggedInVar } from '../lib/apolloClient'

/** utils */

interface Props extends styleMode {
  children?: ReactNode
  title?: string
  description?: string
  imageUrl?: string
}

const Layout = ({
  children,
  title = TITLE,
  description = '',
  imageUrl = '',
  toggleStyle,
  theme,
}: Props) => {
  const { locale, push } = useRouter()

  useEffect(() => {
    if (!isLoggedInVar()) {
      Modal.info({
        title: locale === 'ko' ? '로그인이 필요합니다.' : 'You need to login',
        okText: locale === 'ko' ? '로그인' : 'Login',
        onOk: () => push('/login', 'login', { locale }),
      })
    }
  }, [])
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        {/* content="article"은 기사, 뉴스소식, 블로그 게시물에 대한 설정 */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={`http://localhost:3000`} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta name="description" content={description} />
        <title>{title}</title>

        {/* 선호 URL */}
        <link rel="canonical" href="http://localhost:3000"></link>
      </Head>
      <>
        <Header toggleStyle={toggleStyle} theme={theme} />
        {children}
        <Footer />
      </>
    </>
  )
}

export default Layout
