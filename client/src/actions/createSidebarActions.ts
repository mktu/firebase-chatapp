import {Actions, Dispatch} from '../contexts/SidebarContext';

export default (dispatch : Dispatch) : Actions => ({
    show: (open:boolean) => dispatch({type : 'show', payload: {open}})
});