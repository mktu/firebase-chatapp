import { Action, State } from '../../../types/profile';
import { initialState } from '../contexts/ProfileContext';
export default (state: State, action: Action): State => {
    switch (action.type) {
        case 'set':
            return {
                profile: action.payload ? { ...action.payload.profile } : null,
                error: null,
                loading: false
            }
        case 'unset':
            return initialState;
        case 'loading':
            return state.loading ? state : {
                ...state,
                loading: true
            }
        default:
            return state;
    }
};
