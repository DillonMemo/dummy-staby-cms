import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MainWrapper, styleMode } from '../../styles/styles'
import styled from 'styled-components'

/** components */
import Layout from '../../components/Layout'

type Props = styleMode

const Members: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>{locale === 'ko' ? '관리' : 'Management'}</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>{locale === 'ko' ? '회원' : 'Member'}</li>
            <li>{locale === 'ko' ? '관리' : 'Management'}</li>
          </ol>
        </div>
        <div className="main-content">
          <ManagementWrapper className="card"></ManagementWrapper>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const ManagementWrapper = styled.div`
  width: 100%;
  min-height: 2rem;
`

export default Members
