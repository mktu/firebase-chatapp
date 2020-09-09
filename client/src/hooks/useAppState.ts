import { useReducer,useMemo } from 'react';
import { initialState as authInitialState } from '../contexts/AuthContext';
import { initialState as profileInitialState } from '../contexts/ProfileContext';
import { initialState as notificationInitialState } from '../contexts/NotificationContext';
import { initialState as sidebarInitialState } from '../contexts/SidebarContext';
import {
    createAuthActions,
    createProfileActions,
    createNotificationActions,
    createSidebarActions
} from '../actions';
import {
    authReducer,
    profileReducer,
    notificationReducer,
    sidebarReducer
} from '../reducers';

export default function () {
    const [userState, dispatchUser] = useReducer(authReducer, authInitialState);
    const [profileState, dispatchProfile] = useReducer(profileReducer, profileInitialState);
    const [notificationState, dispatchNotification] = useReducer(notificationReducer, notificationInitialState);
    const [sidebarState, dispatchSidebarState] = useReducer(sidebarReducer, sidebarInitialState);
    
    const userActions = useMemo(()=>createAuthActions(dispatchUser),[dispatchUser]);
    const profileActions = useMemo(()=>createProfileActions(dispatchProfile),[dispatchProfile]);
    const notificationActions = useMemo(()=>createNotificationActions(dispatchNotification),[dispatchNotification]);
    const sidebarActions = useMemo(()=>createSidebarActions(dispatchSidebarState),[dispatchSidebarState]);

    return {
        userState,
        profileState,
        userActions,
        profileActions,
        notificationState,
        notificationActions,
        sidebarState,
        sidebarActions
    };
}