import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import ProfileContext from '../../contexts/ProfileContext';

type Props = {
    children : JSX.Element,
    onSatisfied: (to : string) => JSX.Element,
}

const RedirectWhenUserLoggedIn: React.FC<Props> = ({
    children,
    onSatisfied,
}) => {
    const [redirectPath, setRedirectPath] = useState<string|null>(null);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const location = useLocation();
    useEffect(() => {
        if (profile && location.state) {
            const { from } = location.state;
            const { pathname } = location;
            if (from && from.pathname !== pathname) {
                setRedirectPath(from);
            }
            else {
                setRedirectPath('/');
            }
        }
    }, [profile,location])


    if(redirectPath!==null){
        return onSatisfied(redirectPath);
    }
    return children;

};

export default RedirectWhenUserLoggedIn;