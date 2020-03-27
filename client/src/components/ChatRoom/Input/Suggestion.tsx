import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

const Wrapper = styled(Paper)`
    & > .suggestion-list {
        > .suggestion-list-item {
            padding : ${({ theme }) => `${theme.spacing(1)}px`};
        }
    }
`;

function Sugestion<T extends {
    id: string,
    nickname: string
}>({
    className,
    suggestion,
    handleSelect,
    onLeaveFocus,
    focus,
    reverse = false
}: {
    className?: string,
    suggestion: T[],
    handleSelect: (profile: T) => void,
    focus?: boolean,
    reverse?: boolean,
    onLeaveFocus?: () => void
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [focusIndex, setFocusIndex] = useState(0);

    useEffect(() => {
        reverse ? setFocusIndex(suggestion.length - 1) : setFocusIndex(0);
    }, [reverse, suggestion]);

    useEffect(() => {
        if (focus) ref.current?.focus();
    }, [focus, focusIndex]);

    return (
        <ClickAwayListener onClickAway={()=>{
            onLeaveFocus && onLeaveFocus();
        }}>
            <Wrapper className={className} >
                <List className='suggestion-list' onKeyDown={(e) => {
                    if (e.keyCode === 40) { // down
                        setFocusIndex(prev => suggestion.length-1 > prev ? prev + 1 : prev)
                    }
                    else if (e.keyCode === 38) { // up
                        setFocusIndex(prev => prev > 0 ? prev - 1 : prev);
                    }
                    else if(
                        e.keyCode === 39 || // right
                        e.keyCode === 9 // tab
                        ){
                        e.preventDefault();
                        focusIndex >= 0 && focusIndex < suggestion.length && 
                        handleSelect(suggestion[focusIndex]);
                    }
                    else if (
                        e.keyCode === 37 || //left
                        e.keyCode===27) { // esc
                        onLeaveFocus && onLeaveFocus();
                    }
                }}>
                    {suggestion.map((s, i) => (
                        <ListItem key={s.id} button  className='suggestion-list-item' onClick={() => {
                            handleSelect(s);
                        }} 
                        ref={focusIndex === i ? ref : null}>
                            <ListItemAvatar>
                                <Avatar>
                                    {s.nickname[0]}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText className='suggestion-list-item-text'>{s.nickname}</ListItemText>
                        </ListItem>))}
                </List>
            </Wrapper>
        </ClickAwayListener>
    )
};

export default Sugestion;