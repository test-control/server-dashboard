import '../styles/global.css'
import {ThemeProvider} from "@material-ui/core/styles";
import theme from "../theme";
import { SnackbarProvider } from 'notistack';
import React from "react";
import {Button} from "@material-ui/core";
import Head from 'next/head';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'draft-js/dist/Draft.css';
import '../theme/rich-editor.css';
import { appWithTranslation } from '../i18n'
import App from 'next/app'

const cApp = ({ Component, pageProps }) => {
  console.log('sample')
    React.useEffect(() => {
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles) {
        jssStyles.parentElement.removeChild(jssStyles);
      }
    }, []);

  const notistackRef = React.createRef();
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
  }

  return  <React.Fragment>
      <Head>
        <title>da</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500&display=swap" rel="stylesheet" />
        <meta charSet="utf-8" />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          ref={notistackRef}
          action={(key) => (
            <Button onClick={onClickDismiss(key)} size="small">Dismiss</Button>
          )}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}>
            <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
      <script src="https://unpkg.com/react@15.6.0/dist/react.js"></script>
<script src="https://unpkg.com/react-beautiful-dnd@5.0.0/dist/react-beautiful-dnd.js"></script>
<script src="https://unpkg.com/react-dom@15.6.0/dist/react-dom.js"></script>
<script src="https://unpkg.com/react-i18next/react-i18next.min.js"></script>
  </React.Fragment>
}

cApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

cApp.getInitialProps = async (appContext) => ({ ...await App.getInitialProps(appContext) })

export default appWithTranslation(cApp);
