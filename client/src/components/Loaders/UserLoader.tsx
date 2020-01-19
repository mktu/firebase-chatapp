import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../contexts/AuthContext';
import LoadingPage from '../LoadingPage';
import { listenAuthState } from '../../services/auth';
import { LoadingStatus } from '../../constants';

type Props = {
    children: () => JSX.Element,
    fallback: () => JSX.Element,
}

const UserLoader: React.FC<Props> = ({
    children,
    fallback,
}) => {
    const { actions } = useContext(AuthContext);
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    useEffect(() => {
        return listenAuthState((user)=>{
            actions.login!(user);
            setStatus(LoadingStatus.Succeeded);
        }, ()=>{
            actions.logout!();
            setStatus(LoadingStatus.Failed);
        });
    }, [actions]);
    if(status===LoadingStatus.Loading){
        return <LoadingPage message='Loading user'/>
    }
    if(status===LoadingStatus.Failed){
        return fallback();
    }
    return children();

};

export default UserLoader;