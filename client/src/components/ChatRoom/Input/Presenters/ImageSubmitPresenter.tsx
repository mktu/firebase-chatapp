import React from 'react';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import { EmojiPicker } from '../../../Emoji';

const InputContent = styled.div`
    overflow: hidden;
    border-color : ${({ theme }) => `${theme.palette.divider}`};
    border-style: solid;
    border-width: 1px;
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    > .input-editor {
        font-size : 14px;
        max-height: 20vh;
        overflow: scroll;
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;


const Wrapper = styled.div`
    
    & > .input-wrapper {
        display : grid;
        grid-template-columns: auto 1fr;
        align-items : center;
        margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
        > .input-options {
            display : flex;
        }
    }
`;

export type Props = {
    className?: string,
    onSelectEmoji: (emoji: string) => void,
    suggestion: React.ReactElement,
    richEditor: React.ReactElement,
    images: React.ReactElement,
    fileList : React.ReactElement
}

function Presenter({
    className,
    suggestion,
    onSelectEmoji,
    richEditor,
    images,
    fileList,
}: Props) {
    return (
        <Wrapper className={className} >
            <div className='input-wrapper'>
                <div className='input-options' >
                    <EmojiPicker onSelectEmoji={onSelectEmoji} />
                </div>
                <InputContent >
                    <div className='input-editor' >
                        {richEditor}
                    </div>
                    {suggestion}
                </InputContent>
            </div>
            <div>
                {fileList}
            </div>
            <div>
                {images}
            </div>
        </Wrapper>
    )
};

export default Presenter;