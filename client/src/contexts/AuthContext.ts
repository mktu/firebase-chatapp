import React from 'react';
import {State, ContextType} from '../types/user';

export const initialState : State = {
    user: null,
    error: null,
    loggingIn : false
};

const AuthContext = React.createContext<ContextType>({
    userState : initialState,
    actions : {
      login : ()=>{},
      logout : ()=>{},
      loggingIn : ()=>{}  
    }
});

export default AuthContext;