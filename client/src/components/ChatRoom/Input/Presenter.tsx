import React from 'react';
import styled, { css } from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { Send } from '@material-ui/icons';
import { EmojiPicker } from '../../Emoji';

const Suggestion = css`
 & > .suggestion-paper > .suggestion-list > .suggestion-list-item {
     padding : ${({ theme }) => `${theme.spacing(1)}px`};
 }
`

const Wrapper = styled.div`
    display : grid;
    grid-template-columns: auto 1fr auto;
    
    & > .input-options {
        display : flex;
    }

    & > .input-content {
        overflow: hidden;

        & .input-editor {
            border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
            border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
            padding : ${({ theme }) => `${theme.spacing(1)}px`};
        }

        & .input-suggestion{
            ${Suggestion};
        }
    }
`;



function Presenter<T extends {
    id: string,
    nickname: string
}>({
    className,
    suggestion,
    handleSubmitMessage,
    onSelectEmoji,
    renderRichEditor,
    handleSelectMention,
}: {
    className?: string,
    suggestion: T[],
    handleSelectMention: (profile: T) => void,
    handleSubmitMessage: () => void,
    onSelectEmoji: (emoji: string) => void,
    renderRichEditor: () => React.ReactElement
}) {

    return (
        <Wrapper className={className}>
            <div className='input-options'>
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
            </div>
            <div className='input-content'>
                <div className='input-editor'>
                    {renderRichEditor()}
                </div>
                <div className='input-suggestion'>
                    {suggestion.length > 0 && (
                        <Paper className='suggestion-paper'>
                            <List className='suggestion-list'>
                                {suggestion.map(s => (
                                    <ListItem key={s.id} button className='suggestion-list-item' onClick={() => {
                                        handleSelectMention(s);
                                    }}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {s.nickname[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText className='suggestion-list-item-text'>{s.nickname}</ListItemText>
                                    </ListItem>))}
                            </List>
                        </Paper>
                    )}
                </div>
            </div>
            <div>
                <IconButton onClick={handleSubmitMessage}><Send /></IconButton>
            </div>
        </Wrapper>
    )
};

export default Presenter;