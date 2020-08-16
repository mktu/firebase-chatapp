import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Emoji } from 'emoji-mart'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import EmojiIconButton from './EmojiIconButton';
import Fade from '@material-ui/core/Fade';

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
                TransitionComponent={Fade}
            >
                <div>
                    {emojiActionIds.map(id => (
                        <InsertEmojiButton key={id} onClick={() => {
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

export default AddEmojiReaction;