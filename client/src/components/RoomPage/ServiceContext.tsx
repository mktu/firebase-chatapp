import React from 'react';
import { createRoom, registRoomsListener } from '../../services/room';
import { registUnreadsListener } from '../../services/unreads';

export const defaultServices = {
    createRoom,
    registUnreadsListener,
    registRoomsListener
};

const ServiceContext = React.createContext(defaultServices);

export default ServiceContext;