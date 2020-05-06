import { Action, State } from '../../../types/room';
import { initialState } from '../contexts/RoomContext';
import {arraysEqual} from '../utils';
export default (state: State, action: Action): State => {
    switch (action.type) {
        case 'add':
            return {
                rooms : [...state.rooms,...action.payload!.rooms],
                error: null,
                loading: false
            }
        case 'modify':
            return {
                rooms : state.rooms.map(room=>{
                    const matched = action.payload!.rooms.find(r=>r.id===room.id);
                    if(matched){
                        if(arraysEqual(matched.users,room.users)){
                            matched.users = room.users;
                        }
                        return matched;
                    }
                    return room;
                }),
                error: null,
                loading: false
            };
        case 'delete':
            return {
                rooms : state.rooms.filter(room=>{
                    const matched = action.payload!.rooms.find(r=>r.id===room.id);
                    return !Boolean(matched)
                }),
                error: null,
                loading: false
            }
        case 'loading':
            return state.loading ? state : {
                ...state,
                loading: true
            }
        case 'init':
            return initialState;
        default:
            return state;
    }
};
