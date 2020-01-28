import React, { useState } from 'react';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, BaseEmoji } from 'emoji-mart'
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { InsertEmoticon, Send } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';

type Props = {
    inputMessage: string,
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmitMessage: () => void,
    onSelectEmoji: (emoji: BaseEmoji) =>void,
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <InputBox className={className}>
            <TextField
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={handleClick}>
                                <InsertEmoticon />
                            </IconButton>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }} >
                                <Picker onSelect={onSelectEmoji}/>
                            </Popover>
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