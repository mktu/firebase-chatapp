import { CollectionTransfer, DocumentTransfer } from '../client/src/types/core';

export type Reactions = {
    [s: string]: string[]
};
export type Message = {
    message : string,
    profileId : string,
    date : number,
    reactions? : Reactions,
    id : string
};

export type MessagesTransfer = CollectionTransfer<Message>;
export type MessageTransfer = DocumentTransfer<Message>;