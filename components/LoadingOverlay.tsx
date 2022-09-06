import { Fragment, ReactNode } from 'react'
import styled from 'styled-components'
import { md } from '../styles/styles'

interface Props {
  states: { [key: string]: boolean }
  direction?: 'row' | 'column'
  children: ReactNode
}
const LoadingOverlay: React.FC<Props> = ({ states, direction = 'row', children }) => {
  return Object.values(states).findIndex((bol) => bol) !== -1 ? (
    <Overlay direction={direction}>{children}</Overlay>
  ) : (
    <Fragment></Fragment>
  )
}

const Overlay = styled.div<Pick<Props, 'direction'>>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 16, 16, 0.7);
  z-index: 9999;

  .container {
    width: 100%;
    height: 100%;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    flex-flow: ${({ direction }) => (direction === 'row' ? 'row nowrap' : 'column nowrap')};

    small {
      color: white;
      text-align: left;
      margin-top: 0.875rem;
      line-height: 1;
    }

    .progress {
      display: inline-flex;
      flex-flow: column nowrap;
      .ant-progress.ant-progress-line {
        display: inherit;
        width: ${({ direction }) => (direction === 'row' ? '12rem' : '12rem')};

        .ant-progress-text {
          font-size: 1rem;
          line-height: 1.1;
          text-align: center;
        }
      }
    }
    .letter-holder {
      padding: 1rem;
      .letter {
        float: left;
        font-size: 1.875rem;
        color: white;

        animation-name: loading;
        animation-duration: 1.6s;
        animation-iteration-count: infinite;
        animation-direction: linear;

        ${md} {
          font-size: 1.25rem;
        }

        &.l-1 {
          animation-delay: 0.48s;
        }
        &.l-2 {
          animation-delay: 0.6s;
        }
        &.l-3 {
          animation-delay: 0.72s;
        }
        &.l-4 {
          animation-delay: 0.84s;
        }
        &.l-5 {
          animation-delay: 0.96s;
        }
        &.l-6 {
          animation-delay: 1.08s;
        }
        &.l-7 {
          animation-delay: 1.2s;
        }
        &.l-8 {
          animation-delay: 1.32s;
        }
        &.l-9 {
          animation-delay: 1.44s;
        }
        &.l-10 {
          animation-delay: 1.56s;
        }
      }
    }
  }

  @keyframes loading {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export default LoadingOverlay
