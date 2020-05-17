export type CollectionTransfer<T> = (collection: T[]) => void;
export type DocumentTransfer<T> = (document: T) => void;
export type ErrorHandler = (error : Error) => void;
export type Notifier = () => void;