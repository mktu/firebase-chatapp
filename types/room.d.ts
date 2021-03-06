import { CollectionTransfer, DocumentTransfer, Notifier, ErrorHandler } from './core';

export type Room = {
    roomName : string,
    ownerId : string,
    users : string[],
    disabled?:boolean,
    contact?:string[],
    initContact?:boolean,
    id : string
};

export type JoinRequest = {
    status : 'requesting'|'accepted'|'rejected',
    profileId : string,
    nickName : string,
    date : number,
    id : string
};

export type Action = {
    type: string,
    payload?: {
        rooms: Room[]
    }
}
export type Actions = {
    add : (rooms : Room[]) => void,
    modify : (rooms : Room[]) => void,
    delete : (rooms : Room[]) => void,
    init : () => void,
    loading : () => void
};

// context
export type State = {
    rooms : Room[],
    loading : boolean,
    error : Error | null
}

export type ContextType = {
    roomState : State,
    actions : Actions,
}

export type Dispatch = (action : Action) => void;

export type RoomsTransfer = CollectionTransfer<Room>;
export type RoomTransfer = DocumentTransfer<Room>;
export type JoinRequestsTransfer = CollectionTransfer<JoinRequest>;
export type JoinRequestTransfer = DocumentTransfer<JoinRequest>;
