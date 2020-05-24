import React from 'react';
import { action } from '@storybook/addon-actions';
import {RequestPresenter} from '../../components/ChatRoom/Header/RequestsDialog';


export default {
    title: 'ChatRoom/Request',
};

export const Default = () => <RequestPresenter 
    handleAcceptRequest={action('accept')} 
    handleRejectRequest={action('reject')}
    onClose={action('closed')}
    show
    requests={[
    { id:'test1', nickName:'First User'},
    { id:'test2', nickName:'Second User'},
]}/>;
