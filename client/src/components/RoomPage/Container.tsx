import React, { useState, useContext } from 'react';
import RoomContext from '../../contexts/RoomContext';
import ProfileContext from '../../contexts/ProfileContext';
import { createRoom } from '../../services/room';
import RoomDialog from '../RoomDialog';
import RoomList from './RoomList';
import Presenter from './Presenter';


type Props = {
    children: React.ReactElement,
    currentRoomId?: string,
    handleLoadRoom: (roomId: string) => void
};

const Container: React.FC<Props> = ({ children, currentRoomId, handleLoadRoom }) => {
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
    return (
        <React.Fragment>
            <Presenter
                open={Boolean(currentRoomId)}
                renderRoomList={(style) => (
                    <RoomList
                        className={style}
                        showDialog={showDialog}
                        handleSelectRoom={(room) => {
                            handleLoadRoom(room.id);
                        }}
                        rooms={roomState.rooms}
                        currentRoomId={currentRoomId}
                    />
                )}
            >
                {children}
            </Presenter>
            <RoomDialog
                show={showNewRoom}
                onClose={hideDialog}
                handleChangeRoomName={handleEditNewRoomName}
                roomName={newRoomName}
                onSave={handleCreateNewRoom} />
        </React.Fragment>
    )
};

export default Container;