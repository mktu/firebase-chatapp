import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import ProfileContext from '../../contexts/ProfileContext';
import VisitorPage from '../VisitorPage';
import ProfilePage from '../ProfilePage';

const Dummy = () => {
    return <div>TBD</div>
}
const MainPage = () => {
    const { userState } = useContext(AuthContext);
    const { profileState } = useContext(ProfileContext);
    if (!userState.user) {
        return <VisitorPage />;
    }
    if(profileState.loading){
        return (<div>Loading...</div>)
    }
    if (!profileState.profile) {
        return <ProfilePage />
    }
    return (
        <Router>
            <Switch>
                <Route path='/' exact component={Dummy} />
            </Switch>
        </Router>
    )
}

export default MainPage;