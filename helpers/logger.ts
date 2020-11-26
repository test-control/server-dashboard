export const debugError = (err:any, customDebug?: any) => {
  if(!process.env.DEBUG) {
    return
  }

  console.log('----> Error logger start:')
  console.log('----')
  console.error(err, customDebug)
  console.log('----')
  console.log('----> Error logger stop')
}
