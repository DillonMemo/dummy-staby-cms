import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { ToggleStyle } from '../styles/styles';

interface Props extends ToggleStyle {
  children?: ReactNode;
  title?: string;
  description?: string;
  imageUrl?: string;
}

const Layout = ({
  children,
  title = 'Staby CMS',
  description = '',
  imageUrl = '',
  toggleStyle,
}: Props) => {
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
      <Header toggleStyle={toggleStyle} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
