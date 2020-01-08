import { Dispatch, Actions, User } from '../types/user';
export default (dispatch : Dispatch) : Actions => ({
    login: (user : User) => dispatch({ type: 'login', payload: { user } }),
    logout: () => dispatch({type : 'logout' }),
    loggingIn : ()=> dispatch({type : 'loggingIn'})
});