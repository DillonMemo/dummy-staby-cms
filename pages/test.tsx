import type { NextPage } from 'next';
import { useReactiveVar } from '@apollo/client';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { styleMode } from '../styles/styles';
import React from 'react';
import { authTokenVar } from '../lib/apolloClient';

type Props = styleMode;

const Test: NextPage<Props> = ({ toggleStyle, theme }) => {
  const getData = useReactiveVar(authTokenVar);

  return (
    <Layout toggleStyle={toggleStyle} theme={theme}>
      <DivWrapper>
        <main className="main">
          <p>{getData || '토큰이 존재 하지 않습니다.'}</p>
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
export default Test;
