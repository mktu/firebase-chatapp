import React from 'react';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Send } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import {EmojiPicker} from '../Emoji';

type Props = {
    inputMessage: string,
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmitMessage: () => void,
    onSelectEmoji: (emoji: string) =>void,
    className?: string,
};


const InputBox = styled.div`
    display : flex;
    align-items : center;
`;

const Input = ({
    className,
    inputMessage,
    handleKeyPress,
    handleChangeInput,
    handleSubmitMessage,
    onSelectEmoji,
}: Props) => {

    return (
        <InputBox className={className}>
            <TextField
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <EmojiPicker onSelectEmoji={onSelectEmoji}/>
                        </InputAdornment>
                    ),
                }}
                fullWidth
                variant='outlined'
                value={inputMessage}
                onKeyPress={handleKeyPress}
                onChange={handleChangeInput} />
            <IconButton onClick={handleSubmitMessage}><Send /></IconButton>
        </InputBox>
    )
};

export default Input;