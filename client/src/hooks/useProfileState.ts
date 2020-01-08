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
    return {
        nickname,
        setNickname,
        setError,
        error,
        hasError,
        user,
        profile,
        updateLocalProfile
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
        updateLocalProfile,
    } = useCommonState();
    const location = useLocation();
    const history = useHistory();

    const registrable = nickname !== '' && user;
    const updatable = registrable && profile;

    useEffect(() => {
        if (user) {
            setNickname(user.name || '');
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            const { from } = location.state;
            const { pathname } = location;
            if (from && from.pathname !== pathname) {
                history.replace(from);
            }
            else {
                history.push('/');
            }
        }
    }, [profile])


    const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }
    const registerProfile = () => {
        if (registrable) {
            addProfile(nickname, user!, updateLocalProfile, setError);
        }
    }

    const updateProfile = () => {
        if (updatable) {
            modifyProfile({
                ...profile!,
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