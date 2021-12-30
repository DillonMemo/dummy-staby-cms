import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, TypeOfTheme } from '../styles/styles'
import themes from '../styles/themes'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'

import 'antd/dist/antd.css'

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname, reload } = useRouter()
  const apolloClient = useApollo(pageProps)
  const [theme, setTheme] = useState<TypeOfTheme>('light')

  const toggleStyle = useCallback(
    (mode: TypeOfTheme) => {
      localStorage.setItem('theme', mode)
      setTheme(mode)
    },
    [theme]
  )

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={themes[theme]}>
        <GlobalStyles />
        <Component {...pageProps} toggleStyle={toggleStyle} theme={theme} />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default MyApp
