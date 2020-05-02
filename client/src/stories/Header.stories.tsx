import React from 'react';
import { action } from '@storybook/addon-actions';
import { Presenter } from '../components/Header';


export default {
    title: 'Header',
};

export const Default = () => <Presenter 
    profile={{nickname:'JORJI'}}
    handleLogout={action('logout')}
    jumpToProfile={action('to profile')}
    handleSubmit={action('submit')}
 />;

