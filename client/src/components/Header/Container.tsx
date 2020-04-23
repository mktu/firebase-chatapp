import React from 'react';
import { useContext } from 'react';
import { useHistory } from "react-router-dom";
import ProfileContext from '../../contexts/ProfileContext';
import { logout } from '../../services/auth';
import Presenter from './Presenter';

const Container: React.FC<{}> = () => {
    const { profileState, actions } = useContext(ProfileContext);
    const { profile } = profileState;
    const history = useHistory();
    const handleLogout = () => {
        logout(actions.unset);
    }
    const jumpToProfile = () => {
        history.push('/profile/update');
    }

    const handleSubmit = (text:string)=>{
        history.push(`/search?keyword=${text}`);
    }

    return <Presenter
        profile={profile}
        handleLogout={handleLogout}
        jumpToProfile={jumpToProfile}
        handleSubmit={handleSubmit}
    />
}

export default Container;