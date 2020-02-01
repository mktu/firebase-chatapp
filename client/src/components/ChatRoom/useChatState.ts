import { useState, useContext } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { createMessage } from '../../services/message';

export default function (roomId: string) {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [multiline, setMultiline] = useState(false);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() === 'enter' && !multiline) {
            handleSubmitMessage();
        }
    }
    const handleSubmitMessage = () => {
        if (inputMessage !== '') {
            createMessage(
                roomId,
                inputMessage,
                profile!.id
            );
            setInputMessage('')
        }
    }
    const onSelectEmoji = (emoji: string) => {
        setInputMessage(prev => prev + emoji);
    }
    const onSwitchMultiline = () => {
        setMultiline(val => !val);
    }
    return {
        inputMessage,
        handleChangeInput,
        handleSubmitMessage,
        handleKeyPress,
        onSelectEmoji,
        multiline,
        onSwitchMultiline
    }
}