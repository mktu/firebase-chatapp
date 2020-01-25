import { useState } from 'react';
import { loginByGoogle, loginWithAnonymous } from '../../services/auth';
import useErrorState from '../../hooks/useErrorState';


export default function () {
    const [succeeded, setSucceeded] = useState<boolean>(false);
    const { hasError, error, setError } = useErrorState();
    
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