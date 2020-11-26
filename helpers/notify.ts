import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import {errorSnackBar, successSnackBar} from "../lib/snackbars";
import {useTranslation} from "react-i18next";

export const useSmallNotify = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {t} = useTranslation('common')

  function successMessage(msg){
    enqueueSnackbar(msg, successSnackBar);
  }

  function errorMessage(msg){
    enqueueSnackbar(msg, errorSnackBar);
  }

  const apiResponse = async (response: Promise<any>, successMsg: string) => {
    try {
      const resp = await response;

      successMessage(successMsg)

      return resp
    } catch (err) {
      const responseMetaCode = err?.apiResponse.data?.meta?.code;
      const responseCode = err?.apiResponse.status;

      const errorCode = responseMetaCode || responseCode || '500'

      errorMessage(t(errorCode.toString()));

      throw err;
    }
  }

  return {
    successMessage,
    errorMessage,
    apiResponse
  }
}
