import styled from 'styled-components'
import TextareaAutosize from 'react-textarea-autosize'
import { md, opacityHex } from '../../styles/styles'

const Title = styled(TextareaAutosize)`
  display: block;
  padding: 0;
  font-size: 1.75rem;
  width: 100%;
  resize: none;
  line-height: 1.5;
  outline: none;
  border: none;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  background: transparent;

  ${md} {
    font-size: 1.25rem;
  }

  &::placeholder {
    color: ${({ theme }) => `${theme.text}${opacityHex._40}!important`};
  }
`

export default Title
