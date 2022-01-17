export const maxTextLength = (txt: string, maxLength: number, endTxt?: string, cutLength?:number) : string =>
{
  if(txt.length <= maxLength){
    return txt;
  }

  if(!endTxt){
    endTxt = "...";
  }

  if(!cutLength){
    cutLength = maxLength
  }

  return txt.slice(0, cutLength) + endTxt;
}
