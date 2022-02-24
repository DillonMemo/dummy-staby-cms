import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Badge, notification, Select, Skeleton, Space } from 'antd'
import Icon, {
  ArrowRightOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  LayoutOutlined,
  LogoutOutlined,
  MoreOutlined,
  PlusOutlined,
  SettingOutlined,
  SoundOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { toast } from 'react-toastify'

/** components */
import DarkModeToggle from './DarkModeToggle'
import Hamburger from './Hamburger'

/** utils */
import { EXPANDED_WIDTH, LOCALSTORAGE_TOKEN, WIDTH } from '../lib/constants'
import { authTokenVar } from '../lib/apolloClient'

/** styles */
import { md, styleMode } from '../styles/styles'

/** graphql */
import { useMutation, useQuery } from '@apollo/client'
import { MY_QUERY } from '../graphql/queries'
import { LogoutMutation, LogoutMutationVariables, MyQuery, MyQueryVariables } from '../generated'
import { LOGOUT_MUTATION } from '../graphql/mutations'
import useNetworkStatus from '../hooks/useNetworkStatus'

type Props = styleMode

const Header: React.FC<Props> = ({ toggleStyle, theme }) => {
  const { locale, push, pathname, query, asPath } = useRouter()
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const { networkStatus } = useNetworkStatus()
  const hamburgerRef = React.useRef<HTMLDivElement>(null)
  const { loading, data } = useQuery<MyQuery, MyQueryVariables>(MY_QUERY, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      toast.error(error.message, {
        theme: localStorage.theme || 'light',
        autoClose: 1000,
        onClose: () => push('/login', '/login', { locale }),
      })
    },
  })
  const [logout] = useMutation<LogoutMutation, LogoutMutationVariables>(LOGOUT_MUTATION)
  /** 텍스트 에디터 컴포넌트가 적용된 페이지는 서버사이드렌더링 이슈가 있어 다크모드스위치를 가려주어야 합니다. */
  const isHide = pathname.includes('/test')

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

  const handleClickOutside = useCallback(
    ({ target }: React.MouseEvent<HTMLElement>) => {
      const { current } = hamburgerRef
      const nav = document.querySelector('.navigator')
      if (current) {
        if (!nav?.contains(target as HTMLElement)) {
          setIsNavOpen(false)
        }
      }
    },
    [isNavOpen]
  )

  const handleClickItem = async ({
    currentTarget,
  }: React.MouseEvent<HTMLAnchorElement>): Promise<void> => {
    const nodes = document.querySelectorAll('.has-sub')
    const parentNode = currentTarget.parentNode as HTMLLIElement

    await nodes.forEach((node) => {
      if (!node.contains(parentNode)) {
        if (node.classList.contains('open')) {
          node.classList.remove('open')

          const subNode = node.querySelector('.menu-content > .collapse')
          if (subNode?.classList.contains('show')) {
            subNode?.classList.remove('show')
          }
        }
      }
    })

    const subNode: HTMLDivElement | null | undefined = currentTarget.parentNode?.querySelector(
      '.menu-content > .collapse'
    )
    if (subNode) {
      if (subNode.classList.contains('show')) {
        parentNode.classList.remove('open')
        subNode.classList.remove('show')
      } else {
        parentNode.classList.add('open')
        subNode.classList.add('show')
      }
    }
  }

  /**
   * logout 클릭 이벤트 핸들러 입니다.
   */
  const handleClickLogout = async () => {
    try {
      const { data } = await logout()

      if (data?.logout.ok) {
        localStorage.removeItem(LOCALSTORAGE_TOKEN)
        push('/login', 'login', { locale })
      }
    } catch (error: any) {
      notification.error({
        message: error.message,
      })
      console.error(error)
    }
  }

  useEffect(() => {
    if (document) {
      document.addEventListener('mousedown', handleClickOutside as any)

      return () => document.removeEventListener('mousedown', handleClickOutside as any)
    }
  }, [isNavOpen])

  useEffect(() => {
    if (!loading) {
      if (data) {
        const localToken = authTokenVar() || localStorage.getItem(LOCALSTORAGE_TOKEN)
        if (data.my.refreshToken !== localToken) {
          localStorage.removeItem(LOCALSTORAGE_TOKEN)
          toast.info(locale === 'ko' ? '로그인이 필요합니다.' : 'You need to login', {
            theme: localStorage.theme || 'light',
            autoClose: 1000,
            onClose: () => push('/login', '/login', { locale }),
          })
        }
      }
    }
  }, [data, loading])

  return (
    <>
      <NavigatorWrapper
        className={['navigator', isNavOpen ? 'expanded' : undefined].join(' ')}
        onMouseOver={handleNavigatorOver}
        onMouseLeave={useCallback(() => setIsNavOpen(false), [isNavOpen])}>
        <div className="navbar-header">
          <ul className="nav">
            <li className="nav-item logo">
              <Link href="/">
                <a>
                  <div className="status">
                    {networkStatus ? <Badge status="success" /> : <Badge status="error" />}
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
            <li className="nav-item">
              <button className="logout" onClick={handleClickLogout}>
                <LogoutOutlined className="icon" />
                <span className="text">{locale === 'ko' ? '로그아웃' : 'Logout'}</span>
              </button>
            </li>
            <li
              className={[
                'nav-item',
                'has-sub',
                pathname.includes('/mypage') ? 'open' : undefined,
              ].join(' ')}>
              <Link href="#">
                <a onClick={handleClickItem}>
                  <UserOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '마이페이지' : 'My Page'}</span>
                </a>
              </Link>
              <ul className="menu-content">
                <div
                  className={['collapse', pathname.includes('/mypage') ? 'show' : undefined].join(
                    ' '
                  )}>
                  <li className="nav-item">
                    <Link href={{ pathname: '/mypage/edit' }}>
                      <a>
                        <ArrowRightOutlined className="icon" />
                        <span>{locale === 'ko' ? '내 정보 관리' : 'Account Settings'}</span>
                      </a>
                    </Link>
                  </li>
                </div>
              </ul>
            </li>
            {(data?.my.memberType === 'ADMIN' || data?.my.memberType === 'SYSTEM') && (
              <ul className="menu-content">
                <li className="nav-item-header">
                  <EllipsisOutlined className="icon" />
                  <span className="text">MEMBER</span>
                </li>
                <li className="nav-item">
                  <Link href="/member/members">
                    <a>
                      <SettingOutlined className="icon" />
                      <span className="text">{locale === 'ko' ? '관리' : 'Management'}</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/member/createMember">
                    <a>
                      <PlusOutlined className="icon" />
                      <span className="text">{locale === 'ko' ? '추가' : 'Create'}</span>
                    </a>
                  </Link>
                </li>
              </ul>
            )}

            <ul className="menu-content">
              <li className="nav-item-header">
                <EllipsisOutlined className="icon" />
                <span className="text">GOING</span>
              </li>
              {/* VOD */}
              <li className="nav-item has-sub">
                <a onClick={handleClickItem}>
                  <MoreOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? 'VOD' : 'VOD'}</span>
                </a>
                <ul className="menu-content">
                  <div className="collapse">
                    <li className="nav-item">
                      <Link href="/vod/vods">
                        <a>
                          <LayoutOutlined className="icon" />
                          <span className="text">{locale === 'ko' ? '관리' : 'Edit'}</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/vod/createVod">
                        <a>
                          <PlusOutlined className="icon" />
                          <span className="text">{locale === 'ko' ? '추가' : 'Create'}</span>
                        </a>
                      </Link>
                    </li>
                  </div>
                </ul>
              </li>
              {/* LIVE */}
              <li className="nav-item has-sub">
                <a onClick={handleClickItem}>
                  <MoreOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '라이브' : 'Live'}</span>
                </a>
                <ul className="menu-content">
                  <div className="collapse">
                    <li className="nav-item">
                      <Link href="/live/lives">
                        <a>
                          <LayoutOutlined className="icon" />
                          <span className="text">{locale === 'ko' ? '관리' : 'Edit'}</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/live/createLive">
                        <a>
                          <PlusOutlined className="icon" />
                          <span className="text">{locale === 'ko' ? '추가' : 'Create'}</span>
                        </a>
                      </Link>
                    </li>
                  </div>
                </ul>
              </li>
              {/* 게시판 */}
              <li className="nav-item has-sub">
                <a onClick={handleClickItem}>
                  <SoundOutlined className="icon" />
                  <span className="text">{locale === 'ko' ? '안내' : 'News'}</span>
                </a>
                <ul className="menu-content">
                  <div className="collapse">
                    <li className="nav-item">
                      <Link href="/notice">
                        <a>
                          <ArrowRightOutlined className="icon" />
                          <span>{locale === 'ko' ? '공지사항' : 'Notice'}</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/event">
                        <a>
                          <ArrowRightOutlined className="icon" />
                          <span>{locale === 'ko' ? '이벤트' : 'Event'}</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/faq">
                        <a>
                          <ArrowRightOutlined className="icon" />
                          <span>{locale === 'ko' ? 'FAQ' : 'FAQ'}</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/inquiry">
                        <a>
                          <ArrowRightOutlined className="icon" />
                          <span>{locale === 'ko' ? '문의' : 'Inquiry'}</span>
                        </a>
                      </Link>
                    </li>
                  </div>
                </ul>
              </li>
              {/* 콘텐츠 */}
              <li className="nav-item">
                {/* <Link href="/contents/contents"> */}
                <Link href="/contents/contents">
                  <a>
                    <UnorderedListOutlined className="icon" />
                    <span className="text">{locale === 'ko' ? '콘텐츠' : 'Contents'}</span>
                  </a>
                </Link>
              </li>
              {/* AD */}
              <li className="nav-item has-sub">
                <a onClick={handleClickItem}>
                  <Icon component={AdSvg} className="icon" />
                  <span className="text">{locale === 'ko' ? '광고' : 'AD'}</span>
                </a>
                <ul className="menu-content">
                  <div className="collapse">
                    <li className="nav-item">
                      <Link href="/ad/ads">
                        <a onClick={() => alert('준비중 입니다')}>
                          <SettingOutlined className="icon" />
                          <span className="text">{locale === 'ko' ? '관리' : 'Edit'}</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/ad/createAd">
                        <a onClick={() => alert('준비중 입니다')}>
                          <PlusOutlined className="icon" />
                          <span className="text">{locale === 'ko' ? '추가' : 'Create'}</span>
                        </a>
                      </Link>
                    </li>
                  </div>
                </ul>
              </li>
            </ul>

            <ul className="menu-content">
              <li className="nav-item-header">
                <EllipsisOutlined className="icon" />
                <span className="text">GO 2.0</span>
              </li>
              <li className="nav-item">
                <Link href="#">
                  <a>
                    <FileTextOutlined className="icon" />
                    <span className="text">{locale === 'ko' ? '준비중' : 'Comming soon'}</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item has-sub">
                <Link href="#">
                  <a onClick={handleClickItem}>
                    <MoreOutlined className="icon" />
                    <span className="text">{locale === 'ko' ? '준비중' : 'Comming soon'}</span>
                  </a>
                </Link>
                <ul className="menu-content">
                  <div className="collapse">
                    <li className="nav-item">
                      <Link href="#">
                        <a>
                          <ArrowRightOutlined className="icon" />
                          <span>{locale === 'ko' ? '서브1' : 'SUB1'}</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#">
                        <a>
                          <ArrowRightOutlined className="icon" />
                          <span>{locale === 'ko' ? '서브2' : 'SUB2'}</span>
                        </a>
                      </Link>
                    </li>
                  </div>
                </ul>
              </li>
            </ul>
          </ul>
        </div>
      </NavigatorWrapper>
      <HeaderWrapper>
        <div className="header-group-start">
          <div ref={hamburgerRef} className="header-item hamburger" onClick={handleHamburgerClick}>
            <Hamburger />
          </div>
        </div>
        {loading ? (
          <Space className="header-group-end">
            <div className="header-item">
              <Skeleton.Button active size={'default'} shape="square" />
            </div>
            <div className="header-item">
              <Skeleton.Button active size={'default'} shape="round" />
            </div>
            <div className="header-item">
              <Skeleton.Button active size={'default'} shape="square" />
            </div>
          </Space>
        ) : (
          <div className="header-group-end">
            <div className="header-item">
              <div className="country">
                <CountrySelect
                  defaultValue={locale}
                  placeholder={'Select a country'}
                  onChange={(value) =>
                    push({ pathname, query }, asPath, { locale: value as string })
                  }
                  bordered={false}
                  showArrow={false}>
                  <Select.Option value="ko">
                    <CountryOption>
                      <img
                        src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/kr.svg"
                        alt="KR"
                      />
                      <span>Korea</span>
                    </CountryOption>
                  </Select.Option>
                  <Select.Option value="en">
                    <CountryOption>
                      <img
                        src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/us.svg"
                        alt="US"
                      />
                      <span>English</span>
                    </CountryOption>
                  </Select.Option>
                </CountrySelect>
              </div>
              <span></span>
            </div>
            {!isHide && (
              <div className="header-item">
                <DarkModeToggle toggleStyle={toggleStyle} theme={theme} />
              </div>
            )}
            <div className="header-item profile">
              <div
                className="info"
                onClick={() => push('/mypage/edit', '/mypage/edit', { locale })}>
                <span className="user-name">{data?.my.nickName}</span>
                <span className="user-role">{data?.my.memberType}</span>
              </div>
              <div className="img">
                <img
                  src={
                    data?.my.profileImageName
                      ? `https://image.staby.co.kr/${
                          data.my.profileImageName
                        }?date=${moment().format('YYYYMMDDHHmmss')}`
                      : '/static/img/none-profile.png'
                  }
                  alt="profile"
                />
              </div>
            </div>
          </div>
        )}
      </HeaderWrapper>
    </>
  )
}

