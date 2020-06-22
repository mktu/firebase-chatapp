import React from 'react';
import { useContext } from 'react';
import { useHistory } from "react-router-dom";
import {ProfileContext, ServiceContext} from '../../contexts';
import SearchBox from './SearchBox';
import Presenter from './Presenter';

const Container: React.FC<{}> = () => {
    const { profileState, actions } = useContext(ProfileContext);
    const { logout } = useContext(ServiceContext);
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

    const handleJumpToRoot = ()=>{
        history.push('/rooms');
    }

    return <Presenter
        profile={profile}
        onClickApp={handleJumpToRoot}
        handleLogout={handleLogout}
        jumpToProfile={jumpToProfile}
        searchBox={
            <SearchBox className='search-box' handleSubmit={handleSubmit} />
        }
    />
}

export default Container;