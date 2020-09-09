import React from 'react';
export type Action = {
    type: 'show',
    payload?: {
        open:boolean,
    }
}

export type Actions = {
    show : (open:boolean)=>void
};

export type Dispatch = (action : Action) => void;

export type State = {
    open:boolean
}

export type ContextType = {
    sidebarState : State,
    actions : Actions,
}

export const initialState : State = {
    open : false
};

const SidebarContext = React.createContext<ContextType>({
    sidebarState : initialState,
    actions : {
        show : ()=>{}
    }
});

export default SidebarContext;