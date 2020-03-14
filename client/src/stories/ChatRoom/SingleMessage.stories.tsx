import React from 'react';
import { action } from '@storybook/addon-actions';
import {ReceivedMessage,SentMessage} from '../../components/ChatRoom/SingleMessage';


export default {
    title: 'ChatRoom/Message',
};

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

export const Sent = () => <SentMessage 
    time='2020/10/10 16:00'
    message='This is simple message'
    sender='Test User'
    handleAddReaction={action('handleAddReaction')}
    reactions={{}}
/>;

export const Mention = () => <SentMessage 
    time='2020/10/10 16:00'
    message='@Target This is simple message'
    sender='Test User'
    handleAddReaction={action('handleAddReaction')}
    reactions={{}}
/>;


