import React from 'react';
import {
    createRoom,
    registRoomsListener,
    modifyRoom,
    deleteRoomPermanently
} from '../services/room';
import { 
    deleteToken, 
    saveToken,
    requestPermission, 
    getToken, 
    getSavedToken, 
    getPermission
 } from '../services/notification';
import { updateRequest, listenJoinRequests } from '../services/request';
import { modifyProfile, getProfile, getProfiles, addProfile, uploadProfileImage } from '../services/profile';
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
    getProfiles,
    getProfile,
    modifyProfile,
    addProfile,
    uploadProfileImage,
    // token
    deleteToken,
    saveToken,
    requestPermission,
    getToken,
    getSavedToken,
    getPermission
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
        getProfile: func('getProfile'),
        modifyProfile: func('modifyProfile'),
        addProfile : func('addProfile'),
        deleteToken : func('deleteToken'),
        saveToken : func('saveToken'),
        requestPermission : func('requestPermission'),
        getToken : func('getToken'),
        getSavedToken : func('getSavedToken'),
        getPermission : ()=>{func('getPermission')(); return 'default'},
        uploadProfileImage : func('uploadProfileImage')
    }
    return mock;
}

const ServiceContext = React.createContext(defaultServices);

export default ServiceContext;