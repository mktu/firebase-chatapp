import { Dispatch, Actions, Profile } from '../types/profile';
export default (dispatch : Dispatch) : Actions => ({
    set: (profile : Profile) => dispatch({ type: 'set', payload: { profile } }),
    unset: () => dispatch({type : 'unset' }),
    loading : ()=> dispatch({type : 'loading'})
});