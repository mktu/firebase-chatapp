import { Action, State } from '../../../types/message';
export default (state: State, action: Action): State => {
    switch (action.type) {
        case 'update':
            if(!action.payload){
                return state;
            }
            return {
                ...state,
                [action.payload.roomId] : action.payload.unreadCount
            }
        default:
            return state;
    }
};
