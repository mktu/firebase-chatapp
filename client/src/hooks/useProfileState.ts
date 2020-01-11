import { useState, useContext, useEffect } from 'react';
import AuthContext from '../contexts/AuthContext';
import ProfileContext from '../contexts/ProfileContext';
import { useLocation, useHistory } from "react-router-dom";
import { addProfile, getProfile, modifyProfile } from '../services/profile';
import useErrorState from './useErrorState';

const useCommonState = () => {
    const { setError, error, hasError } = useErrorState();
    const { userState } = useContext(AuthContext);
    const { user } = userState;
    const { actions, profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const [nickname, setNickname] = useState<string>('');
    const updateLocalProfile = () => {
        getProfile(user!, (profile) => {
            actions.set!(profile);
        });
    };
    const requesting = () =>{
        actions.loading();
    }
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
        updateLocalProfile,
        requesting
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
        profile,
        onChangeNickname,
        updateLocalProfile,
    } = useCommonState();
    const location = useLocation();
    const history = useHistory();

    const registrable = nickname !== '' && user;

    useEffect(() => {
        if (user) {
            setNickname(user.name || '');
        }
    }, [user,setNickname]);

    useEffect(() => {
        if (profile && location.state) {
            const { from } = location.state;
            const { pathname } = location;
            if (from && from.pathname !== pathname) {
                history.replace(from);
            }
            else {
                history.push('/');
            }
        }
    }, [profile,history,location])

    const registerProfile = () => {
        if (registrable) {
            addProfile(nickname, user!, updateLocalProfile, setError);
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
        updateLocalProfile,
        requesting
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
            }, updateLocalProfile, setError);
            requesting();
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