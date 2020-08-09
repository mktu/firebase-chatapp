import React, { useEffect, useContext, useState } from 'react';
import Notification from './Notification';
import ProfileContext from '../../contexts/ProfileContext';
import ServiceContext from '../../contexts/ServiceContext';
import { useImageState, useNotifierState } from './useProfileState';
import Presenter from './Presenter';
import Avatar from './Avatar';

const UpdateProfilePage: React.FC<{
    className?: string
}> = ({
    className
}) => {
        const {
            updateToken,
            enqueueSnackbar,
            ...notifierProps
        } = useNotifierState();
        const {
            uploadProfileImage,
            imageFile,
            imgUrl,
            ...avatarProps
        } = useImageState();
        const [nickname, setNickname] = useState('');
        const { profileState } = useContext(ProfileContext);
        const { profile } = profileState;
        const { modifyProfile } = useContext(ServiceContext);
        const margedUrl = imgUrl || profile?.imageUrl;
        const updatable = Boolean(nickname !== '' && profile);

        useEffect(() => {
            if (profile) {
                setNickname(profile.nickname || '');
            }
        }, [profile, setNickname]);

        const updateProfile = (imageUrl?: string) => {
            profile && modifyProfile({
                ...profile,
                nickname,
                imageUrl
            }, () => {
                updateToken(profile.id);
                enqueueSnackbar(`Succeeded update profile`, { variant: 'success' });
            });
        }

        const onSubmit = () => {
            if (imageFile && profile) {
                uploadProfileImage(profile.id, imageFile, (url) => {
                    updateProfile(url);
                }, (progress) => {
                    console.log(`progress:${progress}%`)
                }, (error) => {
                    enqueueSnackbar(`Uploadimage error: ${error.message}`, { variant: 'error' });
                })
            }
            else {
                updateProfile();
            }
        }
        return (
            <Presenter
                title='EDIT PROFILE'
                className={className}
                id={profile?.id}
                onChangeNickname={(e) => {
                    setNickname(e.target.value);
                }}
                nickname={nickname}
                registrable={updatable}
                onSubmit={onSubmit}
                avatar={
                    <Avatar {...avatarProps} imgUrl={margedUrl}/>
                }
                notification={
                    <Notification className='notification' {...notifierProps} />
                }
            />
        )
    }

export default UpdateProfilePage;