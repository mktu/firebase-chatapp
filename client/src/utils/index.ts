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