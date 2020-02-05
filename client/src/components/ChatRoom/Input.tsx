import React from 'react';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import { Send, Keyboard } from '@material-ui/icons';
import { EmojiPicker } from '../Emoji';
import {ChatEditor} from './Editor';;

type Props = {
    inputMessage: string,
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleChangeInput: (text: string) => void,
    handleSubmitMessage: () => void,
    onSelectEmoji: (emoji: string) => void,
    className?: string,
    multiline?: boolean,
    onSwitchMultiline?: () => void,
    onEditorMounted:(inserter:(characters:string)=>void,initializer:()=>void)=>void
};

const AdornmentAdapter = styled.div`
    display : flex;
`;

const InputBox = styled.div`
    display : grid;
    grid-template-columns: auto 1fr auto;
    align-items : center;
`;

const EditorWrapper = styled.div`
    overflow-x : hidden;
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
`

const Input = ({
    className,
    multiline = false,
    inputMessage,
    handleKeyPress,
    handleChangeInput,
    handleSubmitMessage,
    onSelectEmoji,
    onSwitchMultiline,
    onEditorMounted
}: Props) => {

    return (
        <InputBox className={className}>
            <AdornmentAdapter>
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
                <IconButton onClick={onSwitchMultiline}><Keyboard /></IconButton>
            </AdornmentAdapter>
            <EditorWrapper>
                <ChatEditor
                    notifyTextChanged={handleChangeInput}
                    onMounted={onEditorMounted}
                />
            </EditorWrapper>
            <IconButton onClick={handleSubmitMessage}><Send /></IconButton>
        </InputBox>
    )
};

export default Input;