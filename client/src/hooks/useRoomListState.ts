import { useState, useContext } from 'react';
import RoomContext from '../contexts/RoomContext';
import ProfileContext from '../contexts/ProfileContext';
import { createRoom } from '../services/room';


export default function () {
    const [showNewRoom, setShowNewRoom] = useState<boolean>(false);
    const [newRoomName, setNewRoomName] = useState<string>('');
    const { roomState } = useContext(RoomContext);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};

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
    return {
        showNewRoom,
        hideDialog,
        showDialog,
        roomState,
        handleEditNewRoomName,
        newRoomName,
        handleCreateNewRoom,
    }
}