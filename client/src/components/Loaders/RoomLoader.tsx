import React, { useState, useContext, useEffect } from 'react';
import RoomContext from '../../contexts/RoomContext';
import LoadingPage from '../LoadingPage';
import { getRoom, registRoomListener } from '../../services/room';
import { Room } from '../../../../types/room';
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
    const [room, setRoom] = useState<Room>();
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const { roomState } = useContext(RoomContext);
    const { rooms } = roomState;

    useEffect(() => {
        const selectedRoom = rooms.find(r => r.id === roomId)
        if (!selectedRoom) {
            setStatus(LoadingStatus.Failed);
        }
        else{
            setRoom(selectedRoom);
            setStatus(LoadingStatus.Succeeded)
        }
    }, [rooms,roomId,setStatus]);

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
    const [room, setRoom] = useState<Room>();
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);

    useEffect(() => {
        let unsubscribe: ReturnType<typeof registRoomListener> = () => { }; 
        getRoom(roomId, (room) => {
            setRoom(room);
            setStatus(LoadingStatus.Succeeded);
            unsubscribe = registRoomListener(roomId, (modified)=>{
                setRoom(modified);
            })
        }, ()=>{
            setStatus(LoadingStatus.Failed);
        })
        return ()=>{
            unsubscribe();
        }
    }, [roomId,setStatus])

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