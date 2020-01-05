import { loginByGoogle, loginWithAnonymous } from '../services/auth';
import useErrorState from './useErrorState';


export default function () {
    const { hasError, error, setError } = useErrorState();
    const handleAnonymousLogin = () => {
        loginWithAnonymous(undefined, setError);
    }
    const handleGoogoleLogin = () => {
        loginByGoogle(undefined, setError);
    }
    return {
        handleGoogoleLogin,
        handleAnonymousLogin,
        error,
        hasError,
    };
}