import React, { useState, useContext, useEffect } from 'react';
import { RoomContext, ProfileContext } from '../../contexts';
import { LoadingStatusType } from '../../constants';
import { AddRoomContainer, AddRoomDialog } from './AddRoomDialog';
import RoomList from './RoomList';
import RoomListItem from './RoomListItem';
import ContactItem from './ContactItem';
import Sidebar from './Sidebar';
import Presenter from './Presenter';
import { Room } from '../../../../types/room';
import ServiceContext from '../../contexts/ServiceContext';
import ContactList from './ContactList';
import { ContactContext } from '../../contexts/ProfileContext';
import SidebarContext from '../../contexts/SidebarContext';
import { AddContactContainer, AddContactDialog } from './AddContactDialog';
import RoomHome from './RoomHome';

export type Props = {
    renderChatRoom: (room: Room) => React.ReactElement,
    requestRoom?: React.ReactElement,
    currentRoomId?: string,
    handleLoadRoom: (roomId?: string) => void,
    handleLoadContactRoom: (roomId?: string) => void,
    handleRequest: (roomId: string) => void,
    handleRemovedContact: (roomId: string) => void,
    isContact: boolean,
    isRoomHome: boolean
};

const Container: React.FC<Props> = ({
    currentRoomId,
    handleLoadRoom,
    renderChatRoom,
    requestRoom,
    handleLoadContactRoom,
    handleRequest,
    handleRemovedContact,
    isContact,
    isRoomHome
}) => {
    const [showNewRoom, setShowNewRoom] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);

    const [status, setStatus] = useState<LoadingStatusType>('loading');
    const [error, setError] = useState<string>();
    const { roomState, actions } = useContext(RoomContext);
    const { sidebarState, actions : sidebarActions } = useContext(SidebarContext);
    const contacts = useContext(ContactContext);
    const { registRoomsListener, getRoom } = useContext(ServiceContext);
    const { rooms } = roomState;
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};
    const defaultContact = contacts.find(c => c.id === profileId);
    const matchContact = Boolean(contacts.find(c => c.roomId === currentRoomId))
    useEffect(() => {
        if (isRoomHome) {
            const lastRoomId = localStorage.getItem("lastRoom");
            lastRoomId && handleLoadRoom(lastRoomId)
        }
    }, [isRoomHome, handleLoadRoom])
    useEffect(() => {
        if (isContact) {
            if (!matchContact) {
                const lastContactId = localStorage.getItem("lastContact");
                if (lastContactId && Boolean(contacts.find(c=>c.roomId === lastContactId))) {
                    handleLoadContactRoom(lastContactId)
                } else if (defaultContact && defaultContact.enable) {
                    handleLoadContactRoom(defaultContact.roomId)
                }
            }
        }
    }, [isContact, matchContact, defaultContact, handleLoadContactRoom, contacts])
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

    return (
        <React.Fragment>
            <Presenter
                loading={status === 'loading'}
                showSidebar={sidebarState.open}
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
                roomHome={isRoomHome ? <RoomHome handleLoadContact={handleLoadContactRoom} handleLoadRoom={handleLoadRoom} /> : undefined}
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
                                        handleLoadContactRoom(roomId);
                                        sidebarActions.show(false);
                                    }}
                                />
                            )}
                        /> :
                        <RoomList
                            showDialog={showDialog}
                            renderRoomListItem={(room) => (
                                <RoomListItem
                                    key={room.id}
                                    selected={room.id === currentRoomId}
                                    room={room}
                                    handleSelectRoom={({ id }) => {
                                        handleLoadRoom(id);
                                        sidebarActions.show(false);
                                    }}
                                />
                            )}
                            rooms={rooms}
                        />
                }
                chatrooms={<React.Fragment>
                    {rooms.map(r => renderChatRoom(r))}
                </React.Fragment>}
            />
            <AddRoomDialog
                show={showNewRoom}
                onClose={hideDialog}
            >
                <AddRoomContainer
                    onClose={hideDialog}
                />
            </AddRoomDialog>
            <AddContactDialog show={showAddContact} onClose={() => {
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