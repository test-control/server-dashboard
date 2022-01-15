import {ApiResponse, create} from "apisauce";
import {ApiConnectionError} from "../../helpers/exceptions";
import {getUserSession} from "../user";
import {NextPageContext} from "next";

export const apiErrorHandler  = async <T,U=T>(pResponse: Promise<ApiResponse<T,U>>) : Promise<T> => {
  const response = await pResponse;

  if(response.ok) {
    return response.data;
  }

  throw new ApiConnectionError(
    response
  )
}

export const getDefaultConnection = () => {
  return create({
    baseURL: process.env.TEST_CONTROL_DASHBOARD_API_URL + '/api/v1',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getDefaultUserConnection = (ctx?: NextPageContext) => {
  const connection = getDefaultConnection()
  const userJWT = getUserSession(ctx)

  connection.setHeader('Authorization', 'Bearer ' + userJWT)

  return connection;
}
