import { useState, useContext, useCallback } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { createMessage } from '../../services/message';

type TextInserter = (characters:string) =>void;
type TextInitializer = ()=>void;

export default function (roomId: string) {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [multiline, setMultiline] = useState(false);
    const [editorCommands, setEditorCommands] = useState<{
        inserter:TextInserter,
        initializer:TextInitializer
    }>({
        inserter:()=>{},initializer:()=>{}
    });
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const handleChangeInput = (text: string) => {
        setInputMessage(text);
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
            editorCommands.initializer();
        }
    }
    const onSelectEmoji = (emoji: string) => {
        editorCommands.inserter(emoji);
    }
    const onSwitchMultiline = () => {
        setMultiline(val => !val);
    }

    const onEditorMounted = useCallback((inserter:(characters:string)=>void,initializer:()=>void)=>{
        setEditorCommands({
            inserter,
            initializer
        });
    },[setEditorCommands]);
    return {
        inputMessage,
        handleChangeInput,
        handleSubmitMessage,
        handleKeyPress,
        onSelectEmoji,
        multiline,
        onSwitchMultiline,
        onEditorMounted
    }
}