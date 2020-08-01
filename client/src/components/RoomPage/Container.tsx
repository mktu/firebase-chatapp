import React, { useState, useContext, useEffect } from 'react';
import { RoomContext, ProfileContext } from '../../contexts';
import { LoadingStatusType } from '../../constants';
import RoomDialog from '../RoomDialog';
import RoomList from './RoomList';
import RoomListItem from './RoomListItem';
import ContactItem from './ContactItem';
import Presenter from './Presenter';
import { Room } from '../../../../types/room';
import ServiceContext from '../../contexts/ServiceContext';

export type Props = {
    renderChatRoom: (room: Room) => React.ReactElement,
    renderRequestRoom: (roomId: string) => React.ReactElement,
    currentRoomId?: string,
    handleLoadRoom: (roomId: string) => void,
    handleLoadContactRoom: (roomId: string) => void
};

const Container: React.FC<Props> = ({
    currentRoomId,
    handleLoadRoom,
    renderChatRoom,
    renderRequestRoom,
    handleLoadContactRoom
}) => {
    const [showNewRoom, setShowNewRoom] = useState<boolean>(false);
    const [newRoomName, setNewRoomName] = useState<string>('');
    const [status, setStatus] = useState<LoadingStatusType>('loading');
    const [error,setError] = useState<string>();
    const [needRequest, setNeedRequest] = useState(false);
    const { roomState, actions } = useContext(RoomContext);
    const { createRoom, registRoomsListener, createContact, getRoom } = useContext(ServiceContext);
    const { rooms } = roomState;
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};
    useEffect(()=>{
        const hasRoom = Boolean(currentRoomId) && !Boolean(rooms.find(r => r.id === currentRoomId));
        if(!hasRoom && currentRoomId && profileId){
            getRoom(currentRoomId,(room)=>{
                if(!room.users.includes(profileId)){
                    setNeedRequest(true);
                }
            },(error)=>{
                console.error(error)
                setError(`Room not found`);
            })
        }
    },[currentRoomId,getRoom, rooms, profileId])
    
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
                showRoom={Boolean(currentRoomId) && status === 'succeeded'}
                error={error}
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
                        renderContactListItem={(contact) => (
                            <ContactItem
                                key={contact.id}
                                contact={contact}
                                selected={contact.roomId === currentRoomId}
                                handleSelectContact={({roomId})=>{
                                    if(!roomId){
                                        setStatus('loading')
                                        if(!profileId){
                                            console.error('my profileId is undefined')
                                            return;
                                        }
                                        createContact(profileId, contact.id, (roomId)=>{
                                            setStatus('succeeded');
                                            handleLoadContactRoom(roomId);
                                        })
                                        return;
                                    }
                                    handleLoadContactRoom(roomId);
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