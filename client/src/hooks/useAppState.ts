import { useReducer,useEffect,useMemo } from 'react';
import { initialState as authInitialState } from '../contexts/AuthContext';
import { initialState as profileInitialState } from '../contexts/ProfileContext';
import { initialState as roomInitialState } from '../contexts/RoomContext';
import authActionCreater from '../actions/createAuthActions';
import profileActionCreater from '../actions/createProfileActions';
import roomActionCreater from '../actions/createRoomActions';
import { listenAuthState } from '../services/auth';
import { getProfile } from '../services/profile';
import authReducer from '../reducers/authReducer';
import profileReducer from '../reducers/profileReducer';
import roomReducer from '../reducers/roomReducer';

export default function () {
    const [userState, dispatchUser] = useReducer(authReducer, authInitialState);
    const [profileState, dispatchProfile] = useReducer(profileReducer, profileInitialState);
    const [roomState, dispatchRoom] = useReducer(roomReducer, roomInitialState);
    const userActions = useMemo(()=>authActionCreater(dispatchUser),[dispatchUser]);
    const profileActions = useMemo(()=>profileActionCreater(dispatchProfile),[dispatchProfile]);
    const roomActions = useMemo(()=>roomActionCreater(dispatchRoom),[dispatchRoom]);
    const { user } = userState;
    
    useEffect(() => {
        userActions.loggingIn();
        return listenAuthState(userActions.login!, userActions.logout!);
    }, [userActions]);
    useEffect(() => {
        if (user) {
            getProfile(user, profileActions.set, (error)=>{
                console.log(error); // Do not treat as error
                profileActions.unset();
            });
            profileActions.loading();
        }
    }, [user,profileActions]);
    return {
        userState,
        profileState,
        userActions,
        profileActions,
        roomState,
        roomActions
    };
}