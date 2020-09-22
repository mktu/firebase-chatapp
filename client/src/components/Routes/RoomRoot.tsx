import React, {useCallback} from 'react';
import { Route, Redirect, useHistory, useRouteMatch, useLocation, RouteProps } from "react-router-dom";
import RoomPage from '../RoomPage';
import RequestRoom from '../RequestRoom';
import ChatRoom from '../ChatRoom';

const Target: React.FC = () => {
    const history = useHistory();
    const roomHomeMatch = useRouteMatch<{ roomId: string }>('/rooms');
    const roomMatch = useRouteMatch<{ roomId: string }>('/rooms/:roomId');
    const contactRoomMatch = useRouteMatch<{ roomId: string }>('/rooms/contacts/:roomId');
    const requestMatch = useRouteMatch<{ roomId: string }>('/rooms/requests/:roomId');
    const location = useLocation();
    const roomId = (roomMatch && roomMatch.isExact && roomMatch.params.roomId) || undefined;
    const contactRoomId = (contactRoomMatch && contactRoomMatch.isExact && contactRoomMatch.params.roomId) || undefined;
    const requestId = (requestMatch && requestMatch.isExact && requestMatch.params.roomId) || undefined;
    const urlParams = new URLSearchParams(location.search);
    const messageId = urlParams.get('message') || undefined;
    const currentRoomId = contactRoomId || roomId;
    const isContact = (roomMatch && roomMatch.url.includes('/rooms/contacts')) || false;
    const isRoomHome = roomHomeMatch?.isExact || false;

    const handleLoadContactRoom = useCallback((roomId) => {
        if(roomId){
            history.replace(`/rooms/contacts/${roomId}`);
        }
        else {
            history.replace(`/rooms/contacts`);
        }
    },[history]);

    const handleLoadRoom = useCallback((roomId) => {
        if(roomId){
            history.replace(`/rooms/${roomId}`);
        }
        else{
            history.replace(`/rooms`);
        }
        
    },[history]);

    const handleRemovedContact = useCallback((roomId)=>{
        history.replace(`/rooms`);
    },[history]);

    const handleRequest = useCallback((roomId)=>{
        history.replace(`/rooms/requests/${roomId}`);
    },[history]);

    // contact or room
    // add Room page's props to room/contact section
    // currentRoomId = roomId/contactId
    // if there is no room that has currentId, then create contact room, and render loading
    return (
        <RoomPage
            currentRoomId={currentRoomId}
            requestRoom={requestId ? (
                <RequestRoom roomId={requestId} fallback={
                    () => (
                        <Redirect
                            to={{
                                pathname: `/rooms`
                            }}
                        />
                    )
                } accepted={
                    <Redirect
                        to={{
                            pathname: `/rooms/${requestId}`
                        }}
                    />
                } />
            ): undefined}
            handleLoadRoom={handleLoadRoom}
            handleLoadContactRoom={handleLoadContactRoom}
            handleRequest={handleRequest}
            handleRemovedContact={handleRemovedContact}
            renderChatRoom={(room) => (
                <ChatRoom key={room.id} show={currentRoomId === room.id} room={room} focusMessageId={messageId} onClose={() => {
                    history.replace(`/rooms`);
                }} />
            )}
            isContact={isContact}
            isRoomHome={isRoomHome}
        />);
}

const RoomRoot: React.FC<RouteProps> = (props) => {
    return (
        <Route {...props}>
            <Target />
        </Route>
    )
};

export default RoomRoot;