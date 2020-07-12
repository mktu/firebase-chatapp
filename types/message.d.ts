import { CollectionTransfer, DocumentTransfer } from './core';

export type Reactions = {
    [s: string]: string[]
};

export type Action = {
    type: 'update',
    payload?: {
        unreadCount:number,
        roomId:string,
    }
}
export type Actions = {
    update : (roomId:string,unreadCount:number)=>void
};

// context
export type State = {
    [roomKey:string]:number
}

export type ContextType = {
    messageState : State,
    actions : Actions,
}

export type Dispatch = (action : Action) => void;

export type MessageImage = {
    url : string,
    name: string,
    type : string,
    size : number,
}

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
    images?: MessageImage[],
    id : string
};

export type MessagesTransfer = CollectionTransfer<Message>;
export type MessageTransfer = DocumentTransfer<Message>;