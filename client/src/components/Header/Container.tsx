import React from 'react';
import { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import { ProfileContext, ServiceContext } from '../../contexts';
import SearchBox from './SearchBox';
import {SearchDialog, SearchContainer} from './SearchDialog';
import Presenter from './Presenter';
import User from './User';

const Container: React.FC<{}> = () => {
    const { profileState, actions } = useContext(ProfileContext);
    const { logout } = useContext(ServiceContext);
    const [searchState, setSearchState] = useState({
        show: false,
        keyword: ''
    });
    const { profile } = profileState;
    const history = useHistory();
    const handleLogout = () => {
        logout(actions.unset);
    }
    const jumpToProfile = () => {
        history.push('/profile/update');
    }

    const handleSubmit = (keyword: string) => {
        setSearchState({
            show: true,
            keyword
        })
    }

    const handleJumpToRoot = () => {
        history.push('/rooms');
    }

    return (
        <React.Fragment>
            <Presenter
                profile={profile}
                onClickApp={handleJumpToRoot}
                handleLogout={handleLogout}
                searchBox={
                    <SearchBox className='search-box' handleSubmit={handleSubmit} />
                }
                user={
                    <User onClick={jumpToProfile} imageUrl={profile?.imageUrl} >
                        {profile ? profile.nickname[0] : ''}
                    </User>
                }
            />
            <SearchDialog show={searchState.show} onClose={()=>{
                setSearchState(prev=>({
                    ...prev,
                    show:false
                }))
            }}>
                <SearchContainer keyword={searchState.keyword} onSelect={(roomId,messageId,isContact)=>{
                    if(isContact){
                        history.push(`/rooms/contacts/${roomId}?message=${messageId}`);
                    }else{
                        history.push(`/rooms/${roomId}?message=${messageId}`);
                    }
                    setSearchState({
                        show:false,
                        keyword:''
                    });
                }}/>
            </SearchDialog>
        </React.Fragment>
    )
}

export default Container;