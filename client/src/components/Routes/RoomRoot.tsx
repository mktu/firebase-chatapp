import React from 'react';
import { Route, Redirect, useHistory, useRouteMatch, useLocation, RouteProps } from "react-router-dom";
import RoomPage from '../RoomPage';
import ChatRoom from '../ChatRoom';

const Target: React.FC = () => {
    const history = useHistory();
    const roomMatch = useRouteMatch<{ roomId: string }>('/rooms/:roomId');
    const contactRoomMatch = useRouteMatch<{ roomId: string }>('/rooms/contacts/:roomId');
    const location = useLocation();
    const roomId = (roomMatch && roomMatch.isExact && roomMatch.params.roomId) || undefined;
    const contactRoomId = (contactRoomMatch && contactRoomMatch.isExact && contactRoomMatch.params.roomId) || undefined;
    const urlParams = new URLSearchParams(location.search);
    const messageId = urlParams.get('message') || undefined;
    const currentRoomId = contactRoomId || roomId;
    // contact or room
    // add Room page's props to room/contact section
    // currentRoomId = roomId/contactId
    // if there is no room that has currentId, then create contact room, and render loading
    return (
        <RoomPage
            currentRoomId={currentRoomId}
            handleLoadRoom={(roomId) => {
                history.replace(`/rooms/${roomId}`);
            }}
            handleLoadContactRoom={(roomId)=>{
                history.replace(`/rooms/contacts/${roomId}`);
            }}
            renderChatRoom={(room) => (
                <ChatRoom key={room.id} show={currentRoomId === room.id} room={room} focusMessageId={messageId} onClose={()=>{
                    history.replace(`/rooms`);
                }}/>
            )}
            renderRequestRoom={(id) => (
                <Redirect
                    to={{
                        pathname: `/requests/${id}`
                    }}
                />
            )}
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