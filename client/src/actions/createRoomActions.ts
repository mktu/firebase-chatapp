import { Dispatch, Actions, Room } from '../types/room';
export default (dispatch : Dispatch) : Actions => ({
    add: (rooms : Room[]) => dispatch({ type: 'add', payload: { rooms } }),
    modify: (rooms : Room[]) => dispatch({type : 'modify', payload:{ rooms } }),
    delete: (rooms : Room[]) => dispatch({type : 'delete', payload:{ rooms } }),
    init: () => dispatch({type : 'init' }),
    loading : ()=> dispatch({type : 'loading'})
});