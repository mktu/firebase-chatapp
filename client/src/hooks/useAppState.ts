import { useReducer,useEffect } from 'react';
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
    const userActions = authActionCreater(dispatchUser);
    const profileActions = profileActionCreater(dispatchProfile);
    const { user } = userState;
    useEffect(() => {
        return listenAuthState(dispatchUser);
    }, []);
    useEffect(() => {
        if (user) {
            profileActions.set && getProfile(user, profileActions.set, (error)=>{
                console.log(error); // Do not treat as error
            });
        }
    }, [user,profileActions.set]);
    return {
        userState,
        profileState,
        userActions,
        profileActions
    };
}