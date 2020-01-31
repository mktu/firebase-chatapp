import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Emoji } from 'emoji-mart'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';

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

const emojiActionIds = [
    'grinning', 'thumbsup', 'cry', 'sweat', 'rage'
];

const InsertEmojiButton = styled(IconButton)`
    padding : 5px;
`;

const defaultAnchorOrigin : PopoverOrigin = {
    vertical: 'top',
    horizontal: 'center',
};

const defaultTransformOrigin : PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
};

const AddEmojiReaction = ({
    className,
    handleAddReaction,
    anchorOrigin = defaultAnchorOrigin,
    transformOrigin = defaultTransformOrigin
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


const EmojiReactions = ({ reactions, className, handleAddReaction, readonly = false }: {
    reactions: { [s: string]: number },
    className?: string,
    readonly?: boolean,
    handleAddReaction: (reactionId: string) => void
}) => {
    const reactionIds = useMemo(()=>Object.keys(reactions),[reactions]);
    return useMemo(() => (
        <div className={className}>
            {reactionIds.map(id => (
                <EmojiIconButton disabled={readonly} key={id} onClick={() => {
                    handleAddReaction(id);
                }}>
                    <Emoji emoji={id} size={16} />
                    <Typography variant='caption' color='textSecondary'>{reactions[id]}</Typography>
                </EmojiIconButton>
            ))}
        </div>
    ), [reactions, className, handleAddReaction,readonly,reactionIds]);
}

export {
    AddEmojiReaction,
    EmojiReactions
}
