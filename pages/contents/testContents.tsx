import { useRef } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { clamp } from 'lodash'
import { useDrag } from 'react-use-gesture'
import { animated, useSprings } from '@react-spring/web'
import { Props, swap } from '../../Common/commonFn'
import Layout from '../../components/Layout'
import { MainWrapper } from '../../styles/styles'
import styled from 'styled-components'

/** test */
const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 50 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === 'y' || key === 'zIndex',
        }
      : {
          y: order.indexOf(index) * 50,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        }
const items = 'Lorem ipsum dolor sit'.split(' ')

const TestContents: NextPage<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const order = useRef(items.map((_, index) => index))
  const [springs, api] = useSprings(items.length, fn(order.current))
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    console.log('bind', order.current)
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1)
    const newOrder = swap(order.current, curIndex, curRow)
    api.start(fn(newOrder, active, originalIndex, curIndex, y)) // Feed springs new style data, they'll animate the view without causing a single render
    if (!active) order.current = newOrder
  })

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <MainWrapper>
        <div className="main-header">
          <h2>Contents</h2>
          <ol>
            <li>
              <Link href="/">
                <a>{locale === 'ko' ? '홈' : 'Home'}</a>
              </Link>
            </li>
            <li>Contents</li>
            <li>{locale === 'ko' ? 'Contents 관리' : 'Contents Edit'}</li>
          </ol>
        </div>
        <div className="main-content">
          <TestContent className="card">
            <div className="content" style={{ height: items.length * 50 }}>
              {springs.map(({ zIndex, shadow, y, scale }, i) => (
                <animated.div
                  {...bind(i)}
                  key={i}
                  style={{
                    zIndex,
                    boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                    y,
                    scale,
                  }}>
                  {items[i]}
                </animated.div>
              ))}
            </div>
          </TestContent>
        </div>
      </MainWrapper>
    </Layout>
  )
}

const TestContent = styled.div`
  height: 100%;

  .content {
    position: relative;
    width: 200px;
    height: 100%;
    > div {
      position: absolute;
      width: 200px;
      height: 40px;
      transform-origin: 50% 50% 0px;
      color: ${({ theme }) => theme.text};
      line-height: 40px;
      padding-left: 32px;
      font-size: 14.5px;
      background: lightblue;
      text-transform: uppercase;
      letter-spacing: 2px;
      touch-action: none;

      &:nth-child(1) {
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
      }
      &:nth-child(2) {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &:nth-child(3) {
        background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
      }
      &:nth-child(4) {
        background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%);
      }
    }
  }
`

export default TestContents
