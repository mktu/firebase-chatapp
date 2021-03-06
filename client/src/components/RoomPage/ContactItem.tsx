import React, {useContext,useEffect} from 'react';
import styled from 'styled-components';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { MessagesContext,ProfileContext } from '../../contexts';
import CustomTheme, {ThemeType} from './ThemeContext';
import Avatar from '@material-ui/core/Avatar';
import { ContactProfile } from '../../../../types/profile';
import ServiceContext from '../../contexts/ServiceContext';


type Props = {
    contact: ContactProfile,
    selected: boolean,
    handleSelectContact: (contact: ContactProfile) => void,
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

const StyledListItemAvatar = styled(ListItemAvatar)`
    min-width: 3em;
`;

const UserAvatar = styled(Avatar)`
    color: ${({ theme }) => `${theme.palette.getContrastText(theme.palette.background.paper)}`};
    background-color : ${({ theme }) => `${theme.palette.background.paper}`};
    padding : 0.2em;
    width: 1.5em;
    height: 1.5em;
`;

const UnreadAvatar = styled(Avatar)`
    color: ${({ theme }) => `${theme.palette.getContrastText(theme.palette.secondary.main)}`};
    background-color : ${({ theme }) => `${theme.palette.background.main}`};
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
    handleSelectContact,
    contact
}: Props) => {
    const customTheme = useContext(CustomTheme);
    const { messageState } = useContext(MessagesContext);
    const { createContact } = useContext(ServiceContext);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};
    const hasRoom = Boolean(contact.roomId);
    useEffect(()=>{
        if(!hasRoom && profileId){
            createContact(profileId, contact.id,()=>{
                console.log('created contact room')
            },(e)=>{
                console.error(e)
            })
        }
    },[hasRoom,profileId,contact.id,createContact])
    useEffect(()=>{
        if(selected && contact.roomId){
            localStorage.setItem('lastContact', contact.roomId);
        }
    },[selected,contact])
    let unreads = 0;
    if(contact.roomId && messageState[contact.roomId]){
        unreads = messageState[contact.roomId];
    }
    return (
        <StyledListItem customtheme={customTheme} className={className} button disabled={!hasRoom} onClick={() => {
            hasRoom && handleSelectContact(contact);
        }}>
            <StyledListItemAvatar>
                <UserAvatar src={contact.imageUrl}>
                    {contact.nickname[0]}
                </UserAvatar>
            </StyledListItemAvatar>
            <ListItemText secondary={hasRoom ? '' : 'Now initializing...'} secondaryTypographyProps={{color:'inherit'}}>
                {selected ? (<EmphasisText>{contact.nickname}</EmphasisText>) : contact.nickname}
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