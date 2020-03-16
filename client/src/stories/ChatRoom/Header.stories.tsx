import React from 'react';
import { action } from '@storybook/addon-actions';
import {Users} from '../../components/ChatRoom/Header';


export default {
    title: 'ChatRoom/Header',
};

export const UserIcons = () => <Users onClickMore={action('click more')} profiles={[
    { id:'test1', nickname:'First User'},
    { id:'test2', nickname:'Second User'},
]}/>;

export const UserIconsMax = () => <Users onClickMore={action('click more')} profiles={[
    { id:'test1', nickname:'First User'},
    { id:'test2', nickname:'Second User'},
    { id:'test3', nickname:'Third User'},
    { id:'test4', nickname:'Fourth User'},
    { id:'test5', nickname:'Fifth User'},
    { id:'test6', nickname:'Sixth User'},
]}/>;