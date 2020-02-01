import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Emoji,Picker,BaseEmoji } from 'emoji-mart'
import Tooltip from '@material-ui/core/Tooltip';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import { InsertEmoticon } from '@material-ui/icons';

const EmojiIconButton = styled(IconButton)`
    display : flex;
    justify-content : flex-end;
    align-items : start;
    ${({ theme }) => `
        padding : 2px;
        border-radius :${theme.shape.borderRadius}px;
        border : 1px solid ${theme.palette.divider};
        margin-right : ${theme.spacing(0.5)}px;
    `}
    &:hover{
        background-color : transparent;
    }
`;

const EmojiPickerButton = styled(IconButton)`
`;

const emojiActionIds = [
    'grinning', 'thumbsup', 'cry', 'sweat', 'rage'
];

const InsertEmojiButton = styled(IconButton)`
    padding : 5px;
`;

const AddEmojiReaction = ({
    className,
    handleAddReaction,
    anchorOrigin = {
        vertical: 'top',
        horizontal: 'center',
    },
    transformOrigin = {
        vertical: 'bottom',
        horizontal: 'right',
    }
}: {
    className?: string,
    anchorOrigin?: PopoverOrigin,
    transformOrigin?: PopoverOrigin,
    handleAddReaction: (reactionId: string) => void
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleShowEmoPicker = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl]);
    const handleCloseEmoPicker = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);
    const open = Boolean(anchorEl);

    return useMemo(() => (
        <div className={className}>
            <EmojiIconButton onClick={handleShowEmoPicker} disableRipple disableTouchRipple>
                <React.Fragment>
                    <InsertEmoticonIcon fontSize='small' />
                    <AddCircleOutlineIcon style={{ fontSize: 15 }} />
                </React.Fragment>
            </EmojiIconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseEmoPicker}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            >
                <div>
                    {emojiActionIds.map(id => (
                        <InsertEmojiButton onClick={() => {
                            handleAddReaction(id);
                        }}>
                            <Emoji key={id} emoji={id} size={16} />
                        </InsertEmojiButton>
                    ))}
                </div>
            </Popover>
        </div>)
        , [
            anchorEl,
            handleShowEmoPicker,
            handleCloseEmoPicker,
            open,
            className,
            anchorOrigin,
            transformOrigin,
            handleAddReaction
        ])
}


const EmojiReactions = ({ reactions, className, handleAddReaction = () => { }, readonly = false }: {
    reactions: { [s: string]: string[] },
    className?: string,
    readonly?: boolean,
    handleAddReaction?: (reactionId: string) => void
}) => {
    const reactionIds = useMemo(() => Object.keys(reactions), [reactions]);
    return useMemo(() => (
        <div className={className}>
            {reactionIds.map(id => (
                <Tooltip title={reactions[id].map(name => (
                    <div>{name}</div>
                ))} placement="top">
                    <div>
                        <EmojiIconButton disabled={readonly} key={id} onClick={() => {
                            handleAddReaction(id);
                        }}>
                            <Emoji emoji={id} size={16} />
                            <Typography variant='caption' color='textSecondary'>{reactions[id].length}</Typography>
                        </EmojiIconButton>
                    </div>
                </Tooltip>
            ))}
        </div>
    ), [reactions, className, handleAddReaction, readonly, reactionIds]);
}

const EmojiPicker = ({ 
    onSelectEmoji,
    className,
    anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
    },
    transformOrigin = {
        vertical: 'top',
        horizontal: 'center',
    }
}:{
    onSelectEmoji : (emoji:string)=>void,
    className?:string,
    anchorOrigin?: PopoverOrigin,
    transformOrigin?: PopoverOrigin,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl=>anchorEl ? null : event.currentTarget);
    },[setAnchorEl]);
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    },[setAnchorEl]);
    const open = Boolean(anchorEl);

    const onSelect = useCallback((emoji:BaseEmoji)=>{
        onSelectEmoji(emoji.native);
    },[onSelectEmoji]);
    return (
        <div className={className}>
            <EmojiPickerButton onClick={handleClick}>
                <InsertEmoticon />
            </EmojiPickerButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin} >
                <Picker onSelect={onSelect} />
            </Popover>
        </div>)
}

export {
    AddEmojiReaction,
    EmojiReactions,
    EmojiPicker
}
