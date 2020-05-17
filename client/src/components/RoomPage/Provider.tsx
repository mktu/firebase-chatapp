import React, { useReducer, useMemo } from 'react';
import { RoomContext } from '../../contexts';
import { initialState as roomInitialState } from '../../contexts/RoomContext';
import ServiceContext, { defaultServices } from './ServiceContext';
import Container, { Props } from './Container';
import { createRoomActions } from '../../actions';
import { roomReducer } from '../../reducers';


const Provider: React.FC<Props> = (props) => {
    const [roomState, dispatchRoom] = useReducer(roomReducer, roomInitialState);
    const roomActions = useMemo(() => createRoomActions(dispatchRoom), [dispatchRoom]);

    return (
        <RoomContext.Provider value={{ roomState, actions: roomActions }}>
            <ServiceContext.Provider value={defaultServices}>
                <Container {...props} />
            </ServiceContext.Provider>
        </RoomContext.Provider>

    )
}


export default Provider;