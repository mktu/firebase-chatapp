import React, { useCallback, useState, useEffect } from 'react';
import { Room, JoinRequest } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import UsersDialog from '../UsersDialog';
import RequestsDialog from '../RequestsDialog';
import HeaderPresenter from './Presenter';

const HeaderContainer: React.FC<{
    room: Room,
    profiles: Profile[],
    requests: JoinRequest[],
    owenr : boolean,
    modifyRoom:(room:Room)=>void,
    updateRequest:(roomId:string,request:JoinRequest)=>void
    className?: string,
}> = ({
    className,
    profiles,
    room,
    owenr,
    requests,
    modifyRoom,
    updateRequest
}) => {
        const [showUserEditor, setShowUserEditor] = useState(false);
        const [showRequests, setShowRequests] = useState(false);
        const [nameEditable,setNameEditable] = useState(false);
        const [roomName,setRoomName] = useState(room.roomName);

        useEffect(()=>{
            setRoomName(room.roomName)
        },[room.roomName]);


        const handleAcceptRequest = (request: JoinRequest) => {
            updateRequest(room.id,
                {
                    ...request,
                    status: 'accepted'
                });
            modifyRoom({
                ...room,
                users: [...room.users, request.profileId]
            });
        }
        const handleRejectRequest = (request: JoinRequest) => {
            updateRequest(room.id,
                {
                    ...request,
                    status: 'rejected'
                });
        }

        const onDelete = useCallback((profileId: string) => {
            modifyRoom({
                ...room,
                users: profiles.filter(p => p.id !== profileId).map(p => p.id)
            })
        }, [profiles,room,modifyRoom]);

        return (
            <React.Fragment>
                <HeaderPresenter 
                    nameEditable={nameEditable}
                    roomName={roomName}
                    profiles={profiles}
                    className={className}
                    owner={owenr}
                    onChangeRoomName={setRoomName}
                    requestCount={requests.length}
                    onClickRequest={()=>{
                        setShowRequests(true);
                    }}
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
                {owenr && (
                    <RequestsDialog
                        show={showRequests && owenr}
                        requests={requests}
                        handleAcceptRequest={handleAcceptRequest}
                        handleRejectRequest={handleRejectRequest}
                        onClose={() => {
                            setShowRequests(false);
                        }}
                    />
                )}
                <UsersDialog
                    show={showUserEditor}
                    onDelete={onDelete}
                    owner={owenr}
                    profiles={profiles}
                    onClose={() => {
                        setShowUserEditor(false);
                    }}
                />
            </React.Fragment>
        )
    };

export default HeaderContainer;