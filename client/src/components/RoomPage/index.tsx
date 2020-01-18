import React from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect } from "react-router-dom";
import LoadingPage from '../LoadingPage';
import RoomDialog from '../RoomDialog';
import RoomLoader from '../RoomLoader';
import useRoomPageState from '../../hooks/useRoomListState';
import RoomList from '../RoomList';
import ChatRoom, { JoinRequest } from '../ChatRoom';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
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
                    <RoomList
                        showDialog={showDialog}
                        handleSelectRoom={handleSelectRoom}
                        roomState={roomState}
                    />
                </Route>
                <Route path='/rooms/requests/:roomId'>
                    {
                        ({ match }) => (
                            <RoomLoader
                                roomId={match?.params.roomId}
                                fallback={() => {
                                    return <Redirect
                                        to={{
                                            pathname: `/rooms`
                                        }}
                                    />;
                                }}
                                useDb
                            >
                                {(room) => (
                                    <JoinRequest room={room} />
                                )}
                            </RoomLoader>

                        )
                    }
                </Route>
                <Route path='/rooms/:roomId'>
                    {({ match }) => {
                        return (
                            <RoomLoader
                                roomId={match?.params.roomId}
                                fallback={(roomId) => {
                                    return <Redirect
                                        to={{
                                            pathname: `/rooms/requests/${roomId}`
                                        }}
                                    />;
                                }}
                            >
                                {
                                    (room) => (
                                        <React.Fragment>
                                            <RoomList
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