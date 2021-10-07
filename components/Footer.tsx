import styled from 'styled-components'
import { WIDTH } from '../lib/constants'
import { md } from '../styles/styles'

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <p>
        COPYRIGHT © 2022 <a href="https://www.staby.co.kr">Staby</a>, All rights Reserved
      </p>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.footer`
  display: flex;
  align-items: center;

  margin-left: ${WIDTH};
  min-height: ${WIDTH};
  padding: 0.8rem 2rem;

  position: relative;
  right: 0;

  p {
    color: ${({ theme }) => theme.text};
    margin: 0;
    line-height: 1;
  }

  ${md} {
    margin: 0;
  }
`

export default Footer
