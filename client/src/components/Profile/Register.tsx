import React, { useState, useEffect, useContext } from 'react';
import Notification from './Notification';
import AuthContext from '../../contexts/AuthContext';
import ServiceContext from '../../contexts/ServiceContext';
import { useImageState, useNotifierState } from './useProfileState';
import Presenter from './Presenter';
import Avatar from './Avatar';


const RegisterProfile: React.FC<{
    renderSucceeded: () => React.ReactElement
}> = ({
    renderSucceeded
}) => {
        const {
            uploadProfileImage,
            imageFile,
            ...avatarProps
        } = useImageState();
        const {
            updateToken,
            enqueueSnackbar,
            ...notifierProps
        } = useNotifierState();

        const [nickname, setNickname] = useState('');
        const [succeeded, setSucceeded] = useState<boolean>(false);
        const { getProfile, addProfile, modifyProfile } = useContext(ServiceContext);
        const { userState } = useContext(AuthContext);
        const { user } = userState;
        const registrable = Boolean(nickname !== '' && user);
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
        }, [user, setSucceeded, getProfile]);

        const onSubmit = () => {
            if (registrable) {
                addProfile(nickname, user!, (profile) => {
                    if (imageFile) {
                        uploadProfileImage(profile.id, imageFile, (url) => {
                            modifyProfile({
                                ...profile,
                                imageUrl: url
                            }, () => {
                                enqueueSnackbar(`Succeeded register profile`, { variant: 'success' })
                                setSucceeded(true);
                                updateToken(profile.id);
                            })
                        }, (progress) => {
                            console.log(`progress:${progress}%`)
                        }, (error) => {
                            enqueueSnackbar(`Uploadimage error: ${error.message}`, { variant: 'error' });
                        })
                    } else {
                        enqueueSnackbar(`Succeeded register profile`, { variant: 'success' })
                        setSucceeded(true);
                        updateToken(profile.id);
                    }

                });
            }
        }

        if (succeeded) {
            return renderSucceeded();
        }
        return (
            <Presenter
                title='REGISTER YOUR PROFILE'
                onChangeNickname={(e) => {
                    setNickname(e.target.value);
                }}
                nickname={nickname}
                registrable={registrable}
                onSubmit={onSubmit}
                avatar={
                    <Avatar {...avatarProps} />
                }
                notification={
                    <Notification className='notification' {...notifierProps} />
                }
            />
        )
    }

export default RegisterProfile;