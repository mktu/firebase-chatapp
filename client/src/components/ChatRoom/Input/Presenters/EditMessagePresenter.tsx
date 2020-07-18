import React from 'react';
import styled, { css } from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { EmojiPicker } from '../../../Emoji';

type DropProps = { [key: string]: any };

const dragAccept = css`
    border-color : ${({ theme }) => `${theme.palette.primary.light}`};
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
    return undefined;
}

const IconButtonStyle = css`
    padding : 1px;
    color : white;
    &:hover{
        background-color : ${({ theme }) => `${theme.palette.action.hover}`};
    }
`;

const InputContent = styled.div`
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    overflow: hidden;
    ${(props: DropProps) => getBorderStyle(props)};
    > .input-editor {
        font-size : 14px;
        max-height: 20vh;
        overflow: scroll;
        
    }
`;

const Divider = styled.div`
    border-bottom : 1px solid ${({ theme }) => `${theme.palette.divider}`};
    width : 100%;
`;

const Wrapper = styled.div`
    display : grid;
    grid-template-rows: 1fr auto auto;
    align-items : center;
    overflow : hidden;

    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    
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

type Props = {
    className?: string,
    onSelectEmoji: (emoji: string) => void,
    suggestion : React.ReactElement,
    richEditor : React.ReactElement,
    fileList ?: React.ReactElement,
    dropZoneRootProps : DropzoneRootProps,
    dropZoneInputProps : DropzoneInputProps,
    handleSubmitMessage: () => void,
    onCancel?: () => void,
}

function Presenter({
    className,
    suggestion,
    handleSubmitMessage,
    onSelectEmoji,
    richEditor,
    fileList,
    onCancel,
    dropZoneInputProps,
    dropZoneRootProps
}: Props) {
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
            <InputContent {...dropZoneRootProps}>
                <div className='input-editor' >
                    <input {...dropZoneInputProps} />
                    {richEditor}
                </div>
                {suggestion}
            </InputContent>
            <div className='input-files'>
                {fileList && (
                    <div>
                        <Divider/>
                        {fileList}
                    </div>
                )}
            </div>
        </Wrapper>
    )
};

export default Presenter;