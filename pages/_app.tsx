import React, { useCallback, useState } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, TypeOfTheme } from '../styles/styles';
import themes from '../styles/themes';

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<TypeOfTheme>('light');

  const toggleStyle = useCallback(
    (mode: TypeOfTheme) => {
      setTheme(mode);
    },
    [theme]
  );

  return (
    <>
      <ThemeProvider theme={themes[theme]}>
        <GlobalStyles />
        <Component {...pageProps} toggleStyle={toggleStyle} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
