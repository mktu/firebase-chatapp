import { useContext } from 'react';
import ProfileContext from '../contexts/ProfileContext';
import { logout } from '../services/auth';


export default function () {
    const { profileState, actions } = useContext(ProfileContext);
    const { profile } = profileState;
    
    const handleLogout = ()=>{
        logout(actions.unset);
    }
    return {
        handleLogout,
        profile,
    };
}