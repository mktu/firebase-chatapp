import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import useOwnerState from './useOwnerState';
import Requests from './Requests';
import Users from './Users';
import Messages from './Messages';
import Input from './Input';

const Wrapper = styled.div`
    & > .room-header{
        display : flex;
        align-items : center;
        justify-content : space-between;
    }
    & > .room-messages {
        border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
        height : 60vh;
        border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
        margin-top : ${({ theme }) => `${theme.spacing(2)}px`};
        margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const ChatRoom: React.FC<{
    room: Room,
    profiles: Profile[],
    className?: string,
}> = ({
    className,
    profiles,
    room
}) => {
        const {
            handleAcceptRequest,
            handleRejectRequest,
            isOwner
        } = useOwnerState(room);

        return (
            <Wrapper className={className} >
                <div className='room-header'>
                    <Typography>{room.roomName}</Typography>
                    <Users className='room-header-users' profiles={profiles} />
                </div>
                {isOwner && (
                    <Requests
                        roomId={room.id}
                        handleAcceptRequest={handleAcceptRequest}
                        handleRejectRequest={handleRejectRequest}
                    />
                )}
                <Messages className='room-messages' roomId={room.id} profiles={profiles} />
                <Input
                    className='room-input'
                    suggestionCandidates={profiles}
                    roomId={room.id}
                />
            </Wrapper>
        )
    };

export default ChatRoom;