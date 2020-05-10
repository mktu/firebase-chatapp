import React from 'react';
import { action } from '@storybook/addon-actions';
import SingleMessage from '../../components/ChatRoom/Messages/SingleMessage';


export default {
    title: 'ChatRoom/Message',
};

export const SentMessage = () => <SingleMessage
    profiles={[
        { id: 'test1', nickname: 'First User', uid: 'test1' },
        { id: 'test2', nickname: 'Second User', uid: 'test2' },
        { id: 'test3', nickname: 'Third User', uid: 'test3' },
        { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
        { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
        { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
    ]}
    profile={{ id: 'test3', nickname: 'Third User', uid: 'test3' }}
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
    editMessage={action('editMessage')}
    disableMessage={action('disableMessage')}
/>

export const Received = () => <SingleMessage
    profiles={[
        { id: 'test1', nickname: 'First User', uid: 'test1' },
        { id: 'test2', nickname: 'Second User', uid: 'test2' },
        { id: 'test3', nickname: 'Third User', uid: 'test3' },
        { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
        { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
        { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
    ]}
    profile={{ id: 'test3', nickname: 'Third User', uid: 'test3' }}
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
    editMessage={action('editMessage')}
    disableMessage={action('disableMessage')}
/>;


