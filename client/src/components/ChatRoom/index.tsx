import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import useOwnerState from './useOwnerState';
import Requests from './Requests';
import UsersBase from './Users';
import MessagesBase from './Messages';
import Input from './Input';

type Props = {
    room: Room,
    profiles: Profile[],
    className?: string,
};

const RoomHeader = styled.div`
    display : flex;
    align-items : center;
    justify-content : space-between;
`;

const Users = styled(UsersBase)`
    margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
`

const Messages = styled(MessagesBase)`
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    height : 60vh;
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    margin-top : ${({ theme }) => `${theme.spacing(2)}px`};
    overflow : auto;
`;

export default ({ className, profiles, room }: Props) => {
    const {
        handleAcceptRequest,
        handleRejectRequest,
        isOwner
    } = useOwnerState(room);

    return (
        <div className={className} >
            <RoomHeader>
                <Typography>{room.roomName}</Typography>
                <Users profiles={profiles} />
            </RoomHeader>
            {isOwner && (
                <Requests
                    roomId={room.id}
                    handleAcceptRequest={handleAcceptRequest}
                    handleRejectRequest={handleRejectRequest}
                />
            )}
            <Messages roomId={room.id} profiles={profiles} />
            <Input
                suggestionCandidates={profiles}
                roomId={room.id}
            />
        </div>
    )
};