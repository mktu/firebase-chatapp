import { Dispatch, Actions } from '../../../types/message';
export default (dispatch : Dispatch) : Actions => ({
    update: (roomId:string, unreadCount:number) => dispatch({type : 'update', payload: {roomId,unreadCount}})
});