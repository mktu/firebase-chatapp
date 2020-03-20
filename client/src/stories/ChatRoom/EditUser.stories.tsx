import React from 'react';
import { action } from '@storybook/addon-actions';
import {EditUserPresenter} from '../../components/ChatRoom/UsersDialog';


export default {
    title: 'ChatRoom/UserEditor',
};

export const Default = () => <EditUserPresenter 
    show={true}
    onClose={action('close')}
    onDelete={action('delete')}
    owner={true}
    profiles={[
        { id:'test1', nickname:'First User'},
        { id:'test2', nickname:'Second User'},
        { id:'test3', nickname:'Third User'},
        { id:'test4', nickname:'Fourth User'},
        { id:'test5', nickname:'Fifth User'},
        { id:'test6', nickname:'Sixth User'},
]}/>;

