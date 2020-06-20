import React, { useState, useContext, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import ServiceContext from '../../contexts/ServiceContext';
import { useDropzone } from 'react-dropzone';
import { Token } from '../../../../types/notification';

export const useImageState = () => {
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({ noClick: true });

    const [image, setImage] = useState<File>();
    const imgUrl = (image && URL.createObjectURL(image)) || (acceptedFiles.length === 1 ? URL.createObjectURL(acceptedFiles[0]) : undefined);
    const imageFile = image || (acceptedFiles.length === 1 ? acceptedFiles[0] : undefined);
    const dropZoneInputProps = getInputProps();
    const dropZoneProps = getRootProps({ isDragActive, isDragAccept, isDragReject });
    const { uploadProfileImage } = useContext(ServiceContext);

    return {
        dropZoneInputProps,
        dropZoneProps,
        imgUrl,
        setImage,
        imageFile,
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
