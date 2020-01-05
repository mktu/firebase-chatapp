export type Profile = {
    nickname : string,
    uid : string,
    id : string
};

export type Action = {
    type: string,
    payload?: {
        profile: Profile
    }
}
export type Actions = {
    set? : (profile : Profile) => void,
    unset? : () => void
};

export type State = {
    profile : Profile | null,
    error : Error | null
}

export type ContextType = {
    profileState : State,
    actions : Actions
}

export type Dispatch = (action : Action) => void;

export type Transfer = (profile : Profile) => void;