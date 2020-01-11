export type ErrorHandler = (error : Error) => void;
export type Notifier = () => void;
export const consoleError = (error:Error) => { console.error(error) };
export const consoleLogger = (info:any) => { console.log(info); };