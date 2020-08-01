import React, { useContext, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomTheme, { ThemeType } from './ThemeContext';
import { ContactContext } from '../../contexts/ProfileContext';
import { Add } from '@material-ui/icons';
import { Room } from '../../../../types/room';
import { ContactProfile } from '../../../../types/profile';


type Props = {
    showDialog: () => void,
    rooms: Room[],
    renderRoomListItem: (room: Room) => React.ReactElement,
    renderContactListItem: (contact: ContactProfile) => React.ReactElement,
    className?: string,
    currentRoomId?: string
};

type WrapperProps = {
    customtheme: ThemeType,
    theme: any
}

const ListSubTitle = styled.div`
    padding :${({ theme }) => `${theme.spacing(1)}px`};
    & > button{
        width : 100%;
        display : flex;
        justify-content : flex-start;
        align-items : center;
        :hover {
            background-color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.hover}`};
        }
    }
`;

const Wrapper = styled.div`
    background-color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.main}`};
    color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.text}`};
    & > .menu-header{
        padding : ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
        display : flex;
        justify-content : flex-end;
        align-items : center;
    }

    & >.menu-list{
        max-height : 80%;
        overflow-y : scroll;
        > .menu-rooms{

        }
        >.menu-contacts{
            
        }
    }
`;

const StyledExpandIcon = styled(ExpandMoreIcon)`
    ${({ expand }: { expand: string }) => expand === 'true' && `
        transform: rotateX(180deg);
    `};
    transition: 1s;
`;

const Divider = styled.div`
    border-bottom : 1px solid rgba(255,255,255,0.12);
    width : 100%;
`;

const AddButton = styled(Button)`
    padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    min-width : 0;
`;

export default ({
    className,
    showDialog,
    rooms,
    renderRoomListItem,
    renderContactListItem,
    currentRoomId
}: Props) => {
    const customtheme = useContext(CustomTheme);
    const contacts = useContext(ContactContext);
    const [showActive, setShowActive] = useState(true);
    const [showInactive, setShowInactive] = useState(false);
    const [showContacts, setShowContacts] = useState(true);
    const disabledRooms = useMemo(() => rooms.filter(r => Boolean(r.disabled)), [rooms]);
    const activeRooms = useMemo(() => rooms.filter(r => !Boolean(r.disabled) && !Boolean(r.contact)), [rooms]);
    useEffect(() => {
        if (Boolean(disabledRooms.find(r => currentRoomId === r.id))) {
            setShowInactive(true);
        }
    }, [setShowInactive, disabledRooms, currentRoomId]);
    return (
        <Wrapper className={className} customtheme={customtheme}>
            <div className='menu-header'>
                <div>
                    <AddButton color='secondary' variant='contained' onClick={showDialog}>
                        <Add />
                    </AddButton>
                </div>
            </div>
            <Divider />
            <div className='menu-list'>
                <div className='menu-rooms'>
                    <ListSubTitle customtheme={customtheme}>
                        <ButtonBase color='inherit' onClick={() => {
                            setShowActive(prev => !prev);
                        }}>{`Active Rooms (${activeRooms.length})`}<StyledExpandIcon expand={showActive.toString()} /></ButtonBase>
                    </ListSubTitle>
                    <List>
                        {showActive && activeRooms.map(renderRoomListItem)}
                    </List>
                    <ListSubTitle customtheme={customtheme}>
                        <ButtonBase color='inherit' onClick={() => {
                            setShowInactive(prev => !prev);
                        }}>{`Inactive Rooms (${disabledRooms.length})`}<StyledExpandIcon expand={showInactive.toString()} /></ButtonBase>
                    </ListSubTitle>
                    <List>
                        {(showInactive) && disabledRooms.map(renderRoomListItem)}
                    </List>
                </div>
                <Divider />
                <div className='menu-contacts'>
                    <ListSubTitle customtheme={customtheme}>
                        <ButtonBase color='inherit' onClick={() => {
                            setShowContacts(prev => !prev);
                        }}>{`Contacts (${contacts.length})`}<StyledExpandIcon expand={showContacts.toString()} /></ButtonBase>
                    </ListSubTitle>
                    <List>
                        {showContacts && contacts.map(renderContactListItem)}
                    </List>
                </div>
            </div>
        </Wrapper>
    )
};