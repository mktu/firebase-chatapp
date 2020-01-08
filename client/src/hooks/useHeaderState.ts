import { useContext } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import ProfileContext from '../contexts/ProfileContext';
import { logout } from '../services/auth';


export default function () {
    const { profileState, actions } = useContext(ProfileContext);
    const { profile } = profileState;
    const history = useHistory();
    const handleLogout = ()=>{
        logout(actions.unset);
    }
    const jumpToProfile = ()=>{
        history.push('/profile/update');
    }
    return {
        handleLogout,
        profile,
        jumpToProfile
    };
}