import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import RoomPage from '../../components/RoomPage';
import ProfileContext, { initialState } from '../../contexts/ProfileContext';
import ServiceContext, { createMock } from '../../contexts/ServiceContext';

export default {
    title: 'RoomPage/Container',
};

const Wrapper = styled.div`
    width : 100vw;
    height : 100vh;
`;

const Container: React.FC<{}> = () => {

    const profile = { id: 'u1', nickname: 'Third User', uid: 'uid1' };

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
            <ServiceContext.Provider value={{
                ...createMock(action),
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
            }}>
                <Wrapper>
                    <RoomPage
                        renderChatRoom={(room) => room.id==='test1' ? (
                            <div>room</div>
                        ) : <div/>}
                        renderRequestRoom={() => (
                            <div>request</div>
                        )}
                        handleLoadRoom={action('handleLoadRoom')}
                    />
                </Wrapper>
            </ServiceContext.Provider>
        </ProfileContext.Provider>

    )
}

export const Default = () => <Container />;