import React from 'react';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Send, Keyboard } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import { EmojiPicker } from '../Emoji';

type Props = {
    inputMessage: string,
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmitMessage: () => void,
    onSelectEmoji: (emoji: string) => void,
    className?: string,
    multiline?: boolean,
    onSwitchMultiline?: () => void,
};

const AdornmentAdapter = styled.div`
    display : flex;
`;

const InputBox = styled.div`
    display : flex;
    align-items : flex-start;
`;

const Input = ({
    className,
    multiline = false,
    inputMessage,
    handleKeyPress,
    handleChangeInput,
    handleSubmitMessage,
    onSelectEmoji,
    onSwitchMultiline,
}: Props) => {

    return (
        <InputBox className={className}>
            <AdornmentAdapter>
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
                <IconButton onClick={onSwitchMultiline}><Keyboard /></IconButton>
            </AdornmentAdapter>
            <TextField
                fullWidth
                variant='outlined'
                value={inputMessage}
                onKeyPress={handleKeyPress}
                onChange={handleChangeInput}
                multiline={multiline}
                rows={multiline ? 4 : 1}
            />
            <IconButton onClick={handleSubmitMessage}><Send /></IconButton>
        </InputBox>
    )
};

export default Input;