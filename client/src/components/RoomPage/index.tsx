import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import RoomDialog from '../RoomDialog';
import useRoomPageState from '../../hooks/useRoomListState';
import RoomList from '../RoomList';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const ListPaper = styled(Paper)`
    width : 40%;
    padding : 1rem;
`

const RoomPaper = styled(Paper)(({closed}:{closed:boolean})=>`
    width : ${closed? `0` : `50%`};
    padding :${closed? `0` : `1rem`};
    transition: all 0.3s ease-out;
`);

type Props = {
    children:JSX.Element,
    closed : boolean,
    handleLoadRoom : (roomId:string)=>void
};

const RoomPage: React.FC<Props> = ({ children, closed, handleLoadRoom }) => {
    const {
        showNewRoom,
        showDialog,
        hideDialog,
        roomState,
        newRoomName,
        handleCreateNewRoom,
        handleEditNewRoomName,
    } = useRoomPageState();
    return (
        <Wrapper>
            <ListPaper>
                <RoomList
                    showDialog={showDialog}
                    handleSelectRoom={(room)=>{
                        handleLoadRoom(room.id);
                    }}
                    roomState={roomState}
                />
            </ListPaper>
            <RoomPaper closed={closed}>
                {children}
            </RoomPaper>
            <RoomDialog
                show={showNewRoom}
                onClose={hideDialog}
                handleChangeRoomName={handleEditNewRoomName}
                roomName={newRoomName}
                onSave={handleCreateNewRoom} />
        </Wrapper>
    )
};

export default RoomPage;