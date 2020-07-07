import React, { useReducer, useMemo } from 'react';
import { RoomContext, MessagesContext } from '../../contexts';
import { initialState as roomInitialState } from '../../contexts/RoomContext';
import { initialState as messageInitialState } from '../../contexts/MessagesContext';
import CustomTheme, { initialTheme } from './ThemeContext';
import { createRoomActions, createMessageAction } from '../../actions';
import { roomReducer, messageReducer } from '../../reducers';

type Props = {
    children : React.ReactElement
}

const Provider: React.FC<Props> = (props) => {
    const [roomState, dispatchRoom] = useReducer(roomReducer, roomInitialState);
    const roomActions = useMemo(() => createRoomActions(dispatchRoom), [dispatchRoom]);
    const roomContextValue= useMemo(()=>{
        return {
            roomState,
            actions : roomActions
        }
    },[roomState,roomActions])
    const [messageState, dispatchMessages] = useReducer(messageReducer, messageInitialState);
    const messageActions = useMemo(() => createMessageAction(dispatchMessages), [dispatchMessages]);
    const messagesProvided = useMemo(()=>{
        return {
            messageState,
            actions:messageActions
        }
    },[messageState,messageActions])
    return (
        <RoomContext.Provider value={roomContextValue}>
            <MessagesContext.Provider value={messagesProvided} >
                <CustomTheme.Provider value={initialTheme}>
                    {props.children}
                </CustomTheme.Provider>
            </MessagesContext.Provider>
        </RoomContext.Provider>
    )
}


export default Provider;