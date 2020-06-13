import React, { useState, useContext, useEffect } from 'react';
import { RoomContext, ProfileContext } from '../../contexts';
import { LoadingStatusType } from '../../constants';
import RoomDialog from '../RoomDialog';
import RoomList from './RoomList';
import RoomListItem from './RoomListItem';
import Presenter from './Presenter';
import { Room } from '../../../../types/room';
import ServiceContext from '../../contexts/ServiceContext';

export type Props = {
    renderChatRoom: (room: Room) => React.ReactElement,
    renderRequestRoom: (roomId:string) => React.ReactElement,
    currentRoomId?: string,
    handleLoadRoom: (roomId: string) => void
};

const Container: React.FC<Props> = ({
    currentRoomId,
    handleLoadRoom,
    renderChatRoom,
    renderRequestRoom
}) => {
    const [showNewRoom, setShowNewRoom] = useState<boolean>(false);
    const [newRoomName, setNewRoomName] = useState<string>('');
    const [status, setStatus] = useState<LoadingStatusType>('loading');
    const { roomState, actions } = useContext(RoomContext);
    const { createRoom, registRoomsListener } = useContext(ServiceContext);
    const { rooms } = roomState;
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};
    const needRequest = status !== 'loading' && currentRoomId && !Boolean(rooms.find(r => r.id === currentRoomId));

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
    if (needRequest && currentRoomId) {
        return renderRequestRoom(currentRoomId);
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
                        currentRoomId={currentRoomId}
                        renderRoomListItem={(room) => (
                            <RoomListItem
                                key={room.id}
                                selected={room.id === currentRoomId}
                                room={room}
                                handleSelectRoom={({ id }) => {
                                    handleLoadRoom(id);
                                }}
                            />
                        )}
                        rooms={rooms}
                    />
                )}
                chatrooms={<React.Fragment>
                    {rooms.map(r => renderChatRoom(r))}
                </React.Fragment>}
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