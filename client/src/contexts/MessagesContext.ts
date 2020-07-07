import React from 'react';
import {State, ContextType} from '../../../types/message';

export const initialState : State = { };

const MessageContext = React.createContext<ContextType>({
    messageState : initialState,
    actions : {
        update : ()=>{}
    }
});

export default MessageContext;