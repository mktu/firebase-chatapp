import { useState, useContext, useEffect, useCallback } from 'react';
import AuthContext from '../../contexts/AuthContext';
import ProfileContext from '../../contexts/ProfileContext';
import { addProfile, getProfile, modifyProfile } from '../../services/profile';
import { deleteToken, saveToken } from '../../services/notification';
import useErrorState from '../../hooks/useErrorState';
import { Token } from '../../../../types/notification';

const useCommonState = () => {
    const { setError, error, hasError } = useErrorState();
    const { userState } = useContext(AuthContext);
    const { user } = userState;
    const [nickname, setNickname] = useState('');
    const [notifiable, setNotifiable] = useState(false);
    const [token,setToken] = useState<string>();
    
    const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }
    const onSwitchNotifiable = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setNotifiable(true);
        } else {
            setNotifiable(false);
        }
    }
    const onLoadToken = useCallback((rawToken:string, token?:Token) => {
        setToken(rawToken);
        if(token){
            setNotifiable(true);
        }
    },[]);
    const updateToken = useCallback((profileId:string)=>{
        if(notifiable){
            token && saveToken(profileId, token);
        }else{
            token && deleteToken(token);
        }
    },[token,notifiable]);
    return {
        nickname,
        setNickname,
        onChangeNickname,
        setError,
        error,
        hasError,
        user,
        onSwitchNotifiable,
        notifiable,
        onLoadToken,
        updateToken
    }
}

export function useRegisterProfileState() {
    const {
        nickname,
        setNickname,
        setError,
        error,
        hasError,
        user,
        onChangeNickname,
        onSwitchNotifiable,
        notifiable,
        onLoadToken,
        updateToken
    } = useCommonState();

    const registrable = nickname !== '' && user;
    const [succeeded, setSucceeded] = useState<boolean>(false);
    useEffect(() => {
        if (user) {
            setNickname(user.name || '');
        }
    }, [user, setNickname]);

    useEffect(() => {
        if (user) {
            getProfile(user, (prof) => {
                if (prof.uid === user.uid) {
                    setSucceeded(true);
                }
            }, () => {
                console.log('Profile is not registered');
            })
        }
    }, [user]);

    const registerProfile = () => {
        if (registrable) {
            addProfile(nickname, user!, (profile) => {
                console.log(`succeeded register profile "${nickname}"`);
                setSucceeded(true);
                updateToken(profile.id);
            }, setError);
        }
    }

    return {
        onChangeNickname,
        nickname,
        registerProfile,
        error,
        hasError,
        registrable,
        succeeded,
        notifiable,
        onLoadToken,
        onSwitchNotifiable
    };
}

export function useUpdateProfileState() {
    const {
        nickname,
        setNickname,
        setError,
        error,
        hasError,
        onChangeNickname,
        onSwitchNotifiable,
        notifiable,
        onLoadToken,
        updateToken
    } = useCommonState();
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;

    const updatable = nickname !== '' && profile;

    useEffect(() => {
        if (profile) {
            setNickname(profile.nickname || '');
        }
    }, [profile, setNickname]);

    const updateProfile = () => {
        if (updatable) {
            modifyProfile({
                ...profile!,
                nickname
            }, () => {
                updateToken(profile!.id);
                console.log(`succeeded modify profile "${nickname}"`);
            }, setError);
        }
    }

    return {
        onChangeNickname,
        nickname,
        error,
        hasError,
        updatable,
        updateProfile,
        onSwitchNotifiable,
        notifiable,
        onLoadToken,
    };
}