import React from 'react';
import { action } from '@storybook/addon-actions';
import { HeaderPresenter } from '../../components/ChatRoom/Header';


export default {
    title: 'ChatRoom/Header',
};

export const Default = () => <HeaderPresenter
    requestCount={0}
    nameEditable={false}
    owner={false}
    onClickEditName={action('click edit name')}
    roomName='Test1'
    onChangeRoomName={action('change room name')}
    onClickShowMoreUser={action('click more')}
    profiles={[
        { id: 'test1', nickname: 'First User' },
        { id: 'test2', nickname: 'Second User' },
    ]} />;

export const UserIconsMax = () => <HeaderPresenter
    requestCount={0}
    owner={true}
    nameEditable={true}
    onClickEditName={action('click edit name')}
    roomName='Test2'
    onChangeRoomName={action('change room name')}
    onClickShowMoreUser={action('click more')}
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
    nameEditable={false}
    onChangeRoomName={action('change room name')}
    onClickEditName={action('click edit name')}
    roomName='Test3'
    onClickShowMoreUser={action('click more')}
    profiles={[
        { id: 'test1', nickname: 'First User' },
        { id: 'test2', nickname: 'Second User' },
        { id: 'test3', nickname: 'Third User' },
        { id: 'test4', nickname: 'Fourth User' },
        { id: 'test5', nickname: 'Fifth User' },
        { id: 'test6', nickname: 'Sixth User' },
    ]} />;

