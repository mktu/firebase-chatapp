import { useState, useContext, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
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
    const { enqueueSnackbar } = useSnackbar();
    
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
            token && saveToken(profileId, token, ()=>{
                console.log('Token saved successfully');
            }, (error)=>{
                console.error(error);
                enqueueSnackbar('An error occurred while saving token',{variant:'error'});
            });
        }else{
            token && deleteToken(token, ()=>{
                console.log('Token deleted successfully');
            },(error)=>{
                console.error(error);
                enqueueSnackbar('An error occurred while deleting token',{variant:'error'});
            });
        }
    },[token,notifiable,enqueueSnackbar]);
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
        updateToken,
        enqueueSnackbar
    }
}

export function useRegisterProfileState() {
    const {
        nickname,
        setNickname,
        setError,
        user,
        updateToken,
        enqueueSnackbar,
        ...other
    } = useCommonState();
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const registrable = nickname !== '' && user;
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
    }, [user,setSucceeded]);

    const registerProfile = () => {
        if (registrable) {
            addProfile(nickname, user!, (profile) => {
                enqueueSnackbar(`Succeeded register profile`,{variant:'success'})
                setSucceeded(true);
                updateToken(profile.id);
            }, setError);
        }
    }

    return {
        nickname,
        registerProfile,
        registrable,
        succeeded,
        ...other
    };
}

export function useUpdateProfileState() {
    const {
        nickname,
        setNickname,
        setError,
        updateToken,
        enqueueSnackbar,
        ...other
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
                enqueueSnackbar(`Succeeded update profile`,{variant:'success'});
            }, setError);
        }
    }

    return {
        nickname,
        updatable,
        updateProfile,
        ...other
    };
}