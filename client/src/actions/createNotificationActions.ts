import { Dispatch, Callbacks } from '../../../types/notification';
export default (dispatch : Dispatch) : Callbacks => ({
    refresh: (token:string) => dispatch({ type: 'refresh', payload: { notification : {
        token 
    } } }),
});