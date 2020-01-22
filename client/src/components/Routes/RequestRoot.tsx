import React from 'react';
import styled from 'styled-components';
import { Route, Redirect } from "react-router-dom";
import RoomLoader from '../Loaders/RoomLoader';
import RequestRoom from '../RequestRoom';

const JoinRequestPage = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const RequestRoot: React.FC<any> = (props) => {
    return (
        <Route {...props}>
            {
                ({ match }) => (
                    <JoinRequestPage>
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
                                <RequestRoom room={room} />
                            )}
                        </RoomLoader>
                    </JoinRequestPage>
                )
            }
        </Route>
    )
};

export default RequestRoot;