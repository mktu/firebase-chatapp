import React, { useState, useContext, useEffect } from 'react';
import { RoomContext, ProfileContext } from '../../contexts';
import { LoadingStatusType } from '../../constants';
import RoomDialog from '../RoomDialog';
import RoomList from './RoomList';
import RoomListItem from './RoomListItem';
import Presenter from './Presenter';
import ServiceContext from './ServiceContext';

export type Props = {
    children: React.ReactElement,
    currentRoomId?: string,
    handleLoadRoom: (roomId: string) => void
};

const Container: React.FC<Props> = ({ children, currentRoomId, handleLoadRoom }) => {
    const [showNewRoom, setShowNewRoom] = useState<boolean>(false);
    const [newRoomName, setNewRoomName] = useState<string>('');
    const [status, setStatus] = useState<LoadingStatusType>('loading');
    const { roomState, actions } = useContext(RoomContext);
    const { createRoom, registRoomsListener } = useContext(ServiceContext);
    const { rooms } = roomState;
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};

    useEffect(() => {
        let unsubscribe: ReturnType<typeof registRoomsListener> = () => { };
        if (profileId) {
            unsubscribe = registRoomsListener((rooms) => {
                actions.add(rooms);
                setStatus('succeeded');
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
    }, [profileId, actions, registRoomsListener]);

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
                loading={status === 'loading'}
                open={Boolean(currentRoomId)}
                renderRoomList={(style) => (
                    <RoomList
                        className={style}
                        showDialog={showDialog}
                        renderRoomListItem={(room) => (
                            <RoomListItem
                                key={room.id}
                                profileId={profileId!}
                                selected={room.id === currentRoomId}
                                room={room}
                                handleSelectRoom={({id}) => {
                                    handleLoadRoom(id);
                                }}
                            />
                        )}
                        rooms={rooms}
                    />
                )}
                chatroom={children}
            >
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