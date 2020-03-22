import React, { useState, useCallback } from 'react';
import ChatEditor from '../../Editor';
import { Profile } from '../../../../../types/profile';
import Presenter from './Presenter';

type TextInserter = (characters: string) => void;
type TextInitializer = () => void;
type MentionReplacer = (mention: string, profileId: string) => void;

const Container = ({
    className,
    roomId,
    profile,
    profiles,
    createMessage
}: {
    className?: string,
    roomId: string,
    profile: Profile,
    profiles: Profile[],
    createMessage: (
        roomId: string,
        inputMessage: string,
        profileId: string,
        mentions: string[]
    ) => void
}) => {

    const [inputMessage, setInputMessage] = useState<string>('');
    const [mentions, setMentions] = useState<string[]>([]);
    const [editorCommands, setEditorCommands] = useState<{
        inserter: TextInserter,
        initializer: TextInitializer,
        mentionReplacer: MentionReplacer
    }>({
        inserter: () => { }, initializer: () => { }, mentionReplacer: () => { }
    });

    const handleChangeInput = useCallback((text: string) => {
        setInputMessage(text);
    },[]);

    const [suggestion, setSuggestion] = useState<Profile[]>([]);

    const handleSubmitMessage = () => {
        if (inputMessage !== '') {
            createMessage(
                roomId,
                inputMessage,
                profile!.id,
                mentions
            );
            editorCommands.initializer();
        }
    }
    const onSelectEmoji = (emoji: string) => {
        editorCommands.inserter(emoji);
    }

    const onEditorMounted = useCallback((
        inserter: (characters: string) => void,
        initializer: () => void,
        mentionReplacer: (mention: string, profileId: string) => void
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
        const substr = text.substring(start, end);
        setSuggestion(profiles.filter(p => p.nickname.includes(substr)));

    }, [profiles]);

    const handleSelectMention = useCallback((profile: Profile) => {
        editorCommands.mentionReplacer(profile.nickname, profile.id);
    }, [editorCommands]);

    const onMountedMention = useCallback((profileId: string, unmounted = false) => {
        if (unmounted) {
            setMentions(ids => ids.filter(id => id !== profileId));
        }
        else {
            setMentions(ids => [...ids, profileId]);
        }
    }, []);

    const renderRichEditor = useCallback(() => {
        return (
            <ChatEditor
                notifyTextChanged={handleChangeInput}
                onMounted={onEditorMounted}
                onMountedMention={onMountedMention}
                updateMentionCandidate={updateMentionCandidate}
            />
        )
    }, [handleChangeInput, onEditorMounted, onMountedMention, updateMentionCandidate])

    return (
        <Presenter
            className={className}
            renderRichEditor={renderRichEditor}
            handleSelectMention={handleSelectMention}
            onSelectEmoji={onSelectEmoji}
            handleSubmitMessage={handleSubmitMessage}
            suggestion={suggestion}
        />
    )
};

export default Container;