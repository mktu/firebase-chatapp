import React from 'react';
import { Route, Redirect, useHistory, useRouteMatch, useLocation, RouteProps } from "react-router-dom";
import { RoomLoader, RoomsLoader } from '../Loaders';
import { ProfileListLoader } from '../Loaders/ProfileLoader';
import RoomPage from '../RoomPage';
import ChatRoom from '../ChatRoom';

const ChatRoomMounter: React.FC = () => {
    const history = useHistory();
    const match = useRouteMatch<{ roomId: string }>('/rooms/:roomId');
    const location = useLocation();
    let children = <div />;
    if (match && match.isExact) {
        const urlParams = new URLSearchParams(location.search);
        const messageId = urlParams.get('message') || undefined;
        children = (
            <RoomLoader
                roomId={match?.params.roomId}
                fallback={(roomId) => {
                    return <Redirect
                        to={{
                            pathname: `/requests/${roomId}`
                        }}
                    />;
                }}
            >
                {(room) => (
                    <ProfileListLoader uids={room.users}>
                        {
                            (profiles) => (
                                <ChatRoom profiles={profiles} room={room} messageId={messageId} />
                            )
                        }
                    </ProfileListLoader>
                )}
            </RoomLoader>
        );
    }
    return (
        <RoomPage currentRoomId={match?.params.roomId} handleLoadRoom={(roomId) => {
            history.replace(`/rooms/${roomId}`);
        }}>
            {children}
        </RoomPage>
    )
}

const RoomRoot: React.FC<RouteProps> = (props) => {
    return (
        <Route {...props}>
            <RoomsLoader>
                <ChatRoomMounter />
            </RoomsLoader>
        </Route>
    )
};

export default RoomRoot;