import React from 'react';
import {State, ContextType} from '../types/profile';

export const initialState : State = {
    profile: null,
    error: null
};

const ProfileContext = React.createContext<ContextType>({
    profileState : initialState,
    actions : {}
});

export default ProfileContext;