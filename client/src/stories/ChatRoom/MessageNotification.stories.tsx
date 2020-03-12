import React from 'react';
import { action } from '@storybook/addon-actions';
import {NewItemNotification} from '../../components/InfiniteScrollable';


export default {
    title: 'ChatRoom/Notification',
};

export const Default = () => <NewItemNotification onClick={action('click notification')} show={true}/>;


