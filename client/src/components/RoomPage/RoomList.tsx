import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import { Add } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../../../types/room';


type Props = {
    showDialog: () => void,
    rooms: Room[],
    renderRoomListItem : (room:Room)=>React.ReactElement,
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

export default ({
    className,
    showDialog,
    rooms,
    renderRoomListItem
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
                {rooms.map(renderRoomListItem)}
            </List>
        </Wrapper>
    )
};