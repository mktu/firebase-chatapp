export type User = {
    uid : string,
    isAnonymous : Boolean,
    name : string | null
}

export type Action = {
    type: string,
    payload?: {
        user: User
    }
}
export type Actions = {
    login? : (user : User) => void,
    logout? : () => void
};

export type State = {
    user : User | null,
    error : Error | null
}

export type ContextType = {
    userState : State,
    actions : Actions
}

export type Dispatch = (action : Action) => void;