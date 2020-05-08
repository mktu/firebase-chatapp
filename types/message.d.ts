import { CollectionTransfer, DocumentTransfer } from './core';

export type Reactions = {
    [s: string]: string[]
};
export type Message = {
    roomId: string,
    message : string,
    senderId : string,
    senderName : string,
    date : number,
    roomName : string,
    readers? : string[],
    reactions? : Reactions,
    mentions? : string[],
    disable?: boolean,
    update?: number,
    id : string
};

export type MessagesTransfer = CollectionTransfer<Message>;
export type MessageTransfer = DocumentTransfer<Message>;