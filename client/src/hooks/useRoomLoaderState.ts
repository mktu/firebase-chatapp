import { useState, useContext, useEffect } from 'react';
import RoomContext from '../contexts/RoomContext';
import { getRoom, registRoomListener } from '../services/room';
import { LoadingStatus } from '../constants';
import { Room } from '../types/room';

type Props = {
    roomId: string,
}

export const useRoomStateFromCache = ({ roomId }: Props) => {
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
    }, [rooms,roomId,setStatus])

    return {
        room,
        status
    }
}

export const useRoomStateFromDb = ({ roomId }: Props) => {
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

    return {
        room,
        status
    }
}