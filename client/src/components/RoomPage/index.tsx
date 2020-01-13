import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from "react-router-dom";
import LoadingPage from '../LoadingPage';
import RoomDialog from '../RoomDialog';
import RoomLoader from '../RoomLoader';
import useRoomPageState from '../../hooks/useRoomPageState';
import RoomMenu from '../RoomMenu';
import ChatRoomBase, { JoinRequest } from '../ChatRoom';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const ChatRoom = styled(ChatRoomBase)`

`;

export default () => {
    const {
        showNewRoom,
        showDialog,
        hideDialog,
        roomState,
        handleSelectRoom,
        loading,
        newRoomName,
        handleCreateNewRoom,
        handleEditNewRoomName,
    } = useRoomPageState();
    if (loading) {
        return <LoadingPage message='loading rooms' />;
    }
    return (
        <Wrapper>
            <Switch>
                <Route exact path='/rooms'>
                    <RoomMenu
                        showDialog={showDialog}
                        handleSelectRoom={handleSelectRoom}
                        roomState={roomState}
                    />
                </Route>
                <Route path='/rooms/requests/:roomId'>
                    {
                        ({ match }) => (
                            <JoinRequest roomId={match?.params.roomId} />
                        )
                    }
                </Route>
                <Route path='/rooms/:roomId'>
                    {({ match }) => {
                        return (
                            <RoomLoader roomId={match?.params.roomId}>
                                {
                                    (room) => (
                                        <React.Fragment>
                                            <RoomMenu
                                                showDialog={showDialog}
                                                handleSelectRoom={handleSelectRoom}
                                                roomState={roomState}
                                            />
                                            <ChatRoom
                                                room={room}
                                            />
                                        </React.Fragment>
                                    )
                                }
                            </RoomLoader>
                        )
                    }}
                </Route>
            </Switch>
            <RoomDialog
                show={showNewRoom}
                onClose={hideDialog}
                handleChangeRoomName={handleEditNewRoomName}
                roomName={newRoomName}
                onSave={handleCreateNewRoom} />
        </Wrapper>
    )
};