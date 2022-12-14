import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, TypeOfTheme } from '../styles/styles'
import themes from '../styles/themes'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'
import { ToastContainer } from 'react-toastify'

import 'antd/dist/antd.css'
import 'react-toastify/dist/ReactToastify.css'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)
  const [theme, setTheme] = useState<TypeOfTheme>('light')

  const toggleStyle = useCallback(
    (mode: TypeOfTheme) => {
      localStorage.setItem('theme', mode)
      setTheme(mode)
    },
    [theme]
  )

  useEffect(() => {
    const getTheme = localStorage.getItem('theme') as TypeOfTheme | null

    if (getTheme) {
      setTheme(getTheme)
    }
  }, [theme])

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={themes[theme]}>
        <GlobalStyles />
        <Component {...pageProps} toggleStyle={toggleStyle} theme={theme} />
        <ToastContainer />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default MyApp
