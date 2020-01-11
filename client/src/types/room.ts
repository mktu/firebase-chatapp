export type Room = {
    roomName : string,
    ownerId : string,
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

export type State = {
    rooms : Room[],
    loading : boolean,
    error : Error | null
}

export type ContextType = {
    roomState : State,
    actions : Actions
}

export type Dispatch = (action : Action) => void;

export type Transfer = (rooms : Room[]) => void;