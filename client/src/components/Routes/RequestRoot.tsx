import React from 'react';
import styled from 'styled-components';
import { Route, Redirect } from "react-router-dom";
import RoomLoader from '../Loaders/RoomLoader';
import { JoinRequest } from '../ChatRoom';

const JoinRequestPage = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const RequestRoot: React.FC<any> = (props) => {
    return (
        <JoinRequestPage>
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
        </JoinRequestPage>
    )
};

export default RequestRoot;