import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { RoomLoader, RoomsLoader } from '../Loaders';
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
                            {({ match }) => {
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
                                        {(room) => (<ChatRoom room={room} />)}
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