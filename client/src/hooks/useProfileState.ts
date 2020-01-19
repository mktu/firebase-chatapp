import { useState, useContext, useEffect } from 'react';
import AuthContext from '../contexts/AuthContext';
import ProfileContext from '../contexts/ProfileContext';
import { addProfile, modifyProfile } from '../services/profile';
import useErrorState from './useErrorState';

const useCommonState = () => {
    const { setError, error, hasError } = useErrorState();
    const { userState } = useContext(AuthContext);
    const { user } = userState;
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const [nickname, setNickname] = useState<string>('');
    const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }
    return {
        nickname,
        setNickname,
        onChangeNickname,
        setError,
        error,
        hasError,
        user,
        profile,
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
    } = useCommonState();

    const registrable = nickname !== '' && user;

    useEffect(() => {
        if (user) {
            setNickname(user.name || '');
        }
    }, [user,setNickname]);

    const registerProfile = () => {
        if (registrable) {
            addProfile(nickname, user!, ()=>{
                console.log(`succeeded register profile "${nickname}"`)
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
    };
}

export function useUpdateProfileState() {
    const {
        nickname,
        setNickname,
        setError,
        error,
        hasError,
        profile,
        onChangeNickname,
    } = useCommonState();

    const updatable = nickname !== '' && profile;

    useEffect(() => {
        if (profile) {
            setNickname(profile.nickname || '');
        }
    }, [profile,setNickname]);

    const updateProfile = () => {
        if (updatable) {
            modifyProfile({
                ...profile!,
                nickname
            }, ()=>{
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
        updateProfile
    };
}