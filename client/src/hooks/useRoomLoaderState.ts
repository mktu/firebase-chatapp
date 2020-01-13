import { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import RoomContext from '../contexts/RoomContext';
import { Room } from '../types/room';

type Props = {
    roomId: string,
}

export default function ({ roomId }: Props) {
    const [room, setRoom] = useState<Room>();
    const { roomState } = useContext(RoomContext);
    const { rooms } = roomState;
    const history = useHistory();

    useEffect(() => {
        const selectedRoom = rooms.find(r => r.id === roomId)
        if (!selectedRoom) {
            history.replace(`/rooms/requests/${roomId}`);
        }
        else{
            setRoom(selectedRoom);
        }
    }, [rooms,history,roomId])

    return {
        room
    }
}