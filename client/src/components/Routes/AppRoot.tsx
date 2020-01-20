import React from 'react';
import { useLocation, Redirect, Switch, Route } from "react-router-dom";
import SignInPage from '../SignInPage';
import { RegisterProfilePage, UpdateProfilePage } from '../ProfilePage';
import RoomRoot from './RoomRoot';
import { UserLoader, ProfileLoader, RoomsLoader } from '../Loaders';
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
            <Route path='/rooms'>
                <RoomsLoader>
                    <RoomRoot />
                </RoomsLoader>
            </Route>
            <Route path='/profile/update' component={UpdateProfilePage} />
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
            <Route path='/profile/create'>
                <RegisterProfilePage onSucceeded={() => (
                    <RedirectBack defaultPath='/' />
                )} />
            </Route>
            <Route path="*">
                <RequiresProfileRoot />
            </Route>
        </Switch>
    </UserLoader >
}

const Root: React.FC<{}> = () => {
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default Root;