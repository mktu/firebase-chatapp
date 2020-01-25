import { CollectionTransfer, DocumentTransfer } from './core';

export type Message = {
    message : string,
    profileId : string,
    date : number,
    id : string
};
export type MessagesTransfer = CollectionTransfer<Message>;
export type MessageTransfer = DocumentTransfer<Message>;