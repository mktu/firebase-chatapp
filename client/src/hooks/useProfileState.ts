import { useState, useContext, useEffect } from 'react';
import AuthContext from '../contexts/AuthContext';
import ProfileContext from '../contexts/ProfileContext';
import { addProfile, getProfile, modifyProfile } from '../services/profile';
import useErrorState from './useErrorState';


export default function () {
    const { hasError, error, setError } = useErrorState();
    const {  userState } = useContext(AuthContext);
    const { user } = userState;
    const {  profileState, actions } = useContext(ProfileContext);
    const [nickname, setNickname] = useState<string>('');
    const registrable = nickname !=='' && user;
    const updatable = registrable && profileState.profile;

    useEffect(()=>{
        if(user){
            if(profileState.profile){
                setNickname(profileState.profile.nickname);
            }else{
                setNickname(user.name || '');
            }
        }
    },[user,profileState.profile]);

    const updateLocalProfile = ()=>{
        getProfile(user!, (profile)=>{
            actions.set!(profile);
        });
    };

    const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }
    const registerProfile = ()=>{
        if(registrable){
            addProfile(nickname, user!, updateLocalProfile, setError);
        }
    }

    const updateProfile = ()=>{
        if(updatable){
            modifyProfile({
                ...profileState.profile!,
                nickname
            }, updateLocalProfile, setError);
        }
    }

    return {
        onChangeNickname,
        nickname,
        registerProfile,
        error,
        hasError,
        registrable,
        updateProfile
    };
}