import React from 'react';
import {State, ContextType} from '../types/room';

export const initialState : State = {
    rooms: [],
    error: null,
    loading : false
};

const initFunc = ()=>{};
const RoomContext = React.createContext<ContextType>({
    roomState : initialState,
    actions : {
        add : initFunc,
        modify : initFunc,
        delete : initFunc,
        init : initFunc,
        loading : initFunc
    }
});

export default RoomContext;