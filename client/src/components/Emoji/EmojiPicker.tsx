import React, { useState, useCallback } from 'react';
import { NimblePicker, BaseEmoji } from 'emoji-mart'
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import data from 'emoji-mart/data/apple.json'
import { InsertEmoticon } from '@material-ui/icons';

const EmojiPicker = ({
    onSelectEmoji,
    className,
    classes = {},
    anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
    },
    transformOrigin = {
        vertical: 'top',
        horizontal: 'center',
    },
}: {
    onSelectEmoji: (emoji: string) => void,
    className?: string,
    anchorOrigin?: PopoverOrigin,
    transformOrigin?: PopoverOrigin,
    classes?:{
        [key in 'root'|'button']? : string
    }
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl => anchorEl ? null : event.currentTarget);
    }, [setAnchorEl]);
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);
    const open = Boolean(anchorEl);

    const onSelect = useCallback((emoji: BaseEmoji) => {
        onSelectEmoji(emoji.native);
        setAnchorEl(null);
    }, [onSelectEmoji]);

    return (
        <div className={className || classes['root']}>
            <IconButton className={classes['button']} onClick={handleClick}>
                <InsertEmoticon />
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin} >
                <NimblePicker onSelect={onSelect}  data={data} sheetSize={32}/>
            </Popover>
        </div>)
}

export default EmojiPicker;