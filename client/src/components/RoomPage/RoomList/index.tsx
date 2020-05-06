import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { Add } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../../../../types/room';

type Props = {
    showDialog: () => void,
    rooms: Room[],
    handleSelectRoom: (room: Room) => void,
    currentRoomId?: string,
    className?: string
};

const Wrapper = styled.div`
    background-color :${({ theme }) => `${theme.palette.primary[50]}`};

    & > .menu-header{
        padding : ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
        display : flex;
        justify-content : space-between;
        align-items : center;
    }
`;

const AddButton = styled(Button)`
    padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    min-width : 0;
`;

const CustomAvatar = styled(Avatar)`
    color: ${({ theme }) => `${theme.palette.getContrastText(theme.palette.primary.light)}`};
    background-color : ${({ theme }) => `${theme.palette.primary.light}`};
`;

const EmphasisText = styled.span`
    font-weight : ${({ theme }) => `${theme.typography.fontWeightMedium}`};
`;

export default ({
    className,
    showDialog,
    rooms,
    currentRoomId,
    handleSelectRoom
}: Props) => {
    return (
        <Wrapper className={className}>
            <div className='menu-header'>
                <Typography color='inherit'>CHAT ROOMS</Typography>
                <div>
                    <AddButton color='secondary' variant='contained' onClick={showDialog}>
                        <Add />
                    </AddButton>
                </div>
            </div>

            <List>
                {rooms.map(room => {
                    return (
                        <ListItem button key={room.id} onClick={() => {
                            handleSelectRoom(room);
                        }}>
                            <ListItemAvatar>
                                <CustomAvatar>
                                    {room.roomName[0]}
                                </CustomAvatar>
                            </ListItemAvatar>
                            <ListItemText>
                                {currentRoomId === room.id ? (<EmphasisText>{room.roomName}</EmphasisText>) : room.roomName}
                            </ListItemText>
                        </ListItem>
                    )
                })}
            </List>
        </Wrapper>
    )
};