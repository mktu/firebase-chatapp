import React from 'react';
import { Route, Redirect, useHistory, useRouteMatch, useLocation, RouteProps } from "react-router-dom";
import RoomPage from '../RoomPage';
import RequestRoom from '../RequestRoom';
import ChatRoom from '../ChatRoom';

const Target: React.FC = () => {
    const history = useHistory();
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
            handleLoadRoom={(roomId) => {
                if(roomId){
                    history.replace(`/rooms/${roomId}`);
                }
                else{
                    history.replace(`/rooms`);
                }
                
            }}
            handleLoadContactRoom={(roomId) => {
                if(roomId){
                    history.replace(`/rooms/contacts/${roomId}`);
                }
                else {
                    history.replace(`/rooms/contacts`);
                }
            }}
            handleRequest={(roomId)=>{
                history.replace(`/rooms/requests/${roomId}`);
            }}
            handleRemovedContact={(roomId)=>{
                history.replace(`/rooms`);
            }}
            renderChatRoom={(room) => (
                <ChatRoom key={room.id} show={currentRoomId === room.id} room={room} focusMessageId={messageId} onClose={() => {
                    history.replace(`/rooms`);
                }} />
            )}
            isContact={isContact}
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