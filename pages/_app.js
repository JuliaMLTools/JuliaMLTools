import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import '../styles/styles.css'
import ResponsiveAppBar from '../src/ResponsiveAppBar';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import ColorModeContext from '../src/contexts/ColorModeContext';
import { NestedList } from '../src/NestedList';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState('dark');
  const [mounted, setMounted] = useState(false);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            console.log(`Setting color mode ${newMode}`);
            window.localStorage.setItem("COLOR_MODE", newMode);
            return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
    createTheme({
        palette: {
          mode,
          primary: {
            main: '#556cd6',
          },
          secondary: {
            main: '#19857b',
          },
          error: {
            main: red.A400,
          },
        },
      }),
    [mode],
  );

  useEffect(() => {
    const storedColorMode = window.localStorage.getItem("COLOR_MODE");
    console.log(`localStorage.COLOR_MODE ${storedColorMode}`);
    setMode(storedColorMode === null ? 'dark' : storedColorMode);
    setMounted(true);
  }, [])

  if (!mounted){
      return null;
  }

  console.log(`mode: ${mode}`);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ColorModeContext.Provider value={colorMode}>

      <ThemeProvider theme={theme}>
          <div className={`${mode}Mode`}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <ResponsiveAppBar/>
            <Component {...pageProps} />
        </div>
    </ThemeProvider>

        </ColorModeContext.Provider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};



