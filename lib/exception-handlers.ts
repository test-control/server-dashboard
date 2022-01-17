import { routes } from "./breadcrumbs";
import Router from 'next/router'
import {ApiConnectionError} from "../helpers/exceptions";
import { StatusCodes } from 'http-status-codes'
import {NextPageContext} from "next";
import {clearUserSession} from "../services/user";

export const handleWebApiPromise = (err) => {
  if(err instanceof ApiConnectionError){
    if(err.apiResponse === StatusCodes.UNAUTHORIZED) {
      return Router.replace(routes.loginPage())
    }
  }
  
  if(process.env.DEBUG){
    throw err;
  }

  return Router.replace(routes.internalErrorPage())
}

export const handleSSRException = async <T>(ctx: NextPageContext, callback: () => Promise<T>) : Promise<T> => {
  return handleException(ctx, callback, {
    props: {}
  })
}

export const handleException = async <T>(ctx: NextPageContext, callback: () => Promise<T>, returnOnException?: any) : Promise<T> => {
  try{
    return await callback()
  } catch(e){

    if(e instanceof ApiConnectionError){
      await translateApiConnectionError(ctx, e)
      return returnOnException
    }

    await translateException(ctx, e)

    return returnOnException
  }
}

const translateException = async (ctx: NextPageContext, err: Error) => {

  if(process.env.DEBUG){
    console.log('SERVER ERROR: ', err)
    throw err;
  }

  return redirect(ctx, routes.internalErrorPage().href)
}

const translateApiConnectionError = async (ctx: NextPageContext, err: ApiConnectionError<any, any>) => {

  if(err.apiResponse.status !== StatusCodes.UNAUTHORIZED){
    return translateException(ctx, err);
  }

  if(process.env.DEBUG){
    console.log('API ERROR: ', err)
  }

  clearUserSession(ctx);

  return redirect(ctx, routes.loginPage().href)
}

const redirect = async (ctx: NextPageContext, href: string) => {
  if(ctx.res){
    ctx.res.writeHead(
      StatusCodes.TEMPORARY_REDIRECT,
      { Location: href}
    )
    ctx.res.end()
  } else{
    return Router.replace(href)
  }
}
