import React from 'react';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import { Send } from '@material-ui/icons';
import { EmojiPicker } from '../../../Emoji';
import Suggestion from '../Suggestion';
import { Props } from './types';

const Wrapper = styled.div`
    display : grid;
    grid-template-columns: auto 1fr auto;
    align-items : center;
    & > .input-options {
        display : flex;
    }

    & > .input-content {
        overflow: hidden;
        > .input-editor {
            font-size : 14px;
            max-height: 20vh;
            overflow: scroll;
            border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
            border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
            padding : ${({ theme }) => `${theme.spacing(1)}px`};
        }
        > .input-suggestion{

        }
    }
`;

const Portal = styled.div(({ bottom, left }: { bottom: number, left: number }) => `
    position : absolute;
    bottom : ${bottom}px;
    left : ${left}px;
`)

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
    onLeaveSuggenstionFocus
}: Props<T> ) {
    return (
        <Wrapper className={className} >
            <div className='input-options'>
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
            </div>
            <div className='input-content'>
                <div className='input-editor'>
                    {renderRichEditor()}
                </div>
                {suggestion && (
                    <Portal
                        bottom={suggestion.rect.bottom + suggestion.rect.height}
                        left={suggestion.rect.left}
                    >
                        <Suggestion
                            suggestion={suggestion.profiles}
                            handleSelect={handleSelectMention}
                            onClose={onCloseSuggestion}
                            focus={focusSuggestion}
                            onLeaveFocus={onLeaveSuggenstionFocus}
                            startAt='bottom'
                        />
                    </Portal>
                )}
            </div>
            <div>
                <IconButton onClick={handleSubmitMessage}><Send /></IconButton>
            </div>
        </Wrapper>
    )
};

export default Presenter;