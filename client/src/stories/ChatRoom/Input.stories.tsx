import React from 'react';
import { action } from '@storybook/addon-actions';
import Input from '../../components/ChatRoom/Input';


export default {
    title: 'ChatRoom/Input',
};

export const Default = () => <Input
    roomId={'test'}
    profile={{ id: 'test1', nickname: 'First User', uid: 'test1' }}
    profiles={[
        { id: 'test1', nickname: 'First User', uid: 'test1' },
        { id: 'test2', nickname: 'Second User', uid: 'test2' },
        { id: 'test3', nickname: 'Third User', uid: 'test3' },
        { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
        { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
        { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
    ]} 
    submitMessage={(action('create message'))}
    />;

