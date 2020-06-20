import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { SnackbarProvider } from 'notistack';
import { UpdateProfile } from '../../components/Profile';
import ProfileContext, { initialState } from '../../contexts/ProfileContext';
import ServiceContext, { createMock } from '../../contexts/ServiceContext';
import { Profile } from '../../../../types/profile';

export default {
    title: 'Profile/Container',
};

const Provider = (props: { children: React.ReactElement, profile?: Profile }) => {
    return (
        <SnackbarProvider maxSnack={3}>
            <ServiceContext.Provider value={createMock(action)} >
                <ProfileContext.Provider value={{
                    profileState: {
                        ...initialState,
                        profile: props.profile || null
                    },
                    actions: {
                        set: () => { },
                        unset: () => { },
                        loading: () => { }
                    }
                }} >
                    {props.children}
                </ProfileContext.Provider>
            </ServiceContext.Provider>
        </SnackbarProvider>
    )
}

export const Update = () => {
    const profile = { id: 'test3', nickname: 'Third User', uid: 'test3' };
    return (
        <Provider profile={profile}>
            <UpdateProfile />
        </Provider>
    )
}