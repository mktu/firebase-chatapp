import { CollectionTransfer, DocumentTransfer } from './core';

export type Reactions = {
    [s: string]: string[]
};
export type Message = {
    message : string,
    profileId : string,
    date : number,
    reactions? : Reactions,
    mentions? : string[],
    disable?: boolean,
    update?: number,
    id : string
};

export type MessagesTransfer = CollectionTransfer<Message>;
export type MessageTransfer = DocumentTransfer<Message>;