import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import { Send } from '@material-ui/icons';
import { EmojiPicker } from '../../../Emoji';
import Suggestion from '../Suggestion';
import { PresenterProps } from '../types';
import { domutil } from '../../../../utils';

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

const Portal: React.FC<{
    container: HTMLElement,
    children: React.ReactElement
}> = ({
    container,
    children
}) => {
        return ReactDOM.createPortal(children, container);
    }

const SuggestionWrapper = styled.div(({ bottom, left }: { bottom: number, left: number }) => `
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
}: PresenterProps<T>) {
    let suggestionRect, container;
    if(suggestion && suggestion.node){
        container = (suggestion.node.ownerDocument?.body) || document.body;
        suggestionRect = domutil.calcRelativePosition(suggestion.node, container);
    }
    return (
        <Wrapper className={className} >
            <div className='input-options'>
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
            </div>
            <div className='input-content'>
                <div className='input-editor'>
                    {renderRichEditor()}
                </div>
                {suggestion && container && suggestionRect && (
                    <Portal container={container}>
                        <SuggestionWrapper
                            bottom={suggestionRect.bottom + suggestionRect.height}
                            left={suggestionRect.left}
                        >
                            <Suggestion
                                suggestion={suggestion.profiles}
                                handleSelect={handleSelectMention}
                                onClose={onCloseSuggestion}
                                focus={focusSuggestion}
                                onLeaveFocus={onLeaveSuggenstionFocus}
                                startAt='bottom'
                            />
                        </SuggestionWrapper>
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