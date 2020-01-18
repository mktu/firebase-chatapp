import React from 'react';
import LoadingPage from '../LoadingPage';
import { useRoomStateFromCache, useRoomStateFromDb } from '../../hooks/useRoomLoaderState';
import { Room, } from '../../types/room';
import { LoadingStatus } from '../../constants';

type LoaderProps = {
    roomId: string,
    children: (room: Room) => JSX.Element,
    fallback: (roomId: string) => JSX.Element,
}

interface Props extends LoaderProps {
    useDb?: boolean
}

const CacheLoader: React.FC<LoaderProps> = ({
    roomId,
    children,
    fallback,
}) => {
    const { room, status } = useRoomStateFromCache({ roomId });
    if (status === LoadingStatus.Loading) {
        return <LoadingPage message='loading room' />;
    }
    if (status === LoadingStatus.Failed || !room) {
        return fallback(roomId);
    }
    return children(room);
}

const DbLoader: React.FC<LoaderProps> = ({
    roomId,
    children,
    fallback,
}) => {
    const { room, status } = useRoomStateFromDb({ roomId });
    if (status === LoadingStatus.Loading) {
        return <LoadingPage message='loading room' />;
    }
    if (status === LoadingStatus.Failed || !room) {
        return fallback(roomId);
    }
    return children(room);
}

const RoomLoader: React.FC<Props> = ({
    roomId,
    children,
    fallback,
    useDb = false
}) => {
    if (useDb) {
        return <DbLoader
            roomId={roomId}
            fallback={fallback}
            children={children}
        />
    }
    return <CacheLoader
        roomId={roomId}
        fallback={fallback}
        children={children}
    />
};

export default RoomLoader;