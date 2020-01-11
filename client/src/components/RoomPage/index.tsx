import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import RoomDialog from '../RoomDialog';
import { Add } from '@material-ui/icons';
import useRoomPageState from '../../hooks/useRoomPageState';
import Typography from '@material-ui/core/Typography';
import LoadingPage from '../LoadingPage';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const Paper = styled(PaperBase)`
    width : 60%;
    padding : 1rem;
`

const MenuWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
`;

export default () => {
    const {showNewRoom, showDialog, hideDialog, handleSubmit, roomState} = useRoomPageState();
    const {rooms} = roomState;
    return (
        <Wrapper>
            <Paper>
                <Typography>Your chat rooms</Typography>
                <MenuWrapper>
                    <IconButton onClick={showDialog}>
                        <Add />
                    </IconButton>
                </MenuWrapper>
                <List>
                    {rooms.map(room=>{
                        return (
                            <ListItem>
                                <ListItemText>
                                    {room.roomName}
                                </ListItemText>
                            </ListItem>
                        )
                    })}
                </List>
            </Paper>
            <RoomDialog show={showNewRoom} onClose={hideDialog} onSave={handleSubmit}/>
        </Wrapper>
    )
};