import { useState, useContext } from 'react';

type HandleSubmit = (roomName : string)=>void;

export default function ( transfer : HandleSubmit ) {
    const [roomName, setRoomName] = useState<string>('');
    const handleChangeName = (e : React.ChangeEvent<HTMLInputElement>)=>{
        setRoomName(e.target.value);
    }
    const handleSubmit = () => {
        transfer(roomName);
    }
    return {
        roomName,
        handleChangeName, 
        handleSubmit
    }
}