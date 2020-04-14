import React, { useRef, useEffect, useState } from 'react';
import styled, {css} from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

type Variant = 'small' | 'normal';

const small = css`
    max-height : 200px;
    & > .suggestion-list {
        padding-left : ${({theme})=>`${theme.spacing(0.5)}px`};
        padding-right : ${({theme})=>`${theme.spacing(0.5)}px`};
        > .suggestion-list-item {
            padding : 1px;
            > .suggestion-list-item-text{
                > .primary{
                    font-size : 5px;
                }
            }
            > .suggestion-list-item-avatar{
                padding : 1px;
                min-width : 25px;
               > .avatar {
                    width : 20px;
                    height : 20px;
                    font-size : 5px;
               }
            }
        }
    }
`;

const Wrapper = styled(Paper)`
    overflow : scroll;
    ${({suggestionvariant} : {suggestionvariant : Variant}) => {
        if(suggestionvariant === 'small') {
            return `${small}`;
        }
        return ``;
    }}
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
    onClose,
    startAt = 'top',
    variant = 'normal'
}: {
    className?: string,
    suggestion: T[],
    handleSelect: (profile: T) => void,
    focus?: boolean,
    startAt?: 'bottom' | 'top',
    onClose: ()=>void,
    onLeaveFocus?: () => void,
    variant?: Variant
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [focusIndex, setFocusIndex] = useState(0);

    useEffect(() => {
        startAt === 'bottom' ? setFocusIndex(suggestion.length - 1) : setFocusIndex(0);
    }, [startAt, suggestion]);

    useEffect(() => {
        if (focus) ref.current?.focus();
    }, [focus, focusIndex]);

    return (
        <ClickAwayListener onClickAway={() => {
            onClose();
        }}>
            <Wrapper className={className} suggestionvariant={variant}>
                <List className='suggestion-list' onKeyDown={(e) => {
                    if (e.keyCode === 40) { // down
                        setFocusIndex(prev => suggestion.length - 1 > prev ? prev + 1 : prev)
                    }
                    else if (e.keyCode === 38) { // up
                        setFocusIndex(prev => prev > 0 ? prev - 1 : prev);
                    }
                    else if ( e.keyCode === 9 ) { // tab
                        e.preventDefault();
                        focusIndex >= 0 && focusIndex < suggestion.length &&
                            handleSelect(suggestion[focusIndex]);
                    }
                    else if (e.keyCode === 27) { // esc
                        onLeaveFocus && onLeaveFocus();
                    }
                }}>
                    {suggestion.map((s, i) => (
                        <ListItem key={s.id} button className='suggestion-list-item' onClick={() => {
                            handleSelect(s);
                        }}
                            ref={focusIndex === i ? ref : null}>
                            <ListItemAvatar className='suggestion-list-item-avatar'>
                                <Avatar className='avatar'>
                                    {s.nickname[0]}S
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText classes={{
                                root: 'suggestion-list-item-text',
                                primary: 'primary'
                            }}>{s.nickname}</ListItemText>
                        </ListItem>))}
                </List>
            </Wrapper>
        </ClickAwayListener>
    )
};

export default Sugestion;