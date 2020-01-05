import { useReducer,useEffect,useMemo } from 'react';
import { initialState as authInitialState } from '../contexts/AuthContext';
import { initialState as profileInitialState } from '../contexts/ProfileContext';
import authActionCreater from '../actions/createAuthActions';
import profileActionCreater from '../actions/createProfileActions';
import { listenAuthState } from '../services/auth';
import { getProfile } from '../services/profile';
import authReducer from '../reducers/authReducer';
import profileReducer from '../reducers/profileReducer';

export default function () {
    const [userState, dispatchUser] = useReducer(authReducer, authInitialState);
    const [profileState, dispatchProfile] = useReducer(profileReducer, profileInitialState);
    const userActions = useMemo(()=>authActionCreater(dispatchUser),[dispatchUser]);
    const profileActions = useMemo(()=>profileActionCreater(dispatchProfile),[dispatchProfile]);
    const { user } = userState;
    useEffect(() => {
        return listenAuthState(userActions.login!, userActions.logout!);
    }, [userActions]);
    useEffect(() => {
        console.log('loading')
        if (user) {
            getProfile(user, profileActions.set, (error)=>{
                console.log(error); // Do not treat as error
            });
            profileActions.loading();
        }
    }, [user,profileActions]);
    return {
        userState,
        profileState,
        userActions,
        profileActions
    };
}