import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../contexts/AuthContext';
import ProfileContext from '../../contexts/ProfileContext';
import LoadingPage from '../LoadingPage';
import { listenProfile, getProfiles } from '../../services/profile';
import { LoadingStatus } from '../../constants';
import { Profile } from '../../types/profile';


export const ProfilesLoader: React.FC<{
    children: (profiles:Profile[])=>JSX.Element,
    fallback: () => JSX.Element,
    loading: ()=>JSX.Element,
    uids: string[]
}> = ({
    children,
    fallback,
    loading,
    uids
})=>{
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    useEffect(()=>{
        getProfiles(uids,(results)=>{
            setProfiles(results);
            setStatus(LoadingStatus.Succeeded);
        }, (cause)=>{
            console.error(cause)
            setStatus(LoadingStatus.Failed);
        })
    },[uids]);
    if(status===LoadingStatus.Loading){
        return loading();
    }
    if(status===LoadingStatus.Failed){
        return fallback();
    }
    return children(profiles);
}

type Props = {
    children: JSX.Element,
    fallback: () => JSX.Element,
}

const UserLoader: React.FC<Props> = ({
    children,
    fallback,
}) => {
    const { userState } = useContext(AuthContext);
    const { actions } = useContext(ProfileContext);
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const { user } = userState;
    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenProfile> = () => { };
        if (user) {
            unsubscribe = listenProfile(user.uid, (profiles)=>{
                if(profiles.length > 0){
                    actions.set(profiles[0]);
                    setStatus(LoadingStatus.Succeeded);
                }else{
                    setStatus(LoadingStatus.Failed);
                }
            }, (profiles)=>{
                if(profiles.length > 0){
                    actions.set(profiles[0]);
                } 
            }, (profiles)=>{
                if(profiles.length > 0 ){
                    actions.unset();
                }
            })
        }
        return ()=>{
            unsubscribe();
        }
    }, [user,actions]);
    if(status===LoadingStatus.Loading){
        return <LoadingPage message='Loading profile'/>
    }
    if(status===LoadingStatus.Failed){
        return fallback();
    }
    return children;

};

export default UserLoader;