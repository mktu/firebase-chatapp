import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import { Add } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { State as RoomState, Room } from '../../types/room';

type Props = {
    showDialog: ()=>void,
    roomState: RoomState,
    handleSelectRoom: (room: Room) => void,
    className? : string
};

const MenuWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
    justify-content : flex-end;
`;

export default ({ className, showDialog, roomState, handleSelectRoom } : Props) => {
    const { rooms } = roomState;
    return (
        <div className={className}>
            <Typography>Your chat rooms</Typography>
            <MenuWrapper>
                <Fab color='primary' onClick={showDialog}>
                    <Add />
                </Fab>
            </MenuWrapper>
            <List>
                {rooms.map(room => {
                    return (
                        <ListItem button key={room.id} onClick={() => {
                            handleSelectRoom(room);
                        }}>
                            <ListItemText>
                                {room.roomName}
                            </ListItemText>
                        </ListItem>
                    )
                })}
            </List>
        </div>
    )
};