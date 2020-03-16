import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Room, JoinRequest } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import ProfileContext from '../../../contexts/ProfileContext';
import { modifyRoom } from '../../../services/room';
import { updateRequest } from '../../../services/request';
import { RequestStatus } from '../../../constants';
import Users from './Users';
import UserEditor from '../UserEditor';
import Requests from './Requests';


const Wrapper = styled.div`
    & > .opened-header{
        display : flex;
        align-items : center;
        justify-content : space-between;
    }
`;

const ChatRoomHeader: React.FC<{
    room: Room,
    profiles: Profile[],
    className?: string,
}> = ({
    className,
    profiles,
    room
}) => {
        const [showUserEditor, setShowUserEditor] = useState(false);
        const { profileState } = useContext(ProfileContext);
        const { profile } = profileState;
        const isOwner = profile?.id === room.ownerId;

        const handleAcceptRequest = (request: JoinRequest) => {
            updateRequest(room.id,
                {
                    ...request,
                    status: RequestStatus.Accepted
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
                    status: RequestStatus.Rejected
                });
        }

        return (
            <Wrapper className={className} >
                <div className='opened-header'>
                    <Typography variant='h6' >{room.roomName}</Typography>
                    <Users onClickMore={() => {
                        setShowUserEditor(true);
                    }} className='room-header-users' profiles={profiles} />
                </div>
                {isOwner && (
                    <Requests
                        roomId={room.id}
                        handleAcceptRequest={handleAcceptRequest}
                        handleRejectRequest={handleRejectRequest}
                    />
                )}
                <UserEditor
                    show={showUserEditor}
                    room={room}
                    owner={isOwner}
                    profiles={profiles}
                    onClose={() => {
                        setShowUserEditor(false);
                    }}
                />
            </Wrapper>
        )
    };

export default ChatRoomHeader;