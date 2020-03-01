export type Notification = {
    token : string
}

export type Token = {
    id : string,
    profileId : string
}

export type Action = {
    type: 'refresh',
    payload?: {
        notification: Notification
    }
}

export type Callbacks = {
    refresh : (token : string) => void,
};

export type State = {
    notification : Notification | null,
    error : Error | null,
}

export type ContextType = {
    notificationState : State,
    actions : Callbacks
}

export type Dispatch = (action : Action) => void;

export type RawTokenTransfer = (token : string) => void;
export type TokenTransfer = (token : Token) => void;