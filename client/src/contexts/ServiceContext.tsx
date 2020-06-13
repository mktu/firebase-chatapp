import React from 'react';
import {
    createRoom,
    registRoomsListener,
    modifyRoom,
    deleteRoomPermanently
} from '../services/room';
import { updateRequest, listenJoinRequests } from '../services/request';
import {
    registMessagesListener,
    getMessage,
    getLatestMessage,
    getOldestMessage,
    addReaction,
    createMessage,
    editMessage,
    disableMessage,
    addReadFlags
} from '../services/message';
import { getProfiles } from '../services/profile';

export const defaultServices = {
    // room
    createRoom,
    modifyRoom,
    registRoomsListener,
    deleteRoomPermanently,
    // message
    getMessage,
    getLatestMessage,
    getOldestMessage,
    registMessagesListener,
    addReaction,
    createMessage,
    editMessage,
    disableMessage,
    addReadFlags,
    // request
    updateRequest,
    listenJoinRequests,
    // profile
    getProfiles
};

export const createMock = (func: (name: string) => (...args: any[]) => void) => {
    const mock: typeof defaultServices = {
        createRoom: func('createRoom'),
        modifyRoom: func('modifyRoom'),
        registRoomsListener: () => {func('registRoomsListener')(); return ()=>{}},
        deleteRoomPermanently : func('deleteRoomPermanently'),
        getMessage: func('getMessage'),
        getLatestMessage: func('getLatestMessage'),
        getOldestMessage: () => { },
        registMessagesListener: () => {func('registMessagesListener')(); return ()=>{}},
        addReaction: func('addReaction'),
        createMessage: func('createMessage'),
        editMessage: func('editMessage'),
        disableMessage: func('disableMessage'),
        addReadFlags: func('addReadFlags'),
        updateRequest: func('updateRequest'),
        listenJoinRequests: () => {func('listenJoinRequests')(); return ()=>{}},
        getProfiles: func('getProfiles'),
    }
    return mock;
}

const ServiceContext = React.createContext(defaultServices);

export default ServiceContext;