import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../contexts/AuthContext';
import ProfileContext, {ContactContext} from '../../contexts/ProfileContext';
import ServiceContext from '../../contexts/ServiceContext';
import LoadingPage from '../LoadingPage';
import { getProfiles } from '../../services/profile';
import { LoadingStatus } from '../../constants';
import { Profile, Contact, ContactProfile } from '../../../../types/profile';
import { modifyArrays, filterArrays, mergeObjectArrays } from '../../utils';


export const ProfileListLoader: React.FC<{
    children: (profiles: Profile[]) => React.ReactElement,
    fallback?: () => React.ReactElement,
    loading?: () => React.ReactElement,
    uids: string[]
}> = ({
    children,
    fallback,
    loading,
    uids
}) => {
        const [status, setStatus] = useState<string>(LoadingStatus.Loading);
        const [profiles, setProfiles] = useState<Profile[]>([]);
        useEffect(() => {
            getProfiles(uids, (results) => {
                setProfiles(results);
                setStatus(LoadingStatus.Succeeded);
            }, (cause) => {
                console.error(cause)
                setStatus(LoadingStatus.Failed);
            })
        }, [uids]);
        if (status === LoadingStatus.Loading) {
            return loading ? loading() : null;
        }
        if (status === LoadingStatus.Failed) {
            return fallback ? fallback() : null;
        }
        return children(profiles);
    }

const ProfileLoader: React.FC<{
    children: JSX.Element,
    fallback: () => JSX.Element
}> = ({
    children,
    fallback,
}) => {
        const { userState } = useContext(AuthContext);
        const { actions, profileState } = useContext(ProfileContext);
        const { profile } = profileState;
        const [contacts, setContacts] = useState<Contact[]>([]);
        const [contactProfiles, setContactProfiles] = useState<ContactProfile[]>([]);
        const {
            listenProfile,
            listenProfiles,
            listenContacts
        } = useContext(ServiceContext);
        const [status, setStatus] = useState<string>(LoadingStatus.Loading);
        const { user } = userState;
        useEffect(() => {
            let unsubscribe: ReturnType<typeof listenProfile> = () => { };
            if (user) {
                unsubscribe = listenProfile(user.uid, (profiles) => {
                    if (profiles.length > 0) {
                        actions.set(profiles[0]);
                        setStatus(LoadingStatus.Succeeded);
                    } else {
                        setStatus(LoadingStatus.Failed);
                    }
                }, (profiles) => {
                    if (profiles.length > 0) {
                        actions.set(profiles[0]);
                    }
                }, (profiles) => {
                    if (profiles.length > 0) {
                        actions.unset();
                    }
                })
            }
            return () => {
                unsubscribe();
            }
        }, [user, actions, listenProfile]);

        useEffect(() => {
            let unsubscribe: ReturnType<typeof listenContacts> = () => { };
            if (profile && profile.id) {
                unsubscribe = listenContacts(profile.id, (contacts) => {
                    setContacts(prev=>[...prev,...contacts]);
                }, (contacts) => {
                    setContacts(prev=>modifyArrays(prev,contacts,'id'))
                }, (contacts) => {
                    setContacts(prev=>filterArrays(prev,contacts,'id'))
                })
            }
            return () => {
                unsubscribe();
                setContacts([]);
            }
        },[profile,listenContacts])

        useEffect(()=>{
            let unsubscribe: ReturnType<typeof listenProfiles> = () => { };
            if(contacts.length > 0 ){
                listenProfiles(contacts.map(c=>c.id),
                (profiles)=>{
                    const merged = mergeObjectArrays(profiles,contacts,(v,t)=>v.id===t.id);
                    setContactProfiles(prev=>[...prev,...merged])
                },(profiles)=>{
                    const merged = mergeObjectArrays(profiles,contacts,(v,t)=>v.id===t.id);
                    setContactProfiles(prev=>modifyArrays(prev,merged,'id'))
                },(profiles)=>{
                    const merged = mergeObjectArrays(profiles,contacts,(v,t)=>v.id===t.id);
                    setContactProfiles(prev=>filterArrays(prev,merged,'id'))
                })
            }
            return () => {
                unsubscribe();
                setContactProfiles([]);
            }
        },[contacts,listenProfiles])


        if (status === LoadingStatus.Loading) {
            return <LoadingPage message='Loading profile' />
        }
        if (status === LoadingStatus.Failed) {
            return fallback();
        }
        return (
            <ContactContext.Provider value={contactProfiles} >
                {children}
            </ContactContext.Provider>
        )

    };

export default ProfileLoader;