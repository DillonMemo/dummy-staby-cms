import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import Link from 'next/link'
import styled from 'styled-components'
import { Button, Input } from 'antd'

/** styles */
import { md, sm, xxl, xxs } from '../styles/styles'

/** lib */
import { LOCALSTORAGE_TOKEN, TITLE } from '../lib/constants'
import { authTokenVar, isLoggedInVar } from '../lib/apolloClient'

/** graphql */
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '../graphql/mutations'
import { LoginMutation, LoginMutationVariables } from '../generated'

export interface ILoginForm {
  email: string
  password: string
}

const Login: NextPage = () => {
  const {
    getValues,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  })
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

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues()
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      })
    }
  }
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{TITLE}</title>
      </Head>
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
            <h2>Welcom to Staby CMS 👋</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <p>ID : admin@staby.co.kr</p>
              <p>PW : 123123</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-item">
                <div className="form-group">
                  <Controller
                    render={({ field }) => (
                      <Input {...field} className="input" placeholder="Email" />
                    )}
                    control={control}
                    name="email"
                    rules={{
                      required: '이메일 입력은 필수입니다',
                      pattern: {
                        value:
                          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: '이메일 형식이 아닙니다',
                      },
                    }}
                  />
                </div>
                {errors.email?.message && (
                  <div className="form-message">
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item">
                <div className="form-group">
                  <Controller
                    render={({ field }) => (
                      <Input.Password {...field} className="input" placeholder="Password" />
                    )}
                    control={control}
                    name="password"
                    rules={{
                      required: '비밀번호 입력은 필수입니다',
                    }}
                  />
                </div>
                {errors.password?.message && (
                  <div className="form-message">
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>
              <div className="form-item">
                <Button
                  type="primary"
                  role="button"
                  htmlType="submit"
                  className="submit-button"
                  disabled={!isValid}>
                  Sign In
                </Button>
                {loginMutationResult?.login.error && (
                  <div className="form-message">
                    <span>{loginMutationResult.login.error}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    </>
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

      padding: 2rem;
    }

    .container {
      flex: 0 0 70%;
      max-width: 70%;
      padding: 0 1.5rem;
      margin: 0 auto;

      ${xxl} {
        flex: 0 0 100%;
        max-width: 100%;
      }

      ${md} {
        flex: 0 0 50%;
        max-width: 50%;
      }

      ${sm} {
        flex: 0 0 66.66667%;
        max-width: 66.66667%;
      }

      ${xxs} {
        flex: 0 0 100%;
        max-width: 100%;
        padding: 0;
      }

      h2 {
        font-size: 1.74rem;
        font-weight: 300;
        text-align: center;
        margin-bottom: 1rem;
      }

      form {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        .form-item {
          .input {
            height: 2.714rem;
          }

          .submit-button {
            padding: 0.786rem 1.5rem;
            border: 1px solid transparent;
            box-shadow: none;
            width: 100%;
            min-height: 2.714rem;

            display: inline-flex;
            justify-content: center;
            align-items: center;
          }

          .form-message {
            color: red;
            font-size: 0.75rem;
          }
        }
      }
    }
  }
`

export default Login
