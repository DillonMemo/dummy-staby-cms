import styled, { createGlobalStyle, keyframes } from 'styled-components'
import themes from './themes'

export const { xxxs, xxs, xs, sm, md, _2md, lg, xl, xxl, _4xl } = {
  xxxs: '@media (max-width: 20rem)', // 320px
  xxs: '@media (max-width: 32rem)', // 512px
  xs: '@media (max-width: 38rem)', // 608px
  sm: '@media (max-width: 48rem)', // 768px
  md: '@media (max-width: 62rem)', // 992px
  _2md: '@media (max-width: 64rem)', // 1024px
  lg: '@media (max-width: 80rem)', // 1280px
  xl: '@media (max-width: 90rem)', // 1440px
  xxl: '@media (max-width: 120rem)', // 1920px
  _4xl: '@media (max-width: 160rem)', // 2560px
}

type LightnessName =
  | 'background'
  | 'accent1'
  | 'accent2'
  | 'accent3'
  | 'accent4'
  | 'accent5'
  | 'accent6'
  | 'default'
  | 'accent8'
  | 'foreground'
  | 'grey'

export const defaultPalette: Record<LightnessName, string> = {
  /** Default */
  background: '#FFFFFF',
  accent1: '#D6D6D6',
  accent2: '#BCBCBC',
  accent3: '#A3A3A3',
  accent4: '#8A8A8A',
  accent5: '#707070',
  accent6: '#58595b',
  default: '#3D3D3D',
  accent8: '#242424',
  foreground: '#000000',
  grey: '#888888',
}

/**
 * key: _xx(%) percent
 * value: convert to hex
 */
export const opacityHex = {
  _0: '00',
  _10: '16',
  _20: '32',
  _30: '48',
  _40: '64',
  _50: '80',
  _60: '96',
  _70: 'aa',
  _80: 'cc',
  _90: 'ee',
}

export type TypeOfTheme = keyof typeof themes

export type styleMode = {
  toggleStyle: (mode: TypeOfTheme) => void
  theme: TypeOfTheme
}

export const GlobalStyles = createGlobalStyle`
    *, *::after, *::before {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    *::placeholder {
      color: #C5C5C5 !important;
    }
    body {
        font-family: 'Montserrat', 'Noto Sans KR', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        overscroll-behavior: auto;
        user-select: none;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        /* transition: background 0.2s ease-in, color 0.2s ease-in; */
    }
    a {
      text-decoration: none;
      color: ${({ theme }) => theme.text};

      &:hover {
        color: ${({ theme }) => theme.text_hover};
      }
    }
    ul {
      list-style: none;
    }
    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      color: inherit;
    }
    p {
      margin: 0;
      padding: 0;
    }
    /** 스크롤바 커스텀 */
    ::-webkit-scrollbar {
        width: 2px;
        height: 10px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(34, 45, 50, 0.5);
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(34, 45, 50, 1);
    }

    /** antd custom */
    .ant-btn {
      background: ${({ theme }) => theme.body};
      color: ${({ theme }) => theme.text};

      border: none;
      outline: none;

      &:hover, &:focus  {
        background: ${({ theme }) => `${theme.body}`};
        color: ${({ theme }) => theme.text_hover};
      }
    }
    .ant-popover {
      z-index: 999;
      .ant-popover-arrow {
        .ant-popover-arrow-content {
          background-color: ${({ theme }) => theme.body};
        }
      }
      .ant-popover-inner {
        background-color: ${({ theme }) => theme.body};
        .ant-popover-inner-content {
          padding: 0;
        }
      }
    }
`

const FadeIn = keyframes`
0% {
  opacity: 0;
}

100% {
  opacity: 100;
}
`

export const MainWrapper = styled.main`
  min-height: 100vh;
  margin-left: 5rem;
  padding: 7.75rem 2rem 0;

  ${md} {
    margin-left: 0;
    padding: 7.75rem 1.2rem 0;
  }

  .main-header {
    margin-bottom: 1.5rem;
    display: flex;

    h2 {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1;
      padding-right: 0.875rem;
      letter-spacing: 0.01rem;

      display: flex;
      align-items: center;

      border-right: 1px solid ${({ theme }) => theme.text_hover};

      color: ${({ theme }) => theme.text};

      ${md} {
        border: 0;
      }
    }

    ol {
      list-style: none;
      letter-spacing: 0.01rem;

      padding: 0.3rem 1rem;
      margin: 0;
      background-color: transparent;
      border-radius: 0;

      display: flex;
      flex-flow: row wrap;
      align-items: center;
      font-size: 0.875rem;

      ${md} {
        display: none;
      }

      li {
        &:not(:first-child):before {
          content: '';
          background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b4b7bd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-right'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E")
            no-repeat;
          background-position: 50%;
          background-size: 0.875rem;

          color: ${({ theme }) => theme.text};
          height: 1.25rem;
          padding: 0 1rem;
        }
      }
    }
  }

  .main-content {
    animation-name: ${FadeIn};
    animation-duration: 1s;
    animation-fill-mode: both;

    color: ${({ theme }) => theme.text};

    .card {
      background-color: ${({ theme }) => theme.card};
      border-radius: ${({ theme }) => theme.card_radius};
      padding: 1rem;
    }
  }
`
export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  .form-item {
    color: ${({ theme }) => theme.text};
    select,
    .input:not(.ant-input-disabled),
    .ant-select-selector {
      height: 2.714rem;
      align-items: center;
      background-color: ${({ theme }) => theme.card};
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.border};
      border-radius: ${({ theme }) => theme.card_radius};
    }

    .ant-input-affix-wrapper > input.ant-input {
      background-color: ${({ theme }) => theme.card};
      color: ${({ theme }) => theme.text};
    }
    .ant-select-arrow,
    .ant-input-suffix svg {
      color: ${({ theme }) => theme.text};
    }

    .ant-input[disabled],
    .ant-select-disabled .ant-select-selector {
      height: 2.714rem;
      border: 1px solid ${({ theme }) => theme.border};
      border-radius: ${({ theme }) => theme.card_radius};
      background-color: ${({ theme }) => theme.body};
      color: ${({ theme }) => theme.text};
    }

    *::placeholder {
      color: ${({ theme }) => `${theme.text}75`}!important;
    }

    .form-group {
      display: flex;
      flex-flow: column nowrap;

      .form-message {
        color: red;
        font-size: 0.75rem;
      }
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      .submit-button {
        padding: 0.786rem 1.5rem;
        border: 1px solid transparent;
        box-shadow: none;
        min-height: 2.714rem;

        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .ant-input-group-addon {
    min-width: 7.5rem;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.body};
  }
`
