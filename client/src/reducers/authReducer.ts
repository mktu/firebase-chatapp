import { Action, State } from '../types/user';
import { initialState } from '../contexts/AuthContext';
export default (state: State, action: Action): State => {
    switch (action.type) {
        case 'login':
            return {
                user: action.payload ? { ...action.payload.user } : null,
                error: null,
                loggingIn: false,
            }
        case 'logout':
            return initialState;
        case 'loggingIn':
            return {
                ...state,
                loggingIn: true
            }
        default:
            return state;
    }
};
