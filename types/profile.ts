import { CollectionTransfer, DocumentTransfer } from './core';

export type Profile = {
    nickname : string,
    uid : string,
    id : string,
    imageUrl?: string
};

export type Contact = {
    id: string,
    state : boolean,
    roomId ?: string
};

export type ContactProfile = Profile & Contact;

export type Action = {
    type: string,
    payload?: {
        profile: Profile
    }
}
export type Actions = {
    set : (profile : Profile) => void,
    unset : () => void,
    loading : () => void
};

export type State = {
    profile : Profile | null,
    loading : boolean,
    error : Error | null
}

export type ContextType = {
    profileState : State,
    actions : Actions
}

export type Dispatch = (action : Action) => void;

export type Transfer = DocumentTransfer<Profile>;
export type ProfilesTransfer = CollectionTransfer<Profile>;
export type ContactsTransfer = CollectionTransfer<Contact>;