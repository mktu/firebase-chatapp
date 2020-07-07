import React from 'react';
import { action } from '@storybook/addon-actions';
import SingleMessage from '../../components/ChatRoom/Messages/SingleMessage';
import { MyProfileContext, UsersContext } from '../../components/ChatRoom/ChatroomContext';
import { Profile } from '../../../../types/profile';
import ServiceContext, { createMock } from '../../contexts/ServiceContext';


export default {
    title: 'ChatRoom/Message',
};

const Provider = ({
    children,
    profiles,
    profile
}: {
    children: React.ReactElement,
    profiles: Profile[],
    profile: Profile
}) => (
        <UsersContext.Provider value={profiles}>
            <MyProfileContext.Provider value={profile}>
                <ServiceContext.Provider value={{
                    ...createMock(action),
                }}>
                    {children}
                </ServiceContext.Provider>
            </MyProfileContext.Provider>
        </UsersContext.Provider>
    )

export const SentMessage = () => <Provider
    profiles={[
        { id: 'test1', nickname: 'First User', uid: 'test1' },
        { id: 'test2', nickname: 'Second User', uid: 'test2' },
        { id: 'test3', nickname: 'Third User', uid: 'test3' },
        { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
        { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
        { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
    ]}
    profile={{ id: 'test3', nickname: 'Third User', uid: 'test3' }}
>
    <SingleMessage

        message={{
            roomId: 'room',
            message: 'hello',
            id: '1',
            senderId: 'test1',
            senderName: 'test1',
            roomName: 'room',
            date: Date.now()
        }}
        addReaction={action('addReaction')}
        disableMessage={action('disableMessage')}
    />
</Provider>

export const Received = () => <Provider
    profiles={[
        { id: 'test1', nickname: 'First User', uid: 'test1' },
        { id: 'test2', nickname: 'Second User', uid: 'test2' },
        { id: 'test3', nickname: 'Third User', uid: 'test3' },
        { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
        { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
        { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
    ]}
    profile={{ id: 'test3', nickname: 'Third User', uid: 'test3' }}
>
    <SingleMessage

        message={{
            roomId: 'room',
            message: 'hello',
            id: '1',
            senderId: 'test3',
            senderName: 'test3',
            roomName: 'room',
            date: Date.now()
        }}
        addReaction={action('addReaction')}
        disableMessage={action('disableMessage')}
    />
</Provider>;


