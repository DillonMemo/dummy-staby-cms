import styled from 'styled-components'

const Shadow: React.FC = () => {
  return <ShadowWrapper></ShadowWrapper>
}

const ShadowWrapper = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'linear-gradient(180deg,rgba(40,48,70,.65) 44%,rgba(40,48,70,.43) 73%,rgba(40,48,70,0))'
      : 'linear-gradient(180deg,hsla(0,0%,85.3%,.65) 44%,hsla(0,0%,85.3%,.46) 73%,hsla(0,0%,88%,0))'};
  padding-top: 2.2rem;
  display: block;
  width: 100%;
  height: 6.375rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
`

export default Shadow
