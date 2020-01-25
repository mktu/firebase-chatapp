import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Send } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import { Room } from '../../types/room';
import { ProfilesLoader } from '../Loaders/ProfileLoader';
import useOwnerState from './useOwnerState';
import useChatState from './useChatState';
import Requests from './Requests';
import UsersBase from './Users';
import MessagesBase from './Messages';

type Props = {
    room: Room,
    className?: string,
};

const Users = styled(UsersBase)`
    margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
`

const Messages = styled(MessagesBase)`
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    height : 50vh;
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    margin-bottom : ${({ theme }) => `${theme.spacing(2)}px`};
    overflow : auto;
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
    } = useOwnerState(room);
    const {
        inputMessage,
        handleChangeInput,
        handleSubmitMessage,
        handleKeyPress
    } = useChatState(room.id);

    return (
        <div className={className} >
            <Typography>{room.roomName}</Typography>
            {isOwner && (
                <Requests
                    roomId={room.id}
                    handleAcceptRequest={handleAcceptRequest}
                    handleRejectRequest={handleRejectRequest}
                />
            )}
            <InputBox>
                <TextField 
                    fullWidth 
                    variant='outlined' 
                    value={inputMessage} 
                    onKeyPress={handleKeyPress}
                    onChange={handleChangeInput}/>
                <IconButton onClick={handleSubmitMessage}><Send /></IconButton>
            </InputBox>
            <ProfilesLoader uids={room.users}>
                {(profiles) => (
                    <div>
                        <Users profiles={profiles} />
                        <Messages roomId={room.id} profiles={profiles}/>
                    </div>
                )}
            </ProfilesLoader>
        </div>
    )
};