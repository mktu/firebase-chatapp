import React, { useContext, useState, useEffect } from 'react';
import { Room, JoinRequest } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import ProfileContext from '../../../contexts/ProfileContext';
import { modifyRoom } from '../../../services/room';
import UsersDialog from '../UsersDialog';
import RequestsDialog from '../RequestsDialog';
import HeaderPresenter from './Presenter';

const HeaderContainer: React.FC<{
    room: Room,
    profiles: Profile[],
    requests: JoinRequest[],
    className?: string,
}> = ({
    className,
    profiles,
    room,
    requests
}) => {
        const [showUserEditor, setShowUserEditor] = useState(false);
        const [showRequests, setShowRequests] = useState(false);
        const [nameEditable,setNameEditable] = useState(false);
        const [roomName,setRoomName] = useState(room.roomName);
        useEffect(()=>{
            setRoomName(room.roomName)
        },[room.roomName])
        const { profileState } = useContext(ProfileContext);
        const { profile } = profileState;
        const isOwner = profile?.id === room.ownerId;
        return (
            <React.Fragment>
                <HeaderPresenter 
                    nameEditable={nameEditable}
                    roomName={roomName}
                    profiles={profiles}
                    className={className}
                    owner={isOwner}
                    onChangeRoomName={setRoomName}
                    requestCount={requests.length}
                    onClickEditName={(editable)=>{
                        setNameEditable(editable);
                        if(!editable && roomName!==room.roomName){
                            modifyRoom({
                                ...room,
                                roomName : roomName
                            });
                        }
                    }}
                    onClickShowMoreUser={()=>{
                        setShowUserEditor(true);
                    }}
                />
                {isOwner && (
                    <RequestsDialog
                        show={showRequests && isOwner}
                        requests={requests}
                        room={room}
                        onClose={() => {
                            setShowRequests(false);
                        }}
                    />
                )}
                <UsersDialog
                    show={showUserEditor}
                    room={room}
                    owner={isOwner}
                    profiles={profiles}
                    onClose={() => {
                        setShowUserEditor(false);
                    }}
                />
            </React.Fragment>
        )
    };

export default HeaderContainer;