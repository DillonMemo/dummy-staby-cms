import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Badge } from 'antd'
import { EllipsisOutlined, FileTextOutlined } from '@ant-design/icons'

/** components */
import DarkModeToggle from './DarkModeToggle'
import Hamburger from './Hamburger'

/** utils */
import { EXPANDED_WIDTH, WIDTH } from '../lib/constants'

/** styles */
import { md, styleMode } from '../styles/styles'

type Props = styleMode

const Header: React.FC<Props> = ({ toggleStyle, theme }) => {
  const { locale } = useRouter()
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const hamburgerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (document) {
      document.addEventListener('mousedown', handleClickOutside as any)

      return () => document.removeEventListener('mousedown', handleClickOutside as any)
    }
  }, [isNavOpen])
  /**
   * `side navigator` 마우스 이벤트 핸들러 입니다.
   */
  const handleNavigatorOver = useCallback(() => {
    setIsNavOpen(true)
  }, [isNavOpen])

  /**
   * `햄버거` 버튼 클릭 이벤트 핸들러 입니다.
   */
  const handleHamburgerClick = useCallback(() => {
    setIsNavOpen(!isNavOpen)
  }, [isNavOpen])

  const handleClickOutside = ({ target }: React.MouseEvent<HTMLElement>) => {
    const { current } = hamburgerRef
    const nav = document.querySelector('.navigator')
    if (current) {
      if (!nav?.contains(target as HTMLElement)) {
        setIsNavOpen(false)
      }
    }
  }
  return (
    <>
      <NavigatorWrapper
        className={['navigator', isNavOpen ? 'expanded' : undefined].join(' ')}
        onMouseOver={handleNavigatorOver}
        onMouseLeave={useCallback(() => setIsNavOpen(false), [isNavOpen])}>
        <div className="navbar-header">
          <ul className="nav">
            <li className="nav-item">
              <Link href="/">
                <a>
                  <div className="status">
                    <Badge status="success" />
                  </div>
                  <div className="logo"></div>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="shadow-bottom"></div>
        <div className="navbar-container">
          <ul className="nav">
            <li className="nav-item-header">
              <EllipsisOutlined className="icon" />
              <span className="text">GOING</span>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기1' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기2' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기3' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기4' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기5' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기6' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기7' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기8' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기9' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기10' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기11' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기12' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기13' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기14' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기15' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기16' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기17' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기18' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기19' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기20' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기21' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기22' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기23' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기24' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기25' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기26' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기27' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기28' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기29' : 'undefined'}</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#">
                <a>
                  <FileTextOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '바로가기30' : 'undefined'}</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </NavigatorWrapper>
      <HeaderWrapper>
        <div className="header-group-start">
          <div ref={hamburgerRef} className="header-item hamburger" onClick={handleHamburgerClick}>
            <Hamburger />
          </div>
        </div>
        <div className="header-group-end">
          <div className="header-item country">
            <span>🇰🇷&nbsp;&nbsp;Korea</span>
          </div>
          <div className="header-item">
            <DarkModeToggle toggleStyle={toggleStyle} theme={theme} />
          </div>
          <div className="header-item profile">
            <div className="info">
              <span className="user-name">Dillon</span>
              <span className="user-role">Admin</span>
            </div>
            <div className="img">
              <img src="/static/img/none-profile.png" alt="profile" />
            </div>
          </div>
        </div>
      </HeaderWrapper>
    </>
  )
}

