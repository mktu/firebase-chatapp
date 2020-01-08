import React, { useContext } from 'react';
import { BrowserRouter as Router, useLocation, useRouteMatch, Redirect, Switch, Route } from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import ProfileContext from '../../contexts/ProfileContext';
import VisitorPage from '../VisitorPage';
import ProfilePage from '../ProfilePage';
import LoadingPage from '../LoadingPage';
import Header from '../Header';

const Dummy = () => {
    return <div>TBD</div>
}
const AppRouter = ()=>{
    const { userState } = useContext(AuthContext);
    const { profileState } = useContext(ProfileContext);
    const matchSignin = useRouteMatch("/signin");
    const matchCreateProfile = useRouteMatch('/profile/create')
    const location = useLocation();
    const {loggingIn} = userState;
    const {user} = userState;
    const {loading : loadingProfile, profile} = profileState;

    if(loggingIn){
        return <LoadingPage />;
    }
    if(matchSignin){
        return <VisitorPage />;
    }
    if (!user) {
        return <Redirect to={{
            pathname: "/signin",
            state: { from: location }
          }} />;
    }
    if(matchCreateProfile){
        return <ProfilePage />;
    }

    if(loadingProfile){
        return <LoadingPage />;
    }
    
    if (!profile) {
        return <Redirect to={{
            pathname: "/profile/create",
            state: { from: location }
          }} />;
    }
    return <Dummy />;
}
const MainPage = () => {
    return (
        <Router>
            <Header />
            <AppRouter/>
        </Router>
    )
}

export default MainPage;