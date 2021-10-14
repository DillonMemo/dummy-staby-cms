import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

/** components */
import Layout from '../components/Layout'

/** styles */
import { MainWrapper, md, styleMode } from '../styles/styles'

type Props = styleMode

const Home: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <ContentWrapper className="main-content">
          <div className="dashboard-section-1 gap">
            <div className="card" style={{ minHeight: '12.5rem' }}>
              {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
            </div>
            <div className="card" style={{ minHeight: '12.5rem' }}>
              {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
            </div>
          </div>
          <div className="dashboard-section-2 gap">
            <div className="grid grid-col-2 gap">
              <div className="card" style={{ minHeight: '10rem' }}>
                {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
              </div>
              <div className="card" style={{ minHeight: '10rem' }}>
                {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
              </div>
              <div className="card" style={{ gridColumn: '1/3', minHeight: '10rem' }}>
                {locale === 'ko' ? '준비중 입니다' : 'Comming soon'}
              </div>
            </div>
            <div className="card">{locale === 'ko' ? '준비중 입니다' : 'Comming soon'}</div>
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
  }

  .dashboard-section-1 {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-section-2 {
    grid-template-columns: 1fr 1fr;
  }

  .grid {
    display: grid;
  }

  .responsive-grid-col-2 {
    grid-template-columns: 1fr 1fr;

    ${md} {
      grid-template-columns: 1fr;
    }
  }

  .grid-col-2 {
    grid-template-columns: 1fr 1fr;
  }

  .gap {
    gap: 1.5rem;
  }
`

export default Home
