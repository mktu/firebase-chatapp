import React from 'react';
import {State, ContextType} from '../types/user';

export const initialState : State = {
    user: null,
    error: null
};

const AuthContext = React.createContext<ContextType>({
    userState : initialState,
    actions : {}
});

export default AuthContext;