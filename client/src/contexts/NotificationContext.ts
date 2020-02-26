import React from 'react';
import {State, ContextType} from '../../../types/notification';

export const initialState : State = {
    notification : null,
    error : null,
};

const NotificationContext = React.createContext<ContextType>({
    notificationState : initialState,
    actions : {
      refresh : ()=>{}
    }
});

export default NotificationContext;