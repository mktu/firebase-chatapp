import React, { useRef } from 'react';
import styled from 'styled-components';
import { Room } from '../../../../types/room';
import { JoinRequest } from '../../../../types/request';
import { Message } from '../../../../types/message';
import ChatRoom from '../../components/ChatRoom';
import { ServiceContext, ProfileContext } from '../../contexts';
import { defaultServices } from '../../contexts/ServiceContext';
import { initialState } from '../../contexts/ProfileContext';
import { action } from '@storybook/addon-actions';

const MAX_PAGE_SIZE = 10;
const ITEM_MAX_IN_PAGE = 20;
const FULL_ITEMS: Message[] = [...Array(ITEM_MAX_IN_PAGE * MAX_PAGE_SIZE).keys()].map(i => ({
    roomId: 'room',
    id: i.toString(),
    date: Date.now() + i,
    message: `this is ${i}`,
    senderId: 'test1',
    senderName: 'test1',
    roomName: 'room'
}));

const Wrapper = styled.div`
    height : 100vh;
`;

export default {
    title: 'ChatRoom/Container',
};

type OnAdded = (message: Message) => void;

const Container: React.FC<{
    className?: string,
    requests: JoinRequest[],
    maxPageSize?: number,
    focus?: string,
    items?: Message[]
}> = ({
    className,
    requests,
    focus,
    items = FULL_ITEMS
}) => {
        const callbacks = useRef<OnAdded[]>([]);
        const profiles = [
            { id: 'test1', nickname: 'First User', uid: 'test1' },
            { id: 'test2', nickname: 'Second User', uid: 'test2' },
            { id: 'test3', nickname: 'Third User', uid: 'test3' },
            { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
            { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
            { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
        ];
        const profile = { id: 'test3', nickname: 'Third User', uid: 'test3' };
        const room: Room = {
            roomName: 'testroom',
            ownerId: 'test3',
            users: profiles.map(p => p.id),
            id: '1'
        }

        return (
            <Wrapper>
                <ServiceContext.Provider value={{
                    ...defaultServices,
                    createMessage: ({ message, mentions }) => {
                        const added: Message = {
                            id: message,
                            message,
                            roomId: room.id,
                            roomName: room.roomName,
                            senderId: profile.id,
                            senderName: profile.nickname,
                            date: Date.now() + items.length,
                            mentions
                        }
                        for (const cb of callbacks.current) {
                            cb(added);
                        }
                    },
                    registMessagesListener: ({
                        limit,
                        order,
                        startAfter,
                        startAt,
                        endAt,
                        onAdded,
                    }) => {
                        const target = order?.order === 'desc' ? items.slice().reverse() : items;
                        let startIndex = -1;
                        let endIndex = - 1;
                        if (startAfter) {
                            startIndex = target.findIndex(item => order?.order === 'desc' ? item.date < startAfter : item.date > startAfter);
                        }
                        if (startAt) {
                            startIndex = target.findIndex(item => order?.order === 'desc' ? item.date <= startAt : item.date >= startAt);
                        }

                        if (limit) {
                            endIndex = startIndex + limit;
                        }
                        // if (endAt) {
                        //     const end = target.findIndex(item=>order.order === 'desc' ? item.date<=endAt : item.date>=endAt);
                        // }
                        startIndex > -1 && endIndex > -1 && setTimeout(() => {
                            const values = target.slice(startIndex, endIndex);
                            onAdded(values);
                        }, 500);

                        const cb = (msg: Message) => {
                            // Can be added only when input from Input component( latest loader )
                            if (order?.order === 'asc' && startAfter) {
                                if (msg.date > startAfter && !endAt) {
                                    onAdded([msg]);
                                }
                            }
                        }
                        callbacks.current.push(cb)
                        return () => {
                            callbacks.current.pop();
                        };
                    },
                    getMessage: ({
                        messageId,
                        onSucceeded
                    }) => {
                        setTimeout(() => {
                            const item = items.find(item => item.id === messageId);
                            item && onSucceeded(item);
                        }, 500);
                    },
                    getOldestMessage: ({ onAdded }) => {
                        setTimeout(() => {
                            onAdded(items[0])
                        }, 500);
                    },
                    getLatestMessage: ({ onAdded }) => {
                        setTimeout(() => {
                            onAdded(items[items.length - 1])
                        }, 500);
                    },
                    addReaction: action('add reaction'),
                    editMessage: action('edit message'),
                    disableMessage: action('delete message'),
                    modifyRoom: action('modify room'),
                    updateRequest: action('updateRequest'),
                    listenJoinRequests: (_, onAdded) => {
                        onAdded(requests);
                        return () => { }
                    },
                    getProfiles: (_, onSucceeded) => {
                        onSucceeded(profiles)
                    },
                    addReadFlags: action('read flags'),
                }}>
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
                        <ChatRoom
                            room={room}
                            show
                            focusMessageId={focus}
                        />
                    </ProfileContext.Provider>
                </ServiceContext.Provider>
            </Wrapper>
        )
    };


export const Default = () => <Container requests={[]} />;
export const FocusTop = () => <Container focus={'0'} requests={[]} />;
export const FocusMiddle = () => <Container focus={'50'} requests={[]} />;
export const FocusBottom = () => <Container focus={'199'} requests={[]} />;
export const FewItems = () => <Container items={FULL_ITEMS.slice(0, 1)} requests={[]} />;
export const Empty = () => <Container requests={[]} items={[]} />;
export const WithSendMessage = () => <Container requests={[]} items={[...FULL_ITEMS, {
    roomId: 'room',
    id: `${FULL_ITEMS.length + 1}`,
    date: Date.now() + FULL_ITEMS.length + 1,
    message: `this is ${FULL_ITEMS.length + 1}`,
    senderId: 'test3',
    senderName: 'test3',
    roomName: 'room'
}]} />;
export const Requests = () => <Container requests={[
    { id: 'test1', nickName: 'First User', date: Date.now(), status: 'requesting', profileId: 'test1p' },
    { id: 'test2', nickName: 'Second User', date: Date.now(), status: 'requesting', profileId: 'test2p' },
]} />;