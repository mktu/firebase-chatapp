import { loginByGoogle, loginWithAnonymous } from '../services/auth';
import useErrorState from './useErrorState';


export default function () {
    const { hasError, error, setError } = useErrorState();
    
    const onSucceeded = ()=>{
        console.log('Login succeeded');
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