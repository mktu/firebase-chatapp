import React, { useContext, useState, useMemo } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import CustomTheme, { ThemeType } from './ThemeContext';
import { Add } from '@material-ui/icons';
import { Room } from '../../../../types/room';
import Typography from '@material-ui/core/Typography';
import Searchbox from './SearchBox';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

type Props = {
    showDialog: () => void,
    rooms: Room[],
    renderRoomListItem: (room: Room) => React.ReactElement,
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
    height : 100%;
    overflow : auto;
    display : flex;
    flex-direction : column;
    & > .menu-header{
        > .search-box{
            padding : ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
            display : flex;
            justify-content : flex-end;
            align-items : center;
        }
        > .menu-checks{
            padding : ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(1)}px`};
            display : flex;
            justify-content : flex-end;
            align-items : center;
        }
    }

    & >.menu-list{
        max-height : 80%;
        overflow-y : scroll;
    }

    & >.menu-footer{
        margin-top : auto;
        display : flex;
        align-items : center;
        justify-content : flex-end;
        padding-bottom : 1.5em;
        padding-right : 1.5em;
    }
`;


const Divider = styled.div`
    border-bottom : 1px solid rgba(255,255,255,0.12);
    width : 100%;
`;

const CustomCheckBox = styled(Checkbox)`
    padding : 0;
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
    color : rgba(255,255,255,0.52);
`;

const AddButton = styled(Button)`
    padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    min-width : 0;
`;

export default ({
    showDialog,
    rooms,
    renderRoomListItem,
    currentRoomId
}: Props) => {
    const customtheme = useContext(CustomTheme);
    const [showInactive, setShowInactive] = useState(false);
    const [filter, setFilter] = useState('');
    const activeRooms = useMemo(() => rooms.filter(r => {
        if(showInactive){
            return !Boolean(r.contact)
        }
        return !Boolean(r.disabled) && !Boolean(r.contact)
    }), [rooms, showInactive]);
    const filteredRooms = Boolean(filter) ? activeRooms.filter(r => r.roomName.includes(filter)) : activeRooms;
    return (
        <Wrapper>
            <div className='menu-header'>
                <div className='search-box'>
                    <Searchbox placeholder='Filter room' onChange={setFilter} value={filter} variant='filter'/>
                </div>
                <div className='menu-checks'>
                    <FormControlLabel
                        control={<CustomCheckBox size='small'  checked={showInactive} onChange={(e)=>{
                            setShowInactive(e.target.checked);
                        }}/>}
                        label={<Typography variant='caption'>
                            Show inactive rooms
                        </Typography>}
                    />
                </div>
            </div>
            <Divider />
            <div className='menu-list'>
                <div>
                    <ListSubTitle customtheme={customtheme}>
                        <Typography variant='caption'>
                            {`Rooms (${activeRooms.length})`}
                        </Typography>
                    </ListSubTitle>
                    <List>
                        {filteredRooms.map(renderRoomListItem)}
                    </List>
                </div>
            </div>
            <div className='menu-footer'>
                <div>
                    <AddButton color='secondary' variant='contained' onClick={showDialog}>
                        <Add />
                    </AddButton>
                </div>
            </div>
        </Wrapper>
    )
};