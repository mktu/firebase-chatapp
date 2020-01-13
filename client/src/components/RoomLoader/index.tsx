import React from 'react';
import LoadingPage from '../LoadingPage';
import useRoomLoaderState from '../../hooks/useRoomLoaderState';
import { Room, } from '../../types/room';

type Props = {
    roomId : string,
    children : (room : Room)=>JSX.Element;
}

const RoomLoader : React.FC<Props> = ({roomId, children})  => {
    const {room} = useRoomLoaderState({roomId});
    if(!room){
        return (
            <LoadingPage message='loading room'/>
        )
    }
    return children(room);
} ;

export default RoomLoader;