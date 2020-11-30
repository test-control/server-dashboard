export const getApiResponseData = <T>(response: any) : T | null => {
  if("data" in response){
    return response.data as T || null
  }

  return null
}
export const getApiResponseMeta = <T>(response: any) : T | null => {
  if("meta" in response){
    return response.meta as T || null
  }

  return null
}
