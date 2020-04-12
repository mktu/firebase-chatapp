import React, { useState, useCallback } from 'react';
import ChatEditor, { KeyEvent, EditorModifier } from '../../Editor';
import { Profile } from '../../../../../types/profile';
import DefaultPresenter, { types } from './Presenters';

type PortalRectType = {
    top: number,
    left: number,
    right: number,
    bottom: number,
    width: number,
    height: number
}
type SuggestionType = {
    profiles: Profile[],
    rect: PortalRectType
}
// refactor roomId, profile is not necessary
const Container = ({
    className,
    roomId,
    profile,
    profiles,
    submitMessage,
    onCancel,
    initText,
    presenter = DefaultPresenter
}: {
    className?: string,
    roomId: string,
    profile: Profile,
    profiles: Profile[],
    submitMessage: (
        roomId: string,
        inputMessage: string,
        profileId: string,
        mentions: string[]
    ) => void,
    onCancel?: () => void,
    initText?:string
    presenter?: React.FC<types.Props<Profile>>
}) => {

    const [inputMessage, setInputMessage] = useState<string>('');
    const [mentions, setMentions] = useState<string[]>([]);
    const [modifier, setModifier] = useState<EditorModifier>();
    const [suggestion, setSuggestion] = useState<SuggestionType>();
    const [focusSuggestion, setFocusSuggestion] = useState(false);

    const onChangeText = useCallback((text: string) => {
        setInputMessage(text);
    }, []);

    const onCancelInput = useCallback(() => {
        modifier?.initialize();
        onCancel&&onCancel();
    }, [modifier,onCancel]);

    const handleSubmitMessage = useCallback(() => {
        if (inputMessage !== '') {
            submitMessage(
                roomId,
                inputMessage,
                profile!.id,
                mentions
            );
            modifier?.initialize();
        }
    }, [inputMessage, modifier, submitMessage, mentions, profile, roomId])

    const onSelectEmoji = (emoji: string) => {
        modifier?.insert(emoji);
    }

    const attachModifier = useCallback((modifier: EditorModifier) => {
        setModifier(modifier);
    }, [setModifier]);

    const onChangeMentionCandidate = useCallback((text: string, start: number, end: number, mounted: boolean, rect?: PortalRectType) => {
        if (!mounted) {
            setSuggestion(undefined);
            setFocusSuggestion(false);
            return;
        }
        if (text.length === 1 && rect) {
            setSuggestion({
                profiles,
                rect
            });
            return;
        }
        const substr = text.substring(start, end);
        rect && setSuggestion({
            profiles: profiles.filter(p => p.nickname.includes(substr)),
            rect
        });

    }, [profiles]);

    const handleSelectMention = useCallback((profile: Profile) => {
        modifier?.setMention(profile.nickname, profile.id);
    }, [modifier]);

    const onMountMention = useCallback((profileId: string, unmounted = false) => {
        if (unmounted) {
            setMentions(ids => ids.filter(id => id !== profileId));
        }
        else {
            setMentions(ids => [...ids, profileId]);
        }
    }, []);

    const onKeyPress = useCallback((key: KeyEvent) => {
        if (key === 'CtrlEnter') {
            handleSubmitMessage();
        }
        if (suggestion) {
            if (key === 'UpArrow') {
                setFocusSuggestion(true);
            }
        }
    }, [suggestion, setFocusSuggestion, handleSubmitMessage]);

    const onLeaveSuggenstionFocus = useCallback(() => {
        setSuggestion(undefined);
        setFocusSuggestion(false);
        modifier?.focus();
    }, [setFocusSuggestion, modifier]);

    const renderRichEditor = useCallback(() => {
        return (
            <ChatEditor
                attachModifier={attachModifier}
                onChangeText={onChangeText}
                onMountMention={onMountMention}
                onChangeMentionCandidate={onChangeMentionCandidate}
                onKeyPress={onKeyPress}
                initText={initText}
            />
        )
    }, [onChangeText, attachModifier, onMountMention, onChangeMentionCandidate, onKeyPress, initText])

    const Presenter = presenter;
    return (
        <Presenter
            className={className}
            renderRichEditor={renderRichEditor}
            handleSelectMention={handleSelectMention}
            onSelectEmoji={onSelectEmoji}
            handleSubmitMessage={handleSubmitMessage}
            suggestion={suggestion}
            focusSuggestion={focusSuggestion}
            onLeaveSuggenstionFocus={onLeaveSuggenstionFocus}
            onCancel={onCancelInput}
        />
    )
};

export default Container;