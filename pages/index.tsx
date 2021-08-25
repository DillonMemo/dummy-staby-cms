import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { styleMode } from '../styles/styles';
import { authTokenVar, isLoggedInVar } from '../lib/apolloClient';
import { LOCALSTORAGE_TOKEN } from '../lib/constants';

export const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

type Props = styleMode;

const Home: NextPage<Props> = ({ toggleStyle, theme }) => {
  const router = useRouter();
  const onCompleted = (data: any) => {
    const {
      login: { ok, token },
    } = data;

    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      router.push('/test');
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation({
      variables: {
        loginInput: {
          email: 'dillon@staby.co.kr',
          password: '123123',
        },
      },
    });
  };

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <DivWrapper>
        <main className="main">
          <div>
            {loading ? (
              <span>로딩중...</span>
            ) : (
              <>
                <p>{loginMutationResult?.login?.token}</p>
              </>
            )}
          </div>
          <form onSubmit={onSubmit}>
            <div
              style={{
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'center',
                gap: '1rem',
              }}>
              <h2>HOME</h2>
              <input type="text" name="id" id="id" />
              <input type="password" name="password" id="password" />
              <button style={{ width: '100%', height: '2rem' }}>로그인</button>
            </div>
          </form>
        </main>
      </DivWrapper>
    </Layout>
  );
};

const DivWrapper = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  main {
    padding: 5rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .grid {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 800px;
    margin-top: 3rem;
  }

  .card {
    margin: 1rem;
    padding: 1.5rem;
    text-align: left;
    color: inherit;
    text-decoration: none;
    border: ${({ theme }) => `1px solid ${theme.text}`};
    border-radius: 10px;
    transition: color 0.15s ease, border-color 0.15s ease;
    width: 45%;
  }

  .card:hover,
  .card:focus,
  .card:active {
    color: #0070f3;
    border-color: #0070f3;
  }

  .card h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .card p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }

  .logo {
    height: 1em;
    margin-left: 0.5rem;
  }

  @media (max-width: 600px) {
    .grid {
      width: 100%;
      flex-direction: column;
    }
  }
`;
export default Home;
