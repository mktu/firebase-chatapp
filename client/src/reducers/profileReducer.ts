import { Action, State } from '../types/profile';
import { initialState } from '../contexts/ProfileContext';
export default (state : State, action : Action) : State => {
    switch (action.type) {
        case 'set':
        return {
            profile: action.payload ? {...action.payload.profile} : null,
            error: null
        }
        case 'unset':
        return initialState;
        default:
        return state;
    }
};
  