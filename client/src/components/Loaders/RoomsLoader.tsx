import React, { useState, useContext, useEffect } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import RoomContext from '../../contexts/RoomContext';
import LoadingPage from '../LoadingPage';
import { registRoomsListener } from '../../services/room';
import { LoadingStatus } from '../../constants';

type Props = {
    children: JSX.Element,
}

const RoomsLoader: React.FC<Props> = ({
    children,
}) => {
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const { actions } = useContext(RoomContext);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};

    useEffect(() => {
        let unsubscribe: ReturnType<typeof registRoomsListener> = () => { };
        if (profileId) {
            unsubscribe = registRoomsListener((rooms) => {
                actions.add(rooms);
                setStatus(LoadingStatus.Succeeded);
            }, (rooms) => {
                actions.modify(rooms);
            }, (rooms) => {
                actions.delete(rooms);
            }, profileId);
        }
        return () => {
            actions.init();
            unsubscribe();
        };
    }, [profileId, actions]);

    if (status === LoadingStatus.Loading) {
        return <LoadingPage message='loading rooms' />;
    }
    return children;
};

export default RoomsLoader;