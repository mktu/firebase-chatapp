import {Action, State} from '../contexts/SidebarContext';

export default (state: State, action: Action): State => {
    switch (action.type) {
        case 'show':
            if(!action.payload){
                return state;
            }
            return {
                ...state,
                open : action.payload.open
            }
        default:
            return state;
    }
};
