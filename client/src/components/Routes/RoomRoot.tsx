import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { RoomLoader, RoomsLoader } from '../Loaders';
import { ProfileListLoader } from '../Loaders/ProfileLoader';
import RoomPage from '../RoomPage';
import ChatRoom from '../ChatRoom';

const Empty: React.FC<{
    onMount: (empty: boolean) => void,
}> = ({ onMount }) => {
    useEffect(() => {
        onMount(true);
        return () => {
            onMount(false);
        }
    }, [onMount]);
    return null;
}


const RoomRoot: React.FC<any> = (props) => {
    const [empty, setEmpty] = useState<boolean>(false);
    const history = useHistory();
    return (
        <Route {...props}>
            <RoomsLoader>
                <RoomPage closed={empty} handleLoadRoom={(roomId) => {
                    history.replace(`/rooms/${roomId}`);
                }}>
                    <Switch>
                        <Route exact path='/rooms'>
                            <Empty onMount={setEmpty} />
                        </Route>
                        <Route path='/rooms/:roomId'>
                            {({ match, location }) => {
                                const urlParams = new URLSearchParams(location.search);
                                const messageId = urlParams.get('message') || undefined;
                                return (
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
                                                    (profiles)=>(
                                                        <ChatRoom profiles={profiles} room={room} messageId={messageId}/>
                                                    )
                                                }
                                            </ProfileListLoader>
                                        )}
                                    </RoomLoader>
                                )
                            }}
                        </Route>
                    </Switch>
                </RoomPage>
            </RoomsLoader>
        </Route>
    )
};

export default RoomRoot;