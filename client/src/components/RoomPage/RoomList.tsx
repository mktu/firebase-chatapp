import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomTheme, { ThemeType } from './ThemeContext';
import { Add } from '@material-ui/icons';
import { Room } from '../../../../types/room';


type Props = {
    showDialog: () => void,
    rooms: Room[],
    renderRoomListItem: (room: Room) => React.ReactElement,
    className?: string
};

type WrapperProps = {
    customtheme: ThemeType,
    theme: any
}

const Wrapper = styled.div`
    background-color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.main}`};
    color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.text}`};
    & > .menu-header{
        padding : ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
        display : flex;
        justify-content : flex-end;
        align-items : center;
    }

    & > .menu-rooms{
        max-height : 80%;
        overflow-y : scroll;
        > .menu-rooms-subtitle{
            padding :${({ theme }) => `${theme.spacing(1)}px`};
            > button{
                width : 100%;
                display : flex;
                justify-content : flex-start;
                align-items : center;
                :hover {
                    background-color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.hover}`};
                }
            }
        }
    }
`;

const StyledExpandIcon = styled(ExpandMoreIcon)`
    ${({ expand }: {expand:string}) => expand === 'true' && `
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
    renderRoomListItem
}: Props) => {
    const customtheme = useContext(CustomTheme);
    const [showActive, setShowActive] = useState(true);
    const [showInactive, setShowInactive] = useState(false);

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
            <div className='menu-rooms'>
                <div className='menu-rooms-subtitle'>
                    <ButtonBase color='inherit' onClick={()=>{
                        setShowActive(prev=>!prev);
                    }}>Active Rooms<StyledExpandIcon expand={showActive.toString()}/></ButtonBase>
                </div>
                <List>
                    {showActive && rooms.filter(r => !Boolean(r.disabled)).map(renderRoomListItem)}
                </List>
                <div className='menu-rooms-subtitle'>
                    <ButtonBase color='inherit' onClick={()=>{
                        setShowInactive(prev=>!prev);
                    }}>Inactive Rooms<StyledExpandIcon expand={showInactive.toString()}/></ButtonBase>
                </div>
                <List>
                    {showInactive && rooms.filter(r => Boolean(r.disabled)).map(renderRoomListItem)}
                </List>
            </div>
            <Divider />
        </Wrapper>
    )
};