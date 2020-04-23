import React from 'react';
import { action } from '@storybook/addon-actions';
import SingleMessage, {ReceivedMessage} from '../../components/ChatRoom/SingleMessage';


export default {
    title: 'ChatRoom/Message',
};

export const SentMessage = ()=> <SingleMessage 
    roomId='null'
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
        roomId : 'room',
        message : 'hello',
        id : '1',
        profileId : 'test3',
        date : Date.now()
    }}
    addReaction={action('addReaction')}
    editMessage={action('editMessage')}
    disableMessage={action('disableMessage')}
/>

export const Received = () => <ReceivedMessage 
    time='2020/10/10 16:00'
    onHoverReceivedMessage={action('onHoverReceivedMessage')}
    onLeaveReceivedMessage={action('onLeaveReceivedMessage')}
    showEmoAction={true}
    message='This is simple message'
    sender='Test User'
    handleAddReaction={action('handleAddReaction')}
    reactions={{}}
/>;


