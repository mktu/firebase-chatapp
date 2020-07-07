import React, { useState, useContext, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import ServiceContext from '../../contexts/ServiceContext';
import { Token } from '../../../../types/notification';
import useDropImageState from '../../hooks/useDropImageState';

export const useImageState = () => {
    const dropImageProps = useDropImageState();
    const { uploadProfileImage } = useContext(ServiceContext);

    return {
        ...dropImageProps,
        uploadProfileImage
    }
}

export const useNotifierState = () => {
    const { deleteToken, saveToken } = useContext(ServiceContext);
    const [notifiable, setNotifiable] = useState<'disabled'|'init'|'enabled'>('init');
    const [token, setToken] = useState<string>();
    const { enqueueSnackbar } = useSnackbar();

    const onSwitchNotifiable = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setNotifiable('enabled');
        } else {
            setNotifiable('disabled');
        }
    }
    const onLoadToken = useCallback((rawToken: string, token?: Token) => {
        setToken(rawToken);
        if (token) {
            setNotifiable('enabled');
        }
    }, []);
    const updateToken = useCallback((profileId: string) => {
        if (notifiable === 'enabled') {
            token && saveToken(profileId, token, () => {
                console.log('Token saved successfully');
            }, (error) => {
                console.error(error);
                enqueueSnackbar('An error occurred while saving token', { variant: 'error' });
            });
        } else if(notifiable === 'disabled'){
            token && deleteToken(token, () => {
                console.log('Token deleted successfully');
            }, (error) => {
                console.error(error);
                enqueueSnackbar('An error occurred while deleting token', { variant: 'error' });
            });
        }
    }, [token, notifiable, enqueueSnackbar, deleteToken, saveToken]);


    return {
        onLoadToken,
        onSwitchNotifiable,
        notifiable : notifiable === 'enabled',
        updateToken,
        enqueueSnackbar,
    }
}
