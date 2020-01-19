import React from 'react';
import { useLocation, Redirect, Switch, Route } from "react-router-dom";
import VisitorPage from '../VisitorPage';
import { RegisterProfilePage, UpdateProfilePage } from '../ProfilePage';
import RoomPage from '../RoomPage';
import { UserLoader, ProfileLoader } from '../Loaders';
import { RedirectWhenProfileRegistered, RedirectWhenUserLoggedIn } from '../ConditionalRedirects';
import Header from '../Header';

const redirectWhenConditionSatisfied = (to: string) => {
    return <Redirect to={{
        pathname: to,
    }} />;
}

const renderRootRequiresProfile = () => (
    <Switch>
        <Route path='/rooms' component={RoomPage} />
        <Route path='/profile/update' component={UpdateProfilePage} />
    </Switch>
);

const renderRootRequiresUser = () => (
    <Switch>
        <Route path='/profile/create'>
            <RedirectWhenProfileRegistered onSatisfied={redirectWhenConditionSatisfied}>
                <RegisterProfilePage />
            </RedirectWhenProfileRegistered>
        </Route>
        <Route path="*">
            <RequiresProfileRoot />
        </Route>
    </Switch>
);

const RequiresProfileRoot: React.FC<{}> = () => {
    const location = useLocation();
    return <ProfileLoader fallback={() => {
        return <Redirect to={{
            pathname: "/profile/create",
            state: { from: location }
        }} />;
    }}>
        {renderRootRequiresProfile}
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
        {renderRootRequiresUser}
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
                    <RedirectWhenUserLoggedIn onSatisfied={redirectWhenConditionSatisfied}>
                        <VisitorPage />
                    </RedirectWhenUserLoggedIn>
                </Route>
                <Route path="*">
                    <RequiresUserRoot />
                </Route>
            </Switch>
        </React.Fragment>
    )
}

export default Root;