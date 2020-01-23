import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Send } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import { Room } from '../../types/room';
import useRoomOwnerState from './useRoomOwnerState';
import Requests from './Requests';
import Users from './Users';

type Props = {
    room: Room,
    className?: string,
};

const Wrapper = styled.div`
`;

const MessagesWrapper = styled.div`
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    height : 50vh;
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    margin-bottom : ${({ theme }) => `${theme.spacing(2)}px`};
`;

const InputBox = styled.div`
    display : flex;
    align-items : center;
`;

export default ({ className, room }: Props) => {
    const {
        handleAcceptRequest,
        handleRejectRequest,
        isOwner
    } = useRoomOwnerState(room);
    return (
        <Wrapper className={className} >
            <Typography>{room.roomName}</Typography>
            <Users room={room}/>
            {isOwner && (
                <Requests 
                    roomId={room.id}
                    handleAcceptRequest={handleAcceptRequest} 
                    handleRejectRequest={handleRejectRequest}
                />
            )}
            <MessagesWrapper>

            </MessagesWrapper>
            <InputBox>
                <TextField fullWidth variant='outlined' />
                <IconButton><Send /></IconButton>
            </InputBox>
        </Wrapper>
    )
};