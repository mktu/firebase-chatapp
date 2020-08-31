import React from 'react';
import chatapp from './chatapp.gif';

export const ChatApp = ({...props})=>{
    return <img src={chatapp} {...props} alt='chatapp'/>;
}