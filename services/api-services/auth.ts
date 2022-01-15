import {apiErrorHandler, getDefaultConnection} from "./base";

const connection = getDefaultConnection()

export default {
  signIn: async(data) => {
    return apiErrorHandler(connection.post('/auth/u-p/sign-in', data));
  }
}
