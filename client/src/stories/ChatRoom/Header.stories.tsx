import React from 'react';
import { action } from '@storybook/addon-actions';
import Header from '../../components/ChatRoom/Header';
import { ChatroomContext, UsersContext } from '../../components/ChatRoom/ChatroomContext';
import ServiceContext, { createMock } from '../../contexts/ServiceContext';
import { JoinRequest } from '../../../../types/request';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';


export default {
    title: 'ChatRoom/Header',
};

const Provider = ({
    children,
    room,
    profiles,
    requests = []
}: {
    children: React.ReactElement,
    requests?: JoinRequest[],
    room: Room,
    profiles: Profile[]
}) => (
        <ChatroomContext.Provider value={room}>
            <UsersContext.Provider value={profiles} >
                <ServiceContext.Provider value={{
                    ...createMock(action),
                    listenJoinRequests: (_, onAdd) => {
                        onAdd(requests)
                        return () => { }
                    }
                }}>
                    {children}
                </ServiceContext.Provider>
            </UsersContext.Provider>
        </ChatroomContext.Provider>
    )

export const Default = () => (
    <Provider
        room={{
            roomName: 'Test1',
            ownerId: 'test1',
            users: ['test1', 'test2'],
            id: 'Test1',
        }}
        profiles={[
            { uid: '1', id: 'test1', nickname: 'First User' },
            { uid: '2', id: 'test2', nickname: 'Second User' },
        ]}
    >
        <Header
            owner={false}
        />
    </Provider >
);

export const UserIconsMax = () => (
    <Provider
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
        ]}
    >
        <Header
            owner={false}
        />
    </Provider >
);

export const JoinRequests = () => (
    <Provider
        room={{
            roomName: 'Test1',
            ownerId: 'test1',
            users: ['test1', 'test2'],
            id: 'Test1',
        }}
        requests={[
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
        ]}
        profiles={[
            { uid: '1', id: 'test1', nickname: 'First User' },
            { uid: '2', id: 'test2', nickname: 'Second User' },
            { uid: '3', id: 'test3', nickname: 'Third User' },
            { uid: '4', id: 'test4', nickname: 'Fourth User' },
            { uid: '5', id: 'test5', nickname: 'Fifth User' },
            { uid: '6', id: 'test6', nickname: 'Sixth User' },
        ]}
    >
        <Header
            owner={true}
        />
    </Provider>
);

