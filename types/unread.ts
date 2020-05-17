import { CollectionTransfer, DocumentTransfer } from './core';

export type Unread = {
    messageIds : string[],
    id : string
};

export type Action = {
    type: 'update' | 'clear',
    payload?: {
        roomId: string,
        unread?: Unread
    }
}
export type Actions = {
    update : (roomId:string, unread : Unread) => void,
    clear : (roomId:string) => void
};

export type State = {
    unreads : {[s : string] : Unread | null}
}

export type ContextType = {
    unreadState : State,
    actions : Actions
}

export type Dispatch = (action : Action) => void;

export type UnreadsTransfer = CollectionTransfer<Unread>;
export type UnreadTransfer = DocumentTransfer<Unread>;
