/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Document, {
  Html, Main, Head, NextScript,
} from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
