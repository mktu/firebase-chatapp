import * as domutil from './dom';

export {
    domutil
}

export type ErrorHandler = (error : Error) => void;
export type Notifier = () => void;
export const consoleError = (error:Error) => { console.error(error) };
export const consoleLogger = (info:any) => { console.log(info); };

export function arraysEqual<T>(a : T[], b : T[]) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

export const isImage = (type ?: string)=>{
  return type?.includes('image') || false;
}

export function mergeObjectArrays<T,U>(src:T[],targets:U[],comp:(s:T,v:U)=>boolean){
  return src.map(val=>{
    const target = targets.find(t=>comp(val,t));
    if(target){
      return {
        ...target,
        ...val
      } as (T&U)
    }
    return val as (T&U);
  })
}

export function modifyArrays<T>(list:T[],modified:T[],key:keyof T){
    return list.map(val=>{
      const target = modified.find(m=>m[key] === val[key]);
      if(target){
          return target;
      }
      return val;
  })
}

export function filterArrays<T>(list:T[],filtered:T[],key:keyof T){
  return list.filter(val=>{
      const target = filtered.find(f=>f[key] === val[key]);
      if(target){
          return false;
      }
      return true;
  })
}