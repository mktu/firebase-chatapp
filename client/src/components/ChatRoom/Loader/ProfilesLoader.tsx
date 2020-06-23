import React, { useEffect, useState, useContext } from 'react';
import { Room } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import { ServiceContext } from '../../../contexts';

export type Props = {
    room: Room,
    children : (profiles : Profile[])=>React.ReactElement
}

const ProfilesLoader: React.FC<Props> = ({
    room,
    children
}) => {
    const { getProfiles } = useContext(ServiceContext);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        let unsubscribed = false;
        getProfiles(room.users, (results) => {
            !unsubscribed && setProfiles(results);
        }, (cause) => {
            console.error(cause)
        })
        return () => {
            unsubscribed = true;
        }
    }, [room.users,getProfiles]);


    return children(profiles)
}


export default ProfilesLoader;