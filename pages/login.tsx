// import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
// import { useForm } from 'react-hook-form'
import Link from 'next/link'
import styled from 'styled-components'

import { md } from '../styles/styles'
import { LOCALSTORAGE_TOKEN } from '../lib/constants'
import { authTokenVar, isLoggedInVar } from '../lib/apolloClient'

/** graphql */
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '../graphql/mutations'
import { LoginMutation, LoginMutationVariables } from '../generated'

const Login: NextPage = () => {
  const router = useRouter()
  const { locale } = router
  const onCompleted = (data: any) => {
    const {
      login: { ok, token },
    } = data

    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token)
      authTokenVar(token)
      isLoggedInVar(true)
      router.push('/', '/', { locale })
    }
  }

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    loginMutation({
      variables: {
        loginInput: {
          email: 'dillon@staby.co.kr',
          password: '123123',
        },
      },
    })
  }
  return (
    <Wrapper>
      <Link href="/login">
        <a className="logo"></a>
      </Link>
      <div className="content">
        <div className="content-item">
          <img src="/static/svgs/pixeltrue-data-analyse-1.svg" alt="pixeltrue-data-analyse-1" />
        </div>
      </div>
      <div className="wrapper">
        <div className="container">
          <h2>Welcom to CMS</h2>
          {loading ? <p>로딩중...</p> : <div>{JSON.stringify(loginMutationResult?.login)}</div>}
          {!loginMutationResult && (
            <form onSubmit={onSubmit}>
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                <input type="text" name="id" id="id" />
                <input type="password" name="password" id="password" />
                <button style={{ width: '100%', height: '2rem' }}>로그인</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  display: flex;
  flex-wrap: wrap;

  overflow-y: hidden;

  .logo {
    position: absolute;
    top: 2rem;
    left: 2rem;

    background: ${({ theme }) =>
        theme.mode === 'dark'
          ? `url('/static/img/logo_staby_white.png')`
          : `url('/static/img/logo_staby.png')`}
      no-repeat center/contain;
    width: 7rem;
    height: 2.5rem;

    ${md} {
      width: 5rem;
      height: 2rem;
    }
  }

  .content {
    flex: 0 0 66.66667%;
    max-width: 66.6667%;

    padding: 4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    ${md} {
      display: none;
    }

    .content-item {
      padding: 0 4rem;

      img {
        border-style: none;
        max-width: 100%;
        height: auto;
      }
    }
  }

  .wrapper {
    flex: 0 0 33.33333%;
    max-width: 33.33333%;

    background-color: ${({ theme }) => theme.card};

    padding: 4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    ${md} {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .container {
      padding: 0 1.5rem;
      margin: 0 auto;

      h2 {
        font-weight: 300;
      }
    }
  }
`

export default Login
