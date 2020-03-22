import React from 'react';
import styled from 'styled-components';
import { useLocation, Redirect, Switch, Route } from "react-router-dom";
import SignInPage from '../SignInPage';
import { RegisterProfile, UpdateProfile } from '../Profile';
import RoomRoot from './RoomRoot';
import RequestRoot from './RequestRoot';
import { UserLoader, ProfileLoader } from '../Loaders';
import Header from '../Header';
import { RedirectBack } from './common';

const RequiresProfileRoot: React.FC<{}> = () => {
    const location = useLocation();
    return <ProfileLoader fallback={() => {
        return <Redirect to={{
            pathname: "/profile/create",
            state: { from: location }
        }} />;
    }}>
        <Switch>
            <RoomRoot path='/rooms' />
            <RequestRoot path='/requests/:roomId' />
            <Route path='/profile/update' component={UpdateProfile} />
        </Switch>

    </ProfileLoader>
}

const RequiresUserRoot: React.FC<{}> = () => {
    const location = useLocation();
    return < UserLoader fallback={() => {
        return <Redirect to={{
            pathname: "/signin",
            state: { from: location }
        }} />;
    }}>
        <Switch>
            <Route exact path='/profile/create'>
                <RegisterProfile onSucceeded={() => (
                    <RedirectBack defaultPath='/' />
                )} />
            </Route>
            <Route path="*">
                <RequiresProfileRoot />
            </Route>
        </Switch>
    </UserLoader >
}

const Wrapper = styled.div`
    display: grid;
    height : 100vh;
    grid-template-rows: auto 90vh;
`;

const Root: React.FC<{}> = () => {
    return (
        <Wrapper>
            <Header />
            <Switch>
                <Route exact path='/'>
                    <Redirect to={{
                        pathname: '/rooms'
                    }} />
                </Route>
                <Route exact path='/signin'>
                    <SignInPage onSucceeded={() => (
                        <RedirectBack defaultPath='/' />
                    )} />
                </Route>
                <Route path="*">
                    <RequiresUserRoot />
                </Route>
            </Switch>
        </Wrapper>
    )
}

export default Root;