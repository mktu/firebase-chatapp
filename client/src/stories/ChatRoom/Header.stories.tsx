import React from 'react';
import { action } from '@storybook/addon-actions';
import { HeaderPresenter } from '../../components/ChatRoom/Header';


export default {
    title: 'ChatRoom/Header',
};

export const Default = () => <HeaderPresenter
    requestCount={0}
    owner={false}
    onClickRequest={action('click request')}
    onClickSetting={action('clisk setting')}
    roomName='Test1'
    onClickShare={action('click more')}
    profiles={[
        { id: 'test1', nickname: 'First User' },
        { id: 'test2', nickname: 'Second User' },
    ]} />;

export const UserIconsMax = () => <HeaderPresenter
    requestCount={0}
    owner={true}
    onClickRequest={action('click request')}
    onClickSetting={action('clisk setting')}
    roomName='Test2'
    onClickShare={action('click more')}
    profiles={[
        { id: 'test1', nickname: 'First User' },
        { id: 'test2', nickname: 'Second User' },
        { id: 'test3', nickname: 'Third User' },
        { id: 'test4', nickname: 'Fourth User' },
        { id: 'test5', nickname: 'Fifth User' },
        { id: 'test6', nickname: 'Sixth User' },
    ]} />;

    export const JoinRequests = () => <HeaderPresenter
    requestCount={3}
    owner={true}
    onClickRequest={action('click request')}
    onClickSetting={action('clisk setting')}
    roomName='Test3'
    onClickShare={action('click more')}
    profiles={[
        { id: 'test1', nickname: 'First User' },
        { id: 'test2', nickname: 'Second User' },
        { id: 'test3', nickname: 'Third User' },
        { id: 'test4', nickname: 'Fourth User' },
        { id: 'test5', nickname: 'Fifth User' },
        { id: 'test6', nickname: 'Sixth User' },
    ]} />;