const NavigatorWrapper = styled.div`
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.card};
  max-width: ${WIDTH};
  width: 100%;
  height: 100%;
  z-index: 999;
  box-shadow: 0 0 15px 0 rgb(34 41 47 / 5%);
  transition: 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background 0s;
  backface-visibility: hidden;

  position: fixed;
  display: table-cell;

  ${md} {
    max-width: ${EXPANDED_WIDTH};
    left: ${`-${EXPANDED_WIDTH}`};
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    outline: none;
    color: ${({ theme }) => theme.text};
  }

  &:focus {
    background-color: gray;
  }

  .navbar-header {
    padding: 0.35rem 1rem 0.3rem 1rem;
    width: 16.25rem;
    height: 4.45rem;
    position: relative;
    transition: all 0.3s ease, background 0s;

    .nav {
      border-radius: 0.25rem;

      display: flex;
      flex-direction: row;

      height: 100%;

      .nav-item {
        width: 100%;
        a {
          outline: none;
          display: flex;
          align-items: center;
          font-size: inherit;
          height: 100%;

          *:first-child {
            flex: 0 0 20%;
          }

          .status {
            display: inline-flex;
            justify-content: center;
            .ant-badge-status-dot {
              width: 0.75rem;
              height: 0.75rem;

              &:after {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 1px solid;
                border-radius: 50%;
                animation: antStatusProcessing 0.7s infinite ease-in-out !important;
                content: '';
              }
              &.ant-badge-status-success:after {
                border-color: #52c41a;
              }
              &.ant-badge-status-error:after {
                border-color: #ff4d4f;
              }
            }

            .ant-badge-status-text {
              margin: 0;
            }
          }

          div.logo {
            height: 37%;
            display: none;
            background: ${({ theme }) =>
              theme.mode === 'dark'
                ? `url('/static/img/logo_staby_white.png') no-repeat center/contain`
                : `url('/static/img/logo_staby.png') no-repeat center/contain`};
            margin-left: 1.64rem;

            flex: 0 0 50%;
          }
        }
      }
    }
  }

  .shadow-bottom {
    background: ${({ theme }) =>
      theme.mode === 'dark'
        ? `linear-gradient(180deg,#283046 44%,rgba(40,48,70,.51) 73%,rgba(40,48,70,0))`
        : `linear-gradient(#fff 41%,hsla(0,0%,100%,.11) 95%,hsla(0,0%,100%,0))`};

    margin-top: -0.7rem;

    display: none;
    position: absolute;
    z-index: 2;
    height: 3.125rem;
    width: 100%;
    pointer-events: none;
    filter: blur(5px);
  }

  .navbar-container {
    height: calc(100% - 4.5rem);
    position: relative;

    overflow: hidden;
    overflow-anchor: none;
    touch-action: auto;

    color: ${({ theme }) => theme.text};

    direction: ltr;
    text-align: left;

    .nav {
      background-color: ${({ theme }) => theme.card};
      padding-bottom: 0.75rem;

      font-size: 1.2rem;
      font-weight: 400;

      li {
        position: relative;
        white-space: nowrap;
      }

      .nav-item-header {
        margin: 2.286rem 1rem 0.8rem;
        padding: 0;
        color: ${({ theme }) => theme.text_hover};
        line-height: 1.5;
        letter-spacing: 0.1rem;
        text-transform: uppercase;
        font-size: 1.125rem;
        font-weight: 500;

        display: flex;
        justify-content: center;

        ${md} {
          font-size: 1rem;
        }

        .text {
          display: none;
        }

        .icon {
          width: 1.125rem;
          height: 1.125rem;
          display: block;
          font-size: 1.285rem;
        }
      }

      .nav-item {
        color: ${({ theme }) => theme.text};

        a {
          outline: none;
          text-overflow: inherit;
          margin: 0 0.9375rem;
          padding: 0.625rem 0.9375rem;

          color: ${({ theme }) => theme.text};
          line-height: 1.45;

          overflow: hidden;
          outline: none;

          display: flex;

          > * {
            transition: transform 0.25s ease;

            font-size: 1rem;

            ${md} {
              font-size: 0.875rem;
            }
          }
          .icon {
            margin-right: 1.1rem;

            width: 1.25rem;
            height: 1.25rem;

            position: relative;
            top: 1px;
            left: 2px;

            ${md} {
              margin-right: 0.875rem;
              float: left;
              left: 0;
            }
          }

          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            line-height: 1.45;
          }

          &:hover {
            transition: all 0.5s ease, background 0s, color 0s;
            > * {
              transform: translate(5px);
              transition: transform 0.25s ease;
            }
          }
        }
      }
    }
  }

  &.expanded {
    max-width: ${EXPANDED_WIDTH};

    ${md} {
      transform: ${`translate3d(${EXPANDED_WIDTH}, 0, 0)`};
    }

    .navbar-header {
      .nav {
        .nav-item {
          a {
            outline: none;
            div.logo {
              display: inline;
            }
          }
        }
      }
    }

    .navbar-container {
      overflow: auto;
      .nav {
        .nav-item-header {
          justify-content: flex-start;
          padding: 0 1rem;
          .text {
            display: block;
          }

          .icon {
            display: none;
          }
        }
      }
    }
  }
`

const HeaderWrapper = styled.header`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  right: 0;
  z-index: 12;
  box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);

  width: calc(100% - 4.4rem - 74px);
  min-height: ${WIDTH};

  padding: 0.8rem 1rem;
  margin: 1.3rem 2rem 0;

  background-color: ${({ theme }) => theme.card};
  border-radius: ${({ theme }) => theme.card_radius};

  ${md} {
    margin: 1.3rem 1rem 0;
    width: calc(100% - 2.4rem);
  }

  .header-group-start,
  .header-group-end {
    display: flex;
    justify-content: center;
    > * + * {
      margin-left: 1rem;

      ${md} {
        margin-left: 0.5rem;
      }
    }
  }

  .header-group-start {
    .hamburger {
      display: none;

      ${md} {
        display: inline-flex;
      }
    }
  }

  .header-item {
    cursor: pointer;
    display: inline-flex;
    align-items: center;

    &.country {
      font-size: 1rem;

      ${md} {
        font-size: 0.875rem;
      }
    }

    &.profile {
      .info {
        margin-right: 0.425rem;

        display: flex;
        flex-flow: column nowrap;
        align-items: flex-end;
        ${md} {
          display: none;
        }
        > * {
          display: inline-block;
          line-height: 1;
          color: ${({ theme }) => theme.text};
        }
        .user-name {
          font-weight: 500;
          font-size: 0.875rem;
          margin-bottom: 0.435rem;
          letter-spacing: 1px;
        }

        .user-role {
          font-size: smaller;
        }
      }
      .img {
        img {
          width: 2.25rem;
          height: 2.25rem;

          border-radius: 5rem;
        }
      }
    }
  }
`

export default Header
