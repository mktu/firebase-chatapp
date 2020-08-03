import React, { useState } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import RoomPage from '../../components/RoomPage';
import RequestRoom from '../../components/RequestRoom';
import ProfileContext, { initialState, ContactContext } from '../../contexts/ProfileContext';
import ServiceContext, { createMock } from '../../contexts/ServiceContext';

export default {
    title: 'RoomPage/Container',
};

const Wrapper = styled.div`
    width : 100vw;
    height : 100vh;
`;

const Container: React.FC<{ requestId?: string }> = ({ requestId }) => {

    const profile = { id: 'u1', nickname: 'Third User', uid: 'uid1' };
    const [contact, setContact] = useState({
        id: 'u2',
        uid: 'u2',
        imageUrl: 'https://via.placeholder.com/200',
        nickname: 'tetsuo',
        state: true
    })

    return (
        <ProfileContext.Provider value={{
            profileState: {
                ...initialState,
                profile
            },
            actions: {
                set: () => { },
                unset: () => { },
                loading: () => { }
            }
        }}>
            <ContactContext.Provider value={[contact]} >
                <ServiceContext.Provider value={{
                    ...createMock(action),
                    createContact: (_, __, cb) => {
                        setTimeout(() => {
                            setContact(c => ({ ...c, roomId: 'test6' }))
                            cb('test6')
                        }, 1000);
                    },
                    registRoomsListener: (onAdded) => {
                        onAdded([
                            { roomName: 'TestRoom1', id: 'test1', users: ['u1,u2,u3'], ownerId: 'u1' },
                            { roomName: 'TestRoom2', id: 'test2', users: ['u1,u2,u3'], ownerId: 'u2' },
                            { roomName: 'TestRoom3', id: 'test3', users: ['u1,u2,u3'], ownerId: 'u3' },
                            { roomName: 'TestRoom4', id: 'test4', users: ['u1,u2,u3'], ownerId: 'u3' },
                            { roomName: 'TestRoom5', id: 'test5', users: ['u1,u2,u3'], ownerId: 'u3' },
                            { roomName: 'TestRoom6', id: 'test5', users: ['u1,u2,u3'], ownerId: 'u3' },
                            { roomName: 'TestRoom7', id: 'test5', users: ['u1,u2,u3'], ownerId: 'u3' },
                        ])
                        return () => {

                        }
                    },
                    getRoom: (id, onSucceed) => {
                        onSucceed({
                            roomName: 'TestRoom8', id: 'test6', users: ['u4'], ownerId: 'u4'
                        })
                    },
                    listenJoinRequestsByUser: (roomId, profileId, onAdded) => {
                        onAdded([{
                            status: 'requesting',
                            profileId: 'u2',
                            nickName: 'tetsuo',
                            date: Date.now(),
                            id: '1234'
                        }])

                        return () => {

                        }
                    }
                }}>
                    <Wrapper>
                        <RoomPage
                            renderChatRoom={(room) => (room.id === 'test1' && !requestId) ? (
                                <div>room</div>
                            ) : <div />}
                            handleLoadRoom={action('handleLoadRoom')}
                            handleLoadContactRoom={action('handleLoadContactRoom')}
                            handleRequest={action('handleRequest')}
                            requestRoom={requestId ? (
                                <RequestRoom roomId={requestId} fallback={
                                    () => (
                                        <div>
                                            fallback
                                        </div>
                                    )
                                } accepted={
                                    <div>
                                        accepted
                                    </div>
                                } />
                            ) : undefined}
                        />
                    </Wrapper>
                </ServiceContext.Provider>
            </ContactContext.Provider>

        </ProfileContext.Provider>

    )
}

export const Default = () => <Container />;
export const Request = () => <Container requestId={'test6'} />;