import { useRef } from 'react'
import styled from 'styled-components'
import { md } from '../../styles/styles'

interface ToolbarProps {
  shadow: boolean
  ios?: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({ shadow, ios }) => {
  const innerRef = useRef<HTMLDivElement>(null)
  console.log(ios)

  return (
    <ToolbarWrapper id="toolbar" shadow={shadow} ref={innerRef}>
      <ToolbarItem className="ql-header" value={1}></ToolbarItem>
      <ToolbarItem className="ql-header" value={2}></ToolbarItem>
      <ToolbarItem className="ql-header" value={3}></ToolbarItem>
      <ToolbarItem className="ql-header" value={4}></ToolbarItem>
      <Separator />
      <ToolbarItem className="ql-bold"></ToolbarItem>
      <ToolbarItem className="ql-italic"></ToolbarItem>
    </ToolbarWrapper>
  )
}

const ToolbarWrapper = styled.div<{ shadow: boolean }>`
  width: 100%;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.card};
  transition: all 0.125s ease-in;

  position: relative;
  border: none !important;
  padding: 0 !important;

  ${(props) =>
    props.shadow &&
    `
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    margin-bottom: 0;
  `}
`

const ToolbarItem = styled.button`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  flex-shrink: 0;

  ${md} {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.45rem;
  }

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.body};
  }

  background: none;
  outline: none;
  border: none;
  padding: 0;

  .heading {
    font-size: 1rem;
    font-weight: bold;
    font-family: serif;
    span {
      font-size: 0.75rem;
    }
  }

  .ql-stroke {
    stroke: ${({ theme }) => theme.text};
  }
  &.ql-header {
    &[value='1'] {
      > svg {
        display: none;
      }
      &:after {
        clear: both;
        content: 'H1';
        display: table;
        font-weight: 500;
        margin-top: -2px;
        margin-left: 1px;
        font-size: 0.875rem;
        /* color: ${({ theme }) => theme.text}; */
      }
    }
    &[value='2'] {
      > svg {
        display: none;
      }
      &:after {
        clear: both;
        content: 'H2';
        display: table;
        font-weight: 500;
        margin-top: -2px;
        margin-left: 1px;
        font-size: 0.875rem;
        /* color: ${({ theme }) => theme.text}; */
      }
    }

    &[value='3']:after {
      clear: both;
      content: 'H3';
      display: table;
      font-weight: 500;
      margin-top: -2px;
      margin-left: 1px;
      font-size: 0.875rem;
      /* color: ${({ theme }) => theme.text}; */
    }

    &[value='4']:after {
      clear: both;
      content: 'H4';
      display: table;
      font-weight: 500;
      margin-top: -2px;
      margin-left: 1px;
      font-size: 0.875rem;
      /* color: ${({ theme }) => theme.text}; */
    }

    &:hover:after {
      color: #06c;
    }
    &.ql-active:after {
      color: #06c;
    }
  }
  &.ql-active {
    color: #06c;
  }
`

const Separator = styled.div`
  width: 1px;
  height: 1.25rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  background: ${({ theme }) => `${theme.text_hover}`}; ;
`

export default Toolbar
