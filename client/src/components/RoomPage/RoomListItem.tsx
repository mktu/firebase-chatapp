import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Room } from '../../../../types/room';
import ServiceContext from './ServiceContext';


type Props = {
    room: Room,
    profileId: string,
    selected: boolean,
    handleSelectRoom: (room: Room) => void,
    className?: string
};


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

export default ({
    className,
    selected,
    profileId,
    handleSelectRoom,
    room
}: Props) => {

    const { registUnreadsListener } = useContext(ServiceContext);
    const [unreads, setUnreads] = useState([] as string[])
    useEffect(() => {
        let unsubscribe = registUnreadsListener(room.id, profileId, (unread) => {
            setUnreads(unread.messageIds)
        });
        return () => {
            unsubscribe();
        }
    }, [profileId, room.id, registUnreadsListener])
    return (
        <ListItem className={className} button onClick={() => {
            handleSelectRoom(room);
        }}>
            <ListItemAvatar>
                <UserAvatar>
                    {room.roomName[0]}
                </UserAvatar>
            </ListItemAvatar>
            <ListItemText >
                {selected ? (<EmphasisText>{room.roomName}</EmphasisText>) : room.roomName}
            </ListItemText>
            {unreads.length > 0 && (
                <ListItemSecondaryAction >
                    <UnreadAvatar variant='rounded'>
                        {unreads.length}
                    </UnreadAvatar>
                </ListItemSecondaryAction>
            )}

        </ListItem>
    )
};