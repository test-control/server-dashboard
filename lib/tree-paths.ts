export const removeSegmentsFromEnd = (path: string, length: number) => {
  const pathSegments = path.split('.');
  const cutLength = pathSegments.length - length;

  if(cutLength <= 0){
    return '';
  }

  let newPath = '';

  for(let i = 0; i < cutLength; i++){
    if(i !== 0){
      newPath += '.';
    }

    newPath += pathSegments[i]
  }

  return newPath
}

export const isRootPath = (path: string) : boolean => {
  return path.split('.').length == 1
}

export const isTheSameParent = (lPath: string, rPath: string) : boolean => {
  return lPath.slice(0, -1) === rPath.slice(0, -1)
}

export const isChild = (parentPath: string, childPath: string) : boolean => {
  return parentPath === removeSegmentsFromEnd(childPath, 1)
}
