import React from 'react';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';

const defaultRoom:Room = {
    roomName: '',
    ownerId: '',
    users: [],
    id: ''
};
const defaultProfile:Profile = {
    nickname: '',
    uid: '',
    id: '',
}
const defaultUsers:Profile[] = [];



export const ChatroomContext = React.createContext(defaultRoom);
export const MyProfileContext = React.createContext(defaultProfile);
export const UsersContext = React.createContext(defaultUsers);
