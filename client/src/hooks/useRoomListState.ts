import { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import RoomContext from '../contexts/RoomContext';
import ProfileContext from '../contexts/ProfileContext';
import { createRoom } from '../services/room';
import { Room } from '../types/room';


export default function () {
    const [showNewRoom, setShowNewRoom] = useState<boolean>(false);
    const [newRoomName, setNewRoomName] = useState<string>('');
    const { roomState } = useContext(RoomContext);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};
    const history = useHistory();

    const hideDialog = () => {
        setShowNewRoom(false);
    }
    const showDialog = () => {
        setShowNewRoom(true);
    }
    const handleEditNewRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewRoomName(e.target.value);
    }
    const handleCreateNewRoom = () => {
        if (profileId) {
            createRoom(
                newRoomName,
                profileId,
                () => {
                    console.log(`Created ${newRoomName} room.`);
                }
            );
            hideDialog();
        }
    }
    const handleSelectRoom = (room: Room) => {
        history.push(`/rooms/${room.id}`);
    }
    return {
        showNewRoom,
        hideDialog,
        showDialog,
        roomState,
        handleSelectRoom,
        handleEditNewRoomName,
        newRoomName,
        handleCreateNewRoom,
    }
}