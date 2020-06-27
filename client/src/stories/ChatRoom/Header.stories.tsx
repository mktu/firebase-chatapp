import React from 'react';
import { action } from '@storybook/addon-actions';
import Header from '../../components/ChatRoom/Header';
import ServiceContext, { createMock } from '../../contexts/ServiceContext';
import { JoinRequest } from '../../../../types/request';


export default {
    title: 'ChatRoom/Header',
};

const Provider = ({
    children,
    requests = []
}: {
    children: React.ReactElement,
    requests?: JoinRequest[]
}) => (
        <ServiceContext.Provider value={{
            ...createMock(action),
            listenJoinRequests: (_, onAdd) => {
                onAdd(requests)
                return () => { }
            }
        }}>
            {children}
        </ServiceContext.Provider>
    )

export const Default = () => (
    <Provider>
        <Header
            modifyRoom={action('modifyRoom')}
            updateRequest={action('updateRequest')}
            owner={false}
            room={{
                roomName: 'Test1',
                ownerId: 'test1',
                users: ['test1', 'test2'],
                id: 'Test1',
            }}
            profiles={[
                { uid: '1', id: 'test1', nickname: 'First User' },
                { uid: '2', id: 'test2', nickname: 'Second User' },
            ]} />
    </Provider>
);

export const UserIconsMax = () => (
    <Provider>
        <Header
            modifyRoom={action('modifyRoom')}
            updateRequest={action('updateRequest')}
            owner={false}
            room={{
                roomName: 'Test1',
                ownerId: 'test1',
                users: ['test1', 'test2'],
                id: 'Test1',
            }}
            profiles={[
                { uid: '1', id: 'test1', nickname: 'First User' },
                { uid: '2', id: 'test2', nickname: 'Second User' },
                { uid: '3', id: 'test3', nickname: 'Third User' },
                { uid: '4', id: 'test4', nickname: 'Fourth User' },
                { uid: '5', id: 'test5', nickname: 'Fifth User' },
                { uid: '6', id: 'test6', nickname: 'Sixth User' },
            ]} />
    </Provider>
);

export const JoinRequests = () => (
    <Provider requests={[
        {
            status: 'requesting',
            profileId: '7',
            nickName: 'test7',
            date: 1,
            id: 'test7',
        },
        {
            status: 'requesting',
            profileId: '8',
            nickName: 'test8',
            date: 1,
            id: 'test8',
        },
        {
            status: 'requesting',
            profileId: '9',
            nickName: 'test9',
            date: 1,
            id: 'test9',
        }
    ]}>
        <Header
            owner={true}
            modifyRoom={action('modifyRoom')}
            updateRequest={action('updateRequest')}
            room={{
                roomName: 'Test1',
                ownerId: 'test1',
                users: ['test1', 'test2'],
                id: 'Test1',
            }}
            profiles={[
                { uid: '1', id: 'test1', nickname: 'First User' },
                { uid: '2', id: 'test2', nickname: 'Second User' },
                { uid: '3', id: 'test3', nickname: 'Third User' },
                { uid: '4', id: 'test4', nickname: 'Fourth User' },
                { uid: '5', id: 'test5', nickname: 'Fifth User' },
                { uid: '6', id: 'test6', nickname: 'Sixth User' },
            ]} />
    </Provider>
);

