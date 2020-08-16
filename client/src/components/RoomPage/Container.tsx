import React, { useState, useContext, useEffect } from 'react';
import { RoomContext, ProfileContext } from '../../contexts';
import { LoadingStatusType } from '../../constants';
import RoomDialog from './RoomDialog';
import RoomList from './RoomList';
import RoomListItem from './RoomListItem';
import ContactItem from './ContactItem';
import Sidebar from './Sidebar';
import Presenter from './Presenter';
import { Room } from '../../../../types/room';
import ServiceContext from '../../contexts/ServiceContext';
import ContactList from './ContactList';
import { AddContactContainer, AddContactDialog } from './AddContact';

export type Props = {
    renderChatRoom: (room: Room) => React.ReactElement,
    requestRoom?: React.ReactElement,
    currentRoomId?: string,
    handleLoadRoom: (roomId?: string) => void,
    handleLoadContactRoom: (roomId?: string) => void,
    handleRequest: (roomId: string) => void,
    handleRemovedContact: (roomId: string) => void,
    isContact: boolean
};

const Container: React.FC<Props> = ({
    currentRoomId,
    handleLoadRoom,
    renderChatRoom,
    requestRoom,
    handleLoadContactRoom,
    handleRequest,
    handleRemovedContact,
    isContact
}) => {
    const [showNewRoom, setShowNewRoom] = useState(false);
    const [showAddCOntact, setShowAddContact] = useState(false);
    const [newRoomName, setNewRoomName] = useState<string>('');

    const [status, setStatus] = useState<LoadingStatusType>('loading');
    const [error, setError] = useState<string>();
    const { roomState, actions } = useContext(RoomContext);
    const { createRoom, registRoomsListener, createContact, getRoom } = useContext(ServiceContext);
    const { rooms } = roomState;
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};
    useEffect(() => {
        const hasRoom = Boolean(currentRoomId) && Boolean(rooms.find(r => r.id === currentRoomId));

        if (!hasRoom && currentRoomId && profileId) {
            getRoom(currentRoomId, (room) => {
                if (room.contact && !room.users.includes(profileId)) {
                    handleRemovedContact(currentRoomId);
                }
                else if (!room.users.includes(profileId)) {
                    handleRequest(currentRoomId);
                }
            }, (error) => {
                console.error(error)
                setError(`Room not found`);
            })
        }
    }, [currentRoomId, getRoom, rooms, profileId, handleRequest, handleRemovedContact])

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
                showRoom={Boolean(currentRoomId) && status === 'succeeded'}
                error={error}
                request={requestRoom}
                sidebar={
                    <Sidebar selected={isContact ? 'contact' : 'room'} onSelect={(selected) => {
                        if (selected === 'contact') {
                            handleLoadContactRoom();
                        } else {
                            handleLoadRoom();
                        }
                    }} />
                }
                roomList={
                    isContact ?
                        <ContactList
                            showAddContact={() => {
                                setShowAddContact(true);
                            }}
                            renderContactListItem={(contact) => (
                                <ContactItem
                                    key={contact.id}
                                    contact={contact}
                                    selected={contact.roomId === currentRoomId}
                                    handleSelectContact={({ roomId }) => {
                                        if (!roomId) {
                                            setStatus('loading')
                                            if (!profileId) {
                                                console.error('my profileId is undefined')
                                                return;
                                            }
                                            createContact(profileId, contact.id, (roomId) => {
                                                setStatus('succeeded');
                                                handleLoadContactRoom(roomId);
                                            })
                                            return;
                                        }
                                        handleLoadContactRoom(roomId);
                                    }}
                                />
                            )}
                        /> :
                        <RoomList
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
                }
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
            <AddContactDialog show={showAddCOntact} onClose={() => {
                setShowAddContact(false);
            }}>
                <AddContactContainer
                    onClose={() => {
                        setShowAddContact(false);
                    }}
                />
            </AddContactDialog>
        </React.Fragment>
    )
};

export default Container;