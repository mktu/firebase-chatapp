import { useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { loginByGoogle, loginWithAnonymous } from '../services/auth';
import { useLocation, useHistory } from "react-router-dom";
import useErrorState from './useErrorState';


export default function () {
    const { userState } = useContext(AuthContext);
    const { user } = userState;
    const { hasError, error, setError } = useErrorState();
    const location = useLocation();
    const history = useHistory();
    
    useEffect(()=>{
        if(user && location.state){
            const { from } = location.state;
            const { pathname } = location;
            if(from && from.pathname !== pathname){
                history.replace(from);
            }
            else{
                history.push('/');
            }
        }
    },[user,history,location])

    const onSucceeded = ()=>{
        history.replace(location.state.from);
    }
    const handleAnonymousLogin = () => {
        loginWithAnonymous(onSucceeded, setError);
    }
    const handleGoogoleLogin = () => {
        loginByGoogle(onSucceeded, setError);
    }
    return {
        handleGoogoleLogin,
        handleAnonymousLogin,
        error,
        hasError,
    };
}