import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import 'emoji-mart/css/emoji-mart.css';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { Send, Keyboard } from '@material-ui/icons';
import { EmojiPicker } from '../Emoji';
import ChatEditor from '../Editor';
import { Profile } from '../../types/profile';
import useChatState from './useChatState';

const AdornmentAdapter = styled.div`
    display : flex;
`;

const InputBox = styled.div`
    display : grid;
    grid-template-columns: auto 1fr auto;
    align-items : center;
    & > div {
        overflow: hidden;
    }
`;

const EditorWrapper = styled.div`
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
`

const Suggestion = styled.div`
 & > .suggestion-paper > .suggestion-list > .suggestion-list-item {
     padding : ${({ theme }) => `${theme.spacing(1)}px`};
 }
`

const Input = ({
    className,
    roomId,
    suggestionCandidates = []
}: {
    className?: string,
    roomId: string,
    suggestionCandidates?: Profile[]
}) => {

    const {
        handleChangeInput,
        handleSubmitMessage,
        onSelectEmoji,
        onSwitchMultiline,
        onEditorMounted,
        updateMentionCandidate,
        suggestion,
        handleSelectMention
    } = useChatState(roomId, suggestionCandidates);

    return (
        <InputBox className={className}>
            <AdornmentAdapter>
                <EmojiPicker onSelectEmoji={onSelectEmoji} />
                <IconButton onClick={onSwitchMultiline}><Keyboard /></IconButton>
            </AdornmentAdapter>
            <div>
                <EditorWrapper>
                    <ChatEditor
                        notifyTextChanged={handleChangeInput}
                        onMounted={onEditorMounted}
                        updateMentionCandidate={updateMentionCandidate}
                    />

                </EditorWrapper>
                <Suggestion>
                    {suggestion.length > 0 && (
                        <Paper className='suggestion-paper'>
                            <List className='suggestion-list'>
                                {suggestion.map(s => (
                                    <ListItem  key={s.id} button className='suggestion-list-item' onClick={() => {
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
                </Suggestion>
            </div>
            <IconButton onClick={handleSubmitMessage}><Send /></IconButton>
        </InputBox>
    )
};

export default Input;