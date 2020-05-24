import React from 'react';
import {State, ContextType, Actions} from '../../../types/room';

export const initialState : State = {
    rooms: [],
    error: null,
    loading : false
};

const initFunc = ()=>{};

export const initialActions : Actions = {
    add : initFunc,
    modify : initFunc,
    delete : initFunc,
    init : initFunc,
    loading : initFunc
}

const RoomContext = React.createContext<ContextType>({
    roomState : initialState,
    actions : initialActions,

});

export default RoomContext;