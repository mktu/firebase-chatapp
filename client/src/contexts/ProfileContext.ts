import React from 'react';
import {State, ContextType} from '../../../types/profile';

export const initialState : State = {
    profile: null,
    error: null,
    loading : false
};

const ProfileContext = React.createContext<ContextType>({
    profileState : initialState,
    actions : {
        set : ()=>{},
        unset : ()=>{},
        loading : ()=>{}
    }
});

export default ProfileContext;