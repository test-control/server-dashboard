import {ApiResponse} from "apisauce";

export class ApiConnectionError<T,U> extends Error
{
  readonly apiResponse;

  constructor(resp: ApiResponse<T,U>,message?: string) {
    super(message);
    this.apiResponse = resp;
  }
}
