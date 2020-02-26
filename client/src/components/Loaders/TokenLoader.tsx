import React, { useContext, useEffect } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { requestPermission, getToken, onTokenRefresh, saveToken } from '../../services/notification';
import { consoleError } from '../../utils';
type Props = {
    children: JSX.Element,
}

const TokenLoader: React.FC<Props> = ({
    children,
}) => {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    useEffect(() => {
        requestPermission(() => {
            getToken((token) => {
                profile && saveToken(profile.id, token);
            }, consoleError);
            onTokenRefresh((token) => {
                profile && saveToken(profile.id, token);
            })
        }, consoleError)
    }, [profile]);

    return children;
};

export default TokenLoader;