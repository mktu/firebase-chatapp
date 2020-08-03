import React from 'react';
import {
    createRoom,
    getRoom,
    registRoomsListener,
    registRoomListener,
    modifyRoom,
    deleteRoomPermanently,
    createContact
} from '../services/room';
import { 
    deleteToken, 
    saveToken,
    requestPermission, 
    getToken, 
    getSavedToken, 
    getPermission
 } from '../services/notification';
import { 
    updateRequest, 
    listenJoinRequests,
    listenJoinRequestsByUser,
    createRequest,
    deleteRequest
 } from '../services/request';
import { logout } from '../services/auth';
import { 
    modifyProfile, 
    getProfile, 
    getProfiles, 
    addProfile, 
    uploadProfileImage ,
    listenProfile,
    listenProfiles,
    listenContacts,
    addContact
} from '../services/profile';
import {
    registMessagesListener,
    getMessage,
    getLatestMessage,
    getOldestMessage,
    addReaction,
    createMessage,
    editMessage,
    disableMessage,
    addReadFlags,
    uploadMessageImage
} from '../services/message';

export const defaultServices = {
    // room
    createRoom,
    modifyRoom,
    registRoomsListener,
    registRoomListener,
    deleteRoomPermanently,
    createContact,
    getRoom,
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
    uploadMessageImage,
    // request
    updateRequest,
    listenJoinRequests,
    listenJoinRequestsByUser,
    createRequest,
    deleteRequest,
    // profile
    getProfiles,
    getProfile,
    modifyProfile,
    addProfile,
    uploadProfileImage,
    addContact,
    listenProfile,
    listenProfiles,
    listenContacts,
    // token
    deleteToken,
    saveToken,
    requestPermission,
    getToken,
    getSavedToken,
    getPermission,
    // auth
    logout,
};

export const createMock = (func: (name: string) => (...args: any[]) => void) => {
    const mock: typeof defaultServices = {
        createRoom: func('createRoom'),
        modifyRoom: func('modifyRoom'),
        getRoom: func('getRoom'),
        registRoomsListener: () => {func('registRoomsListener')(); return ()=>{}},
        registRoomListener: () => {func('registRoomListener')(); return ()=>{}},
        deleteRoomPermanently : func('deleteRoomPermanently'),
        createContact : func('createContact'),
        getMessage: func('getMessage'),
        getLatestMessage: func('getLatestMessage'),
        getOldestMessage: () => { },
        registMessagesListener: () => {func('registMessagesListener')(); return ()=>{}},
        addReaction: func('addReaction'),
        createMessage: func('createMessage'),
        editMessage: func('editMessage'),
        disableMessage: func('disableMessage'),
        addReadFlags: func('addReadFlags'),
        uploadMessageImage : ()=>{return new Promise<string>((resolve)=>{func('uploadMessageImage');resolve()})},
        updateRequest: func('updateRequest'),
        listenJoinRequests: () => {func('listenJoinRequests')(); return ()=>{}},
        listenJoinRequestsByUser: () => {func('listenJoinRequestsByUser')(); return ()=>{}},
        createRequest: func('createRequest'),
        deleteRequest: func('deleteRequest'),
        getProfiles: func('getProfiles'),
        getProfile: func('getProfile'),
        modifyProfile: func('modifyProfile'),
        addProfile : func('addProfile'),
        deleteToken : func('deleteToken'),
        addContact : func('addContact'),
        listenProfile : ()=>{func('listenProfile')(); return ()=>{}},
        listenProfiles : ()=>{func('listenProfiles')(); return ()=>{}},
        listenContacts : ()=>{func('listenContacts')(); return ()=>{}},
        saveToken : func('saveToken'),
        requestPermission : func('requestPermission'),
        getToken : func('getToken'),
        getSavedToken : func('getSavedToken'),
        getPermission : ()=>{func('getPermission')(); return 'default'},
        uploadProfileImage : func('uploadProfileImage'),
        logout : func('logout')
    }
    return mock;
}

const ServiceContext = React.createContext(defaultServices);

export default ServiceContext;