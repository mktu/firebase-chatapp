import React, { useContext, useState, useEffect } from 'react';
import { ProfileContext, ServiceContext } from '../../contexts';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import * as ChatroomContexts from './ChatroomContext';

export type Props = {
    room: Room,
    children: React.ReactElement
};

const Provider: React.FC<Props> = ({ room, children }) => {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;

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
    }, [room.users, getProfiles]);

    if (!profile) {
        return <div />
    }
    return (
        <ChatroomContexts.ChatroomContext.Provider value={room}>
            <ChatroomContexts.MyProfileContext.Provider value={profile}>
                <ChatroomContexts.UsersContext.Provider value={profiles}>
                    {children}
                </ChatroomContexts.UsersContext.Provider>
            </ChatroomContexts.MyProfileContext.Provider>
        </ChatroomContexts.ChatroomContext.Provider>
    )
}


export default Provider;