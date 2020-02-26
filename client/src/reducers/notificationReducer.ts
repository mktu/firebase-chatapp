import { Action, State } from '../../../types/notification';
import { initialState } from '../contexts/NotificationContext';

export default (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'refresh':
            return {
                notification: action.payload ? { ...action.payload.notification } : null,
                error: null,
            }
        default:
            return state;
    }
};
