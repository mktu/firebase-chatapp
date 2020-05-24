import React from 'react';
import { 
    createRoom, 
    registRoomsListener,
    modifyRoom
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
import { registUnreadsListener } from '../services/unreads';

export const defaultServices = {
    // room
    createRoom,
    modifyRoom,
    registRoomsListener,
    // message
    getMessage,
    getLatestMessage,
    getOldestMessage,
    registUnreadsListener,
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

const ServiceContext = React.createContext(defaultServices);

export default ServiceContext;