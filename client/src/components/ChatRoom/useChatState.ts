import { useState, useContext, useCallback } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { createMessage } from '../../services/message';
import { Profile } from '../../types/profile';

type TextInserter = (characters: string) => void;
type TextInitializer = () => void;
type MentionReplacer = (mention: string) => void;

export default function (roomId: string, profiles: Profile[]) {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [multiline, setMultiline] = useState(false);
    const [editorCommands, setEditorCommands] = useState<{
        inserter: TextInserter,
        initializer: TextInitializer,
        mentionReplacer: MentionReplacer
    }>({
        inserter: () => { }, initializer: () => { }, mentionReplacer: () => { }
    });
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const handleChangeInput = (text: string) => {
        setInputMessage(text);
    }
    const [suggestion, setSuggestion] = useState<Profile[]>([]);

    const handleSubmitMessage = () => {
        if (inputMessage !== '') {
            createMessage(
                roomId,
                inputMessage,
                profile!.id
            );
            editorCommands.initializer();
        }
    }
    const onSelectEmoji = (emoji: string) => {
        editorCommands.inserter(emoji);
    }
    const onSwitchMultiline = () => {
        setMultiline(val => !val);
    }

    const onEditorMounted = useCallback((
        inserter: (characters: string) => void,
        initializer: () => void,
        mentionReplacer: (mention: string) => void
    ) => {
        setEditorCommands({
            inserter,
            initializer,
            mentionReplacer
        });
    }, [setEditorCommands]);

    const updateMentionCandidate = useCallback((text: string, start: number, end: number, mounted: boolean) => {
        if (!mounted) {
            setSuggestion([]);
            return;
        }
        if (text.length === 1) {
            setSuggestion(profiles);
            return;
        }
        const substr = text.substring(start,end);
        setSuggestion(profiles.filter(p => p.nickname.includes(substr)));

    }, [profiles]);

    const handleSelectMention = useCallback((profile:Profile) => {
        editorCommands.mentionReplacer(profile.nickname);
    },[editorCommands]);

    return {
        handleChangeInput,
        handleSubmitMessage,
        onSelectEmoji,
        multiline,
        onSwitchMultiline,
        onEditorMounted,
        updateMentionCandidate,
        suggestion,
        handleSelectMention
    }
}