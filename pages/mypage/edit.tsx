import { NextPage } from 'next'
import styled from 'styled-components'

/** components */
import Layout from '../../components/Layout'

/** styles */
import { styleMode } from '../../styles/styles'

type Props = styleMode

const MypageEdit: NextPage<Props> = ({ toggleStyle, theme }) => {
  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <DivWrapper>
        <main className="main">
          <h2>Hello this edit page</h2>
        </main>
      </DivWrapper>
    </Layout>
  )
}

const DivWrapper = styled.div`
  min-height: 50vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;

  main {
    padding: 5rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

export default MypageEdit
