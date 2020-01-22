import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { Send } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Room } from '../../types/room';
import { ProfilesLoader } from '../Loaders/ProfileLoader';
import useRoomOwnerState from './useRoomOwnerState';

type Props = {
    room: Room,
    className?: string,
};

const Wrapper = styled.div`
`;

const UsersWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
    justify-content : flex-end;
`;

const RequestsWrapper = styled(List)`

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

const UserIcon = styled(IconButton)`
    margin : 0;
    padding : 1px;
`;

export default ({ className, room }: Props) => {
    const {
        requests,
        handleAcceptRequest,
        handleRejectRequest } = useRoomOwnerState({ room });
    return (
        <Wrapper className={className} >
            <Typography>{room.roomName}</Typography>
            <ProfilesLoader
                uids={room.users}
                fallback={() => {
                    return <div>Failed to retrieve users</div>
                }}
                loading={() => {
                    return <div>Loading users...</div>
                }}
            >
                {(profiles) => {
                    return <UsersWrapper>
                        {profiles.map(p => (
                            <Tooltip title={p.nickname} aria-label="chat-users">
                                <UserIcon key={p.id}>
                                    <Avatar>{p.nickname[0]}</Avatar>
                                </UserIcon>
                            </Tooltip>

                        ))}
                    </UsersWrapper>
                }}
            </ProfilesLoader>
            <RequestsWrapper>
                {requests.map(req => {
                    return (
                        <ListItem id={req.id} key={req.id}>
                            <ListItemText>{req.nickName}</ListItemText>
                            <ListItemSecondaryAction>
                                <Button color='secondary' onClick={() => {
                                    handleAcceptRequest(req);
                                }}>ACCEPT</Button>
                                <Button color='secondary' onClick={() => {
                                    handleRejectRequest(req);
                                }}>REFUSE</Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })}
            </RequestsWrapper>
            <MessagesWrapper>
                
            </MessagesWrapper>
            <InputBox>
                <TextField fullWidth variant='outlined' />
                <IconButton><Send /></IconButton>
            </InputBox>
        </Wrapper>
    )
};