import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';

type Props = {
    children : JSX.Element,
    onSatisfied: (to : string) => JSX.Element,
}

const RedirectWhenUserLoggedIn: React.FC<Props> = ({
    children,
    onSatisfied,
}) => {
    const [redirectPath, setRedirectPath] = useState<string|null>(null);
    const { userState } = useContext(AuthContext);
    const { user } = userState;
    const location = useLocation();
    useEffect(()=>{
        if(user && location.state){
            const { from } = location.state;
            const { pathname } = location;
            if(from && from.pathname !== pathname){
                setRedirectPath(from);
            }
            else{
                setRedirectPath('/');
            }
        }
    },[user,location])


    if(redirectPath!==null){
        return onSatisfied(redirectPath);
    }
    return children;

};

export default RedirectWhenUserLoggedIn;