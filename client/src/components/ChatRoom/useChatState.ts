import { useState, useContext } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { createMessage } from '../../services/message';

export default function (roomId: string) {
    const [inputMessage, setInputMessage] = useState<string>('');
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    }
    const handleKeyPress =  (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() === 'enter') {
            handleSubmitMessage();
        }
    }
    const handleSubmitMessage = () => {
        createMessage(
            roomId,
            inputMessage,
            profile!.id
        );
        setInputMessage('')
    }
    const onSelectEmoji = (emoji:string)=>{
        setInputMessage(prev=>prev+emoji);
    }
    return {
        inputMessage,
        handleChangeInput,
        handleSubmitMessage,
        handleKeyPress,
        onSelectEmoji
    }
}