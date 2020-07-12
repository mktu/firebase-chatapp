import React from 'react';
import { action } from '@storybook/addon-actions';
import InputContainer, { MessageEditor } from '../../components/ChatRoom/Input';
import { UsersContext } from '../../components/ChatRoom/ChatroomContext';
import ServiceContext, { createMock } from '../../contexts/ServiceContext';
import { Profile } from '../../../../types/profile';

export default {
    title: 'ChatRoom/Input',
};

const Provider = ({
    children,
    profiles,
}: {
    children: React.ReactElement,
    profiles: Profile[]
}) => (
        <UsersContext.Provider value={profiles} >
            <ServiceContext.Provider value={{
                ...createMock(action),
            }}>
                {children}
            </ServiceContext.Provider>
        </UsersContext.Provider>
    )

export const Default = () => <Provider
    profiles={[
        { id: 'test1', nickname: 'First User', uid: 'test1' },
        { id: 'test2', nickname: 'Second User', uid: 'test2' },
        { id: 'test3', nickname: 'Third User', uid: 'test3' },
        { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
        { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
        { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
    ]}
>
    <InputContainer />
</Provider>;

export const EditMessage = () => <Provider
    profiles={[
        { id: 'test1', nickname: 'First User', uid: 'test1' },
        { id: 'test2', nickname: 'Second User', uid: 'test2' },
        { id: 'test3', nickname: 'Third User', uid: 'test3' },
        { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
        { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
        { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
    ]}
>
    <MessageEditor
        onCancel={action('onCancel')}
        message={{
            id:'test',
            message:'test',
            senderId : 'testuser',
            senderName : 'testuser',
            date : 1,
            roomName : 'testroom',
            roomId:'testroom'
        }}
        onSubmit={action('onSubmit')}
    />
</Provider>