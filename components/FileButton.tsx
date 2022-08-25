import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

type Props = React.HTMLProps<HTMLInputElement>

const FileButton: React.FC<Props> = ({ id, className, name, accept }) => {
  useEffect(() => {
    if (document) {
      const node = document.querySelectorAll('label')

      node.forEach((label) => {
        const duration = 3000,
          svg = label.querySelector('svg')
        debugger
        console.log(label)
      })
    }
  }, [])

  return (
    <FileComponent>
      <label htmlFor={name} className={className}>
        {className && className.includes('single') ? (
          <div>
            <svg viewBox="0 0 24 24"></svg>
          </div>
        ) : (
          <>
            <ul>
              <li>Select File</li>
              <li>Selecting</li>
              <li>Open File</li>
            </ul>
            <div>
              <svg viewBox="0 0 24 24"></svg>
            </div>
          </>
        )}
      </label>
      <input type="file" id={id} name={name} accept={accept} />
    </FileComponent>
  )
}

const text = keyframes`
    10%, 85% {
        transform: translateY(-100%);
    }
    95%, 100% {
        transform: translateY(-200%);
    }
`

const line = keyframes`
    5%, 10% {
        transform: translateY(-30px);
    }
    40% {
        transform: translateY(-20px);
    }
    65% {
        transform: translateY(0);
    }
    75%, 100% {
        transform: translateY(30px);
    }
`

const svg = keyframes`
    0%, 20% {
        stroke-dasharray: 0;
        stroke-dashoffset: 0;
    }
    21%, 89% {
        stroke-dasharray: 26px;
        stroke-dashoffset: 26px;
        stroke-width: 3px;
        margin: -10px 0 0 -10px;
        stroke: var(--checkmark);
    }
    100% {
        stroke-dasharray: 26px;
        stroke-dashoffset: 0;
        margin: -10px 0 0 -10px;
        stroke: var(--checkmark);
    }
    12% {
        opacity: 1;
    }
    20%, 89% {
        opacity: 0;
    }
    90%, 100% {
        opacity: 1;
    }
`

const background = keyframes`
    10% {
        transform: scaleY(0);
    }
    40% {
        transform: scaleY(0.15);
    
    }
    65% {
        transform: scaleY(0.5);
        border-radius: 0 0 50% 50%;
    }
    75% {
        border-radius: 0 0 50% 50%;
    }
    90%, 100% {
        border-radius: 0;
    }
    75%, 100% {
        transform: scaleY(1);
    }
`

const FileComponent = styled.div`
  display: inline-flex;

  label {
    &.dark-single {
      --background: none;
      --rectangle: #242836;
      --success: #4bc793;
    }
    &.white-single {
      --background: none;
      --rectangle: #f5f9ff;
      --arrow: #275efe;
      --success: #275efe;
      --shadow: rgba(10, 22, 50, 0.1);
    }
    &.dark {
      --background: #242836;
      --rectangle: #1c212e;
      --arrow: #f5f9ff;
      --text: #f5f9ff;
      --success: #2f3545;
    }
    --background: #275efe;
    --rectangle: #184fee;
    --success: #4672f1;
    --text: #fff;
    --arrow: #fff;
    --checkmark: #fff;
    --shadow: rgba(10, 22, 50, 0.24);

    cursor: pointer;
    display: flex;
    overflow: hidden;
    text-decoration: none;
    mask-image: -webkit-radial-gradient(white, black);
    background: var(--background);
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px -1px var(--shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 1px 4px -1px var(--shadow);
    }

    ul {
      margin: 0;
      padding: 1rem 2.5rem;
      list-style: none;
      text-align: center;
      position: relative;
      backface-visibility: hidden;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.75rem;
      color: var(--text);

      li {
        &:not(:first-child) {
          top: 1rem;
          left: 0;
          right: 0;
          position: absolute;
        }

        &:nth-child(2) {
          top: 4.75rem;
        }

        &:nth-child(3) {
          top: 8.5rem;
        }
      }
    }

    > div {
      position: relative;
      width: 3.75rem;
      height: 3.75rem;
      background: var(--rectangle);

      &:before,
      &:after {
        content: '';
        display: block;
        position: absolute;
      }

      &:before {
        border-radius: 1px;
        width: 2px;
        top: 50%;
        left: 50%;
        height: 1.0625rem;
        margin: -9px 0 0 -1px;
        background: var(--arrow);
      }
      &:after {
        width: 3.75rem;
        height: 3.75rem;
        transform-origin: 50% 0;
        border-radius: 0 0 80% 80%;
        background: var(--success);
        top: 0;
        left: 0;
        transform: scaleY(0);
      }

      svg {
        display: block;
        position: absolute;
        width: 1.25rem;
        height: 1.25rem;
        left: 50%;
        top: 50%;
        margin: -9px 0 0 -10px;
        fill: none;
        z-index: 1;
        stroke-width: 2px;
        stroke: var(--arrow);
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }

    &.loading {
      ul {
        animation: ${text} calc(var(--duration) * 1ms) linear forwards
          calc(var(--duration) * 0.065ms);
      }

      > div {
        &:before {
          animation: ${line} calc(var(--duration) * 1ms) linear forwards
            calc(var(--duration) * 0.065ms);
        }

        &:after {
          animation: ${background} calc(var(--duration) * 1ms) linear forwards
            calc(var(--duration) * 0.065ms);
        }

        svg {
          animation: ${svg} calc(var(--duration) * 1ms) linear forwards
            calc(var(--duration) * 0.065ms);
        }
      }
    }
  }
  input[type='file'] {
    display: none;
  }
`

export default FileButton