const statusIndicatorPulsePositive = keyframes`
0% {
    box-shadow: 0 0 0 0 rgb(75 210 143 / 50%);
    box-shadow: 0 0 0 0 var(--status-indicator-color-positive-semi);
}
70% {
    box-shadow: 0 0 0 10px rgb(75 210 143 / 0%);
    box-shadow: 0 0 0 var(--status-indicator-size) var(--status-indicator-color-positive-transparent);
}
100% {
    box-shadow: 0 0 0 0 rgb(75 210 143 / 0%);
    box-shadow: 0 0 0 0 var(--status-indicator-color-positive-transparent);
}
`
const statusIndicatorPulseNegative = keyframes`
0% {
    box-shadow: 0 0 0 0 rgb(255 77 79 / 50%);
    box-shadow: 0 0 0 0 var(--status-indicator-color-negative-semi);
}
70% {
    box-shadow: 0 0 0 10px rgb(255 77 79 / 0%);
    box-shadow: 0 0 0 var(--status-indicator-size) var(--status-indicator-color-negative-transparent);
}
100% {
    box-shadow: 0 0 0 0 rgb(255 77 79 / 0%);
    box-shadow: 0 0 0 0 var(--status-indicator-color-negative-transparent);
}
`

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
      flex-direction: column;

      height: 100%;

      .nav-item {
        width: 100%;

        &.logo {
          flex: 1;
        }

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

                content: '';
              }
              &.ant-badge-status-success:after {
                border-color: #52c41a;
                animation: ${statusIndicatorPulsePositive} 1s infinite ease-in-out !important;
              }
              &.ant-badge-status-error:after {
                border-color: #ff4d4f;
                animation: ${statusIndicatorPulseNegative} 1s infinite ease-in-out !important;
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
        margin: 0 1rem;
        padding: 2.286rem 1rem 0.8rem;
        color: ${({ theme }) => theme.text_hover};
        background-color: ${({ theme }) => theme.card};
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
          display: none !important;
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
        background-color: ${({ theme }) => theme.card};
        margin: 0 !important;

        a,
        button {
          cursor: pointer;
          outline: none;
          border: 0;
          text-overflow: inherit;
          margin: 0 0.9375rem;
          padding: 0.625rem 0.9375rem;

          background-color: ${({ theme }) => theme.card};
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
            margin-top: 1px;
            margin-right: 1.25rem;

            width: 1.25rem;
            height: 1.25rem;

            position: relative;
            top: 1px;
            left: 2px;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            ${md} {
              margin-right: 0.875rem;
              left: 0;
            }
          }

          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            line-height: 1.75;

            display: inline-flex;
            align-items: center;
          }

          &:hover {
            transition: all 0.5s ease, background 0s, color 0s;
            > * {
              transform: translate(5px);
              transition: transform 0.25s ease;
            }
          }
        }

        button.logout {
          .text {
            display: none;
          }
        }

        .menu-content {
          > .collapse {
            transition: max-height 0.5s, visibility 0.3s;
          }
          > .collapse.show {
            max-height: 100vh;
            visibility: visible;
          }
          > .collapse:not(.show) {
            max-height: 0;
            visibility: hidden;
            li:not(.has-sub) {
              margin: 0.4375rem 0.9375rem 0;
              background: transparent;
              color: ${({ theme }) => theme.text};
            }
          }
        }

        &.has-sub {
          &.open {
            > a {
              background-color: ${({ theme }) => theme.body};
              border-radius: 0.375rem;

              &:after {
                transform: rotate(90deg) !important;
              }
            }
            .menu-content {
              background-color: ${({ theme }) => theme.card};
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

          .text {
            display: block !important;
          }

          .icon {
            display: none;
          }
        }

        .nav-item {
          button.logout {
            margin: 0 auto;
            padding-right: 2rem;
            .text {
              display: flex;
            }
          }
          &.has-sub {
            > a:after {
              content: '';
              height: 1rem;
              width: 1rem;
              display: inline-block;
              position: absolute;
              top: 0.875rem;
              right: 1.25rem;
              transition: 0.2s ease-out;

              background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236e6b7b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position: 50%;
              background-size: 1rem;
              transform: rotate(0deg);
            }
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
    margin: 1.3rem auto 0;
    width: calc(100% - 2.4rem);
    left: 0;
  }

  .header-group-start,
  .header-group-end {
    display: flex;
    justify-content: center;
    /* > * + * {
      margin-left: 1rem;

      ${md} {
        margin-left: 0.5rem;
      }
    } */
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

    font-size: 0.875rem;

    ${md} {
      font-size: 0.75rem;
    }

    &.profile {
      margin-left: 1rem;

      ${md} {
        margin-left: 0.5rem;
      }
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
          margin-bottom: 0.435rem;
          letter-spacing: 1px;

          max-width: 7.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
const CountrySelect = styled(Select)`
  width: auto;
  color: ${({ theme }) => theme.text};
  text-align: center;
`
const CountryOption = styled.div`
  display: block;
  align-items: center;
  width: auto;
  padding: 0;

  font-size: 0.875rem;
  min-width: 5rem;

  ${md} {
    font-size: 0.75rem;
    min-width: auto;
  }

  img {
    display: inline-block;
    width: 1rem;
    height: 1rem;

    margin-right: 0.4rem;
  }

  span {
    ${md} {
      display: none;
    }
  }
`

const AdSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="1em"
    height="1em"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 16 16">
    <g fill="currentColor">
      <path d="M3.7 11l.47-1.542h2.004L6.644 11h1.261L5.901 5.001H4.513L2.5 11h1.2zm1.503-4.852l.734 2.426H4.416l.734-2.426h.053zm4.759.128c-1.059 0-1.753.765-1.753 2.043v.695c0 1.279.685 2.043 1.74 2.043c.677 0 1.222-.33 1.367-.804h.057V11h1.138V4.685h-1.16v2.36h-.053c-.18-.475-.68-.77-1.336-.77zm.387.923c.58 0 1.002.44 1.002 1.138v.602c0 .76-.396 1.2-.984 1.2c-.598 0-.972-.449-.972-1.248v-.453c0-.795.37-1.24.954-1.24z" />
      <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
    </g>
  </svg>
)

export default Header
