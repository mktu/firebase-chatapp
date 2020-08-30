import { useState, useContext } from 'react';
import useErrorState from '../../hooks/useErrorState';
import { ServiceContext } from '../../contexts';


export default function () {
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const { hasError, error, setError } = useErrorState();
    const { loginByGoogle, loginWithAnonymous } = useContext(ServiceContext);
    
    const onSucceeded = ()=>{
        console.log('Login succeeded');
        setSucceeded(true);
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
        succeeded,
        error,
        hasError,
    };
}