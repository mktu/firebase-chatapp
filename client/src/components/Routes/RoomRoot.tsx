import React from 'react';
import { Route, Redirect, useHistory, useRouteMatch, useLocation, RouteProps } from "react-router-dom";
import RoomPage from '../RoomPage';
import ChatRoom from '../ChatRoom';

const Target: React.FC = () => {
    const history = useHistory();
    const match = useRouteMatch<{ roomId: string }>('/rooms/:roomId');
    const location = useLocation();
    const roomId = (match && match.isExact && match?.params.roomId) || undefined;
    const urlParams = new URLSearchParams(location.search);
    const messageId = urlParams.get('message') || undefined;

    return (
        <RoomPage
            currentRoomId={roomId}
            handleLoadRoom={(roomId) => {
                history.replace(`/rooms/${roomId}`);
            }}
            renderChatRoom={(room) => (
                <ChatRoom key={room.id} show={roomId === room.id} room={room} focusMessageId={messageId} />
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