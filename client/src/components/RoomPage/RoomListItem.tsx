import React, {useContext, useEffect} from 'react';
import styled from 'styled-components';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { MessagesContext } from '../../contexts';
import CustomTheme, {ThemeType} from './ThemeContext';
import Avatar from '@material-ui/core/Avatar';
import { Room } from '../../../../types/room';


type Props = {
    room: Room,
    selected: boolean,
    handleSelectRoom: (room: Room) => void,
    className?: string
};

type ThemeProps = {
    customtheme : ThemeType,
    theme : any
}

const StyledListItem = styled(ListItem)`
    &:hover {
        background-color : ${({ customtheme } : ThemeProps) => `${customtheme.primary.hover}`};
    }
`;

const UserAvatar = styled(Avatar)`
    color: ${({ theme }) => `${theme.palette.getContrastText(theme.palette.primary.light)}`};
    background-color : ${({ theme }) => `${theme.palette.primary.light}`};
`;

const UnreadAvatar = styled(Avatar)`
    color: ${({ theme }) => `${theme.palette.getContrastText(theme.palette.secondary.main)}`};
    background-color : ${({ theme }) => `${theme.palette.secondary.main}`};
    width: ${({ theme }) => `${theme.spacing(3)}px`};
    height: ${({ theme }) => `${theme.spacing(3)}px`};
    font-size : 0.9rem;
`;

const EmphasisText = styled.span`
    font-weight : ${({ theme }) => `${theme.typography.fontWeightMedium}`};
`;

const RoomText = styled.span`
    ${({deactive}:{deactive:boolean})=>deactive && `
            color : rgba(255,255,255,0.52);
        `}
`;

export default ({
    className,
    selected,
    handleSelectRoom,
    room
}: Props) => {
    const customTheme = useContext(CustomTheme);
    const { messageState } = useContext(MessagesContext);
    const unreads = messageState[room.id] ?  messageState[room.id] : 0;
    useEffect(()=>{
        if(selected){
            localStorage.setItem('lastRoom', room.id);
        }
    },[selected,room])
    return (
        <StyledListItem customtheme={customTheme} className={className} button onClick={() => {
            handleSelectRoom(room);
        }}>
            <ListItemAvatar>
                <UserAvatar>
                    {room.roomName[0]}
                </UserAvatar>
            </ListItemAvatar>
            <ListItemText >
    {selected ? (<EmphasisText>{room.roomName}</EmphasisText>) : <RoomText deactive={Boolean(room.disabled)}>{room.roomName}</RoomText>}
            </ListItemText>
            {unreads > 0 && (
                <ListItemSecondaryAction >
                    <UnreadAvatar variant='rounded'>
                        {unreads}
                    </UnreadAvatar>
                </ListItemSecondaryAction>
            )}

        </StyledListItem>
    )
};