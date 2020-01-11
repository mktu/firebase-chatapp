import { useState, useContext, useEffect } from 'react';
import RoomContext from '../contexts/RoomContext';
import ProfileContext from '../contexts/ProfileContext';
import { createRoom, registListener } from '../services/room';


export default function () {
    const [showNewRoom, setShowNewRoom] = useState<boolean>(false);
    const { roomState, actions : roomActions } = useContext(RoomContext);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id : profileId } = profile || {};

    useEffect(()=>{
        let unsubscribe : ReturnType<typeof registListener> = ()=>{};
        if(profileId){
            unsubscribe = registListener((rooms)=>{
                roomActions.add(rooms);
            }, (rooms)=>{
                roomActions.modify(rooms);
            }, (rooms)=>{
                roomActions.delete(rooms);
            },profileId);
        }
        return unsubscribe;
    },[profileId,roomActions])

    const hideDialog = ()=>{
        setShowNewRoom(false);
    }
    const showDialog = ()=>{
        setShowNewRoom(true);
    }
    const handleSubmit = (roomName : string) => {
        profileId && createRoom(
            roomName,
            profileId,
            ()=>{
                console.log(`Created ${roomName} room.`);
            }
        );
    }
    return {
        showNewRoom, 
        hideDialog,
        showDialog,
        handleSubmit,
        roomState
    }
}