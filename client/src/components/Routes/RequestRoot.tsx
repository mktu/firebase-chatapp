import React from 'react';
import { Route, Redirect } from "react-router-dom";
import RoomLoader from '../Loaders/RoomLoader';
import { JoinRequest } from '../ChatRoom';

const RequestRoot : React.FC<any> = (props) => {
    return (
        <Route {...props}>
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
    )
};

export default RequestRoot;