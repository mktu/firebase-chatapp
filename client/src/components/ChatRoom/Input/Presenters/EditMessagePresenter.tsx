import React from 'react';
import styled, { css } from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { EmojiPicker } from '../../../Emoji';
import Suggestion from '../Suggestion';
import { PresenterProps } from '../types';

const IconButtonStyle = css`
    padding : 1px;
    color : white;
    &:hover{
        background-color : ${({ theme }) => `${theme.palette.action.hover}`};
    }
`;

const Wrapper = styled.div`
    display : grid;
    grid-template-rows: 1fr auto;
    align-items : center;
    overflow : hidden;

    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    
    & > .input-content {
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
        overflow: hidden;
        > .input-editor {
            font-size : 14px;
            max-height: 20vh;
            overflow: scroll;
            
        }
        > .input-suggestion{

        }
    }

    & > .input-menu {
        display : flex;
        justify-content : space-between;
        background-color : ${({ theme }) => `${theme.palette.primary.light}`};
        & > .input-options {
            display : flex;
            margin-left : 5px;
            & > .input-emoji-picker > .input-emoji-picker-button {
                ${IconButtonStyle};
            }
        }
        & > .submit-buttons{
            & > .submit-button{
                ${IconButtonStyle};
            }
        }
    }
    
   
`;

function Presenter<T extends {
    id: string,
    nickname: string
}>({
    className,
    suggestion,
    handleSubmitMessage,
    onSelectEmoji,
    renderRichEditor,
    handleSelectMention,
    focusSuggestion,
    onCloseSuggestion,
    onLeaveSuggenstionFocus,
    onCancel
}: PresenterProps<T>) {
    return (
        <Wrapper className={className} >
            <div className='input-menu'>
                <div className='input-options'>
                    <EmojiPicker onSelectEmoji={onSelectEmoji} classes={{
                        root: 'input-emoji-picker',
                        button: 'input-emoji-picker-button'
                    }} />
                </div>
                <div className='submit-buttons'>
                    <IconButton className='submit-button' onClick={onCancel}><ClearIcon /></IconButton>
                    <IconButton className='submit-button' onClick={handleSubmitMessage}><CheckIcon /></IconButton>
                </div>
            </div>
            <div className='input-content'>
                <div className='input-editor'>
                    {renderRichEditor()}
                </div>
                {suggestion && (
                    <Suggestion
                        suggestion={suggestion.profiles}
                        handleSelect={handleSelectMention}
                        onClose={onCloseSuggestion}
                        focus={focusSuggestion}
                        onLeaveFocus={onLeaveSuggenstionFocus}
                        startAt='top'
                        variant='small'
                    />
                )}
            </div>
        </Wrapper>
    )
};

export default Presenter;