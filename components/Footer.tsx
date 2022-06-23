import styled from 'styled-components'
import { WIDTH } from '../lib/constants'
import { lg, md } from '../styles/styles'
import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <p>
        COPYRIGHT © 2022{' '}
        <Link href="https://www.staby.co.kr">
          <a>Staby</a>
        </Link>
        , All rights Reserved
      </p>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.footer`
  display: flex;
  align-items: center;

  position: relative;
  right: 0;

  background-color: ${({ theme }) => theme.body};

  /* margin-left: ${WIDTH}; */
  margin-left: 16rem;
  min-height: ${WIDTH};
  padding: 0.8rem 2rem;
  ${lg} {
    margin-left: ${WIDTH};
  }

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
