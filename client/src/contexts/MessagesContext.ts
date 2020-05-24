import React from 'react';
import {State, ContextType} from '../../../types/message';

export const initialState : State = { };

const ProfileContext = React.createContext<ContextType>({
    messageState : initialState,
    actions : {
        update : ()=>{}
    }
});

export default ProfileContext;