import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { md } from '../styles/styles'

interface Props extends React.HTMLProps<HTMLInputElement> {
  paragraph: {
    first: string
    second: string
    three?: string
  }
  single?: boolean
}
const duration = 3000
const getPoint = (point: number[], i: number, a: number[][], smoothing: number) => {
  const cp = (current: number[], previous: number[], next: number[], reverse: boolean) => {
      const p = previous || current,
        n = next || current,
        o = {
          length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
          angle: Math.atan2(n[1] - p[1], n[0] - p[0]),
        },
        angle = o.angle + (reverse ? Math.PI : 0),
        length = o.length * smoothing
      return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length]
    },
    cps = cp(a[i - 1], a[i - 2], point, false),
    cpe = cp(point, a[i - 1], a[i + 1], true)
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

export const getPath = (update: number, smoothing: number, pointsNew?: number[][]) => {
  const points = pointsNew
      ? pointsNew
      : [
          [4, 12],
          [12, update],
          [20, 12],
        ],
    d = points.reduce(
      (acc, point, i, a) =>
        i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`,
      ''
    )
  return `<path d="${d}" />`
}

const FileButton: React.FC<Props> = ({
  id,
  className,
  name,
  accept,
  paragraph,
  onChange: onFileChange,
  single = false,
}) => {
  useEffect(() => {
    if (document) {
      const node = document.querySelectorAll('label.fileLabel') as NodeListOf<HTMLLabelElement>
      node.forEach((label) => {
        const svg = label.querySelector('svg'),
          svgPath = new Proxy<{ y?: number; smoothing?: number }>(
            {
              y: undefined,
              smoothing: undefined,
            },
            {
              set(target, key: 'y' | 'smoothing', value) {
                target[key] = value
                if (target.y && typeof target.smoothing === 'number' && svg) {
                  svg.innerHTML = getPath(target.y, target.smoothing)
                }
                return true
              },
              get(target, key: 'y' | 'smoothing') {
                return target[key]
              },
            }
          )
        label.style.setProperty('--duration', `${duration}`)
        svgPath.y = 20
        svgPath.smoothing = 0
      })
    }
  }, [])

  return (
    <FileComponent paragraph={paragraph}>
      <label htmlFor={name} className={className + (single ? ' single' : '')}>
        {single ? (
          <div>
            <svg viewBox="0 0 24 24"></svg>
          </div>
        ) : (
          <>
            <ul>
              <li>{paragraph.first}</li>
              <li>{paragraph.second}</li>
              {paragraph.three && <li>{paragraph.three}</li>}
            </ul>
            <div>
              <svg viewBox="0 0 24 24"></svg>
            </div>
          </>
        )}
      </label>
      <input
        type="file"
        id={id}
        name={name}
        accept={accept}
        onChange={(e) => {
          e.preventDefault()
          const target = e.target
          const label = target.previousSibling as HTMLLabelElement

          onFileChange && onFileChange(e)

          if (label) {
            const svg = label.querySelector('svg')

            if (!label.classList.contains('loading')) {
              label.classList.add('loading')

              setTimeout(() => {
                if (svg)
                  svg.innerHTML = getPath(0, 0, [
                    [3, 14],
                    [8, 19],
                    [21, 6],
                  ])
              }, duration / 2)
            }
          }
        }}
      />
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
const text_2 = keyframes`
    95%, 100% {
      transform: translateY(-100%);
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

const FileComponent = styled.div<Pick<Props, 'paragraph'>>`
  display: inline-flex;

  ${md} {
    width: 100%;
  }

  label {
    ${md} {
      width: 100%;
    }
    &.single {
      --background: none;
      --rectangle: ${({ theme }) => theme.body};
      --arrow: ${({ theme }) => theme.success};
      --success: ${({ theme }) => theme.success};
      --text: ${({ theme }) => theme.text};
      --shadow: rgba(10, 22, 50, 0.1);
    }

    --background: ${({ theme }) => theme.body};
    --background-success: ${({ theme }) => theme.success};
    --rectangle: ${({ theme }) => theme.border};
    --success: ${({ theme }) => theme.success};
    --text: ${({ theme }) => theme.text};
    --arrow: ${({ theme }) => theme.success};
    --checkmark: ${({ theme }) => theme.text};
    --shadow: rgba(10, 22, 50, 0.24);

    cursor: pointer;
    display: flex;
    overflow: hidden;
    text-decoration: none;
    mask-image: -webkit-radial-gradient(white, black);
    background: var(--background);
    border-radius: 0.3rem;
    box-shadow: 0 2px 8px -1px var(--shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:active {
      transform: scale(0.95);
      box-shadow: 0 1px 4px -1px var(--shadow);
    }

    ul {
      display: inline-flex;
      align-items: center;
      margin: 0;
      /* padding: 0 2.5rem; */
      list-style: none;
      text-align: center;
      position: relative;
      backface-visibility: hidden;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);

      ${md} {
        width: 100%;
      }

      li {
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 0 2.5rem;
        white-space: nowrap;

        &:not(:first-child) {
          top: 1rem;
          left: 0;
          right: 0;
          position: absolute;
        }

        &:nth-child(2) {
          top: 2.25rem;
        }

        &:nth-child(3) {
          top: 4.25rem;
        }
      }
    }

    > div {
      position: relative;
      width: 2rem;
      height: 2rem;
      background: var(--rectangle);

      ${md} {
        min-width: 2rem;
        min-height: 2rem;
      }

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
        width: 2rem;
        height: 2rem;
        transform-origin: 50% 0;
        border-radius: 0 0 80% 80%;
        background: var(--success);
        top: 0;
        left: 0;
        transform: scaleY(0);
      }

      svg {
        --duration: 3000;
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
        animation: ${({ paragraph }) => (paragraph.three ? text : text_2)}
          calc(var(--duration) * 0.5ms) linear forwards calc(var(--duration) * 0.065ms);
      }

      > div {
        &:before {
          animation: ${line} calc(var(--duration) * 0.5ms) linear forwards
            calc(var(--duration) * 0.065ms);
        }

        &:after {
          animation: ${background} calc(var(--duration) * 0.5ms) linear forwards
            calc(var(--duration) * 0.065ms);
        }

        svg {
          animation: ${svg} calc(var(--duration) * 0.5ms) linear forwards
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
