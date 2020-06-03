import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { Room } from '../../../../../../types/room';

const Divider = styled.div`
    border-bottom : 1px solid ${({ theme }) => `${theme.palette.divider}`};
    width : 100%;
`;

const StyledTitle = styled(DialogTitle)`
    padding : 8px 24px;
`;

const StyledTextField = styled(TextField)`
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
`;

function SettingDialog<T extends {
    id: string,
    nickname: string,
}>({
    className,
    profiles,
    show,
    onClose,
    owner,
    modifyRoom,
    room
}: {
    className?: string,
    profiles: T[],
    show: boolean,
    onClose: () => void,
    owner: boolean,
    modifyRoom: (room: Room) => void,
    room: Room,
}) {

    const [roomName, setRoomName] = useState(room.roomName);
    const [users, setUsers] = useState([...profiles]);

    useEffect(()=>{
        setRoomName(room.roomName)
        setUsers([...profiles])
    },[profiles,room,setRoomName,setUsers])

    const handleDeleteUser = useCallback((profileId: string) => {
        setUsers(prev=>prev.filter(p => p.id !== profileId));
    }, [setUsers]);
    const hasChanged = !(JSON.stringify(users.map(p=>p.id)) === JSON.stringify(room.users) && room.roomName === roomName);

    const handleSubmit = useCallback(()=>{
        modifyRoom({
            ...room,
            roomName,
            users: users.map(p => p.id)
        });
        onClose();
    }, [modifyRoom,roomName,users,room,onClose]);

    return (
        <Dialog fullWidth maxWidth='sm' open={show} className={className} onClose={onClose}>
            <StyledTitle >{room.roomName}Setting</StyledTitle>
            <Divider />
            <DialogContent>
                <Typography variant='subtitle1'>Room Name</Typography>
                <StyledTextField
                    fullWidth
                    value={roomName}
                    onChange={(e) => {
                        setRoomName(e.target.value);
                    }}
                />
                <Typography variant='subtitle1'>USERS</Typography>
                <List>
                    {users.map((profile) => (<ListItem key={profile.id}>
                        <ListItemAvatar><Avatar>{profile.nickname[0]}</Avatar></ListItemAvatar>
                        <ListItemText>{profile.nickname}</ListItemText>
                        <ListItemSecondaryAction>
                            {owner && (
                                <IconButton onClick={() => {
                                    handleDeleteUser(profile.id);
                                }}>
                                    <HighlightOffIcon />
                                </IconButton>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>))}
                </List>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={handleSubmit} disabled={!hasChanged} color="primary">
                    SUBMIT
                </Button>
                <Button onClick={onClose}>
                    CLOSE
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default SettingDialog;