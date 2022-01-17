import '../styles/global.css'
import {ThemeProvider} from '@mui/system';
import {theme} from "../ntheme/theme";
import React from "react";
import Head from 'next/head';
import PropTypes from 'prop-types';
import 'draft-js/dist/Draft.css';
import App, {AppContext} from 'next/app'
import {handleException} from "../lib/exception-handlers";
import {appWithTranslation} from "next-i18next";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { resetServerContext } from "react-beautiful-dnd";

const cApp = ({ Component, pageProps }) => {

    React.useEffect(() => {
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles) {
        jssStyles.parentElement.removeChild(jssStyles);
      }
    }, []);

  return  <React.Fragment>
      <Head>
        <title>da</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
  </React.Fragment>
}

cApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

cApp.getInitialProps = async (appContext: AppContext) => {

  resetServerContext()

  const appResponse = await handleException(appContext.ctx, async () => {
    return App.getInitialProps(appContext);
  })

  return {...appResponse}
}



export default appWithTranslation(cApp);
