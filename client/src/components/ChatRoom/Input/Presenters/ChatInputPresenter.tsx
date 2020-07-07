import React from 'react';
import styled, {css} from 'styled-components';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import { Send } from '@material-ui/icons';
import { EmojiPicker } from '../../../Emoji';

type DropProps = { [key: string]: any };

const dragAccept = css`
    border-color : #00e676;
    border-style: dashed;
    border-width: 2px;
`;
const dragActive = css`
    border-color : #2196f3;
    border-style: dashed;
    border-width: 2px;
`;
const rejected = css`
    border-color : #ff1744;
    border-style: dashed;
    border-width: 2px;
`;
const normal = css`
    border-color : ${({ theme }) => `${theme.palette.divider}`};
    border-style: solid;
    border-width: 1px;
`;

const getBorderStyle = ({
    isDragAccept,
    isDragReject,
    isDragActive
}: DropProps) => {
    if (isDragAccept) {
        return dragAccept;
    }
    if (isDragReject) {
        return rejected;
    }
    if (isDragActive) {
        return dragActive;
    }
    return normal;
}

const InputContent = styled.div`
    overflow: hidden;
    ${(props: DropProps) => getBorderStyle(props)};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    > .input-editor {
        font-size : 14px;
        max-height: 20vh;
        overflow: scroll;
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;


const Wrapper = styled.div`
    display : grid;
    grid-template-columns: auto 1fr auto;
    align-items : center;
    & > .input-options {
        display : flex;
    }
`;

export type Props = {
    className?: string,
    onSelectEmoji: (emoji: string) => void,
    suggestion : React.ReactElement,
    richEditor : React.ReactElement,
    dropZoneRootProps : DropzoneRootProps,
    dropZoneInputProps : DropzoneInputProps,
    handleSubmitMessage: () => void,
}

function Presenter({
    className,
    suggestion,
    onSelectEmoji,
    richEditor,
    dropZoneInputProps,
    dropZoneRootProps,
    handleSubmitMessage
}: Props) {
    return (
        <Wrapper className={className} >
            <div className='input-options' >
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
            </div>
            <InputContent {...dropZoneRootProps}>
                <div className='input-editor' >
                    <input {...dropZoneInputProps}/>
                    {richEditor}
                </div>
                {suggestion}
            </InputContent>
            <div>
                <IconButton onClick={handleSubmitMessage} ><Send /></IconButton>
            </div>
        </Wrapper>
    )
};

export default Presenter;