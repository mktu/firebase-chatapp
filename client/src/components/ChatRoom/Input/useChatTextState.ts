import { useState, useCallback, useEffect } from 'react';
import { KeyEvent, EditorModifier } from '../../Editor';
import { Profile } from '../../../../../types/profile';
import { SuggestionType } from './types';

export type Props = {
    profiles: Profile[],
    onCancel?: () => void,
    initMentions?: string[],
    suggestionPlacement : 'above' | 'below'
}

const useChatTextState = ({
    profiles,
    onCancel,
    suggestionPlacement,
    initMentions = [],
}: Props) => {
    const [inputMessage, setInputMessage] = useState<string>();
    const [mentions, setMentions] = useState<string[]>([]);
    const [modifier, setModifier] = useState<EditorModifier>();
    const [suggestion, setSuggestion] = useState<SuggestionType>();
    const [focusSuggestion, setFocusSuggestion] = useState(false);
    const hasText = inputMessage && inputMessage !== '';
    useEffect(() => {
        if (hasText && initMentions.length > 0) {
            const mentions = initMentions.map(mention => {
                const profile = profiles.find(p => p.id === mention);
                return profile && {
                    mention: profile.nickname,
                    profileId: mention
                }
            }).filter(Boolean).map(m => m!);
            modifier?.initMention(mentions);
        }
    }, [hasText, initMentions, modifier, profiles]);

    const onChangeText = useCallback((text: string) => {
        setInputMessage(text);
    }, []);

    const onCancelInput = useCallback(() => {
        modifier?.initialize();
        onCancel && onCancel();
    }, [modifier, onCancel]);

    const clearInput = useCallback(() => {
        modifier?.initialize();
    }, [modifier]);

    const onSelectEmoji = (emoji: string) => {
        modifier?.insert(emoji);
    }

    const attachModifier = useCallback((modifier: EditorModifier) => {
        setModifier(modifier);
    }, [setModifier]);

    const onChangeMentionCandidate = useCallback((text: string, start: number, end: number, mounted: boolean, node?: HTMLElement) => {
        if (!mounted) {
            setSuggestion(undefined);
            setFocusSuggestion(false);
            return;
        }
        if (text.length === 1) {
            setSuggestion({
                profiles,
                node
            });
            return;
        }
        const substr = text.substring(start, end);
        setSuggestion({
            profiles: profiles.filter(p => p.nickname.includes(substr)),
            node
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
        if (suggestion) {
            if (suggestionPlacement === 'above' && key === 'UpArrow') {
                setFocusSuggestion(true);
            }
            else if (suggestionPlacement === 'below' && key === 'DownArrow') {
                setFocusSuggestion(true);
            }
        }
    }, [suggestion, setFocusSuggestion, suggestionPlacement]);

    const onLeaveSuggenstionFocus = useCallback(() => {
        setFocusSuggestion(false);
        modifier?.focus();
    }, [setFocusSuggestion, modifier]);

    const onCloseSuggestion = useCallback(() => {
        setSuggestion(undefined);
    }, [setSuggestion]);

    return {
        inputMessage,
        mentions,
        focusSuggestion,
        suggestion,
        onChangeText,
        onCancelInput,
        onSelectEmoji,
        attachModifier,
        clearInput,
        onChangeMentionCandidate,
        handleSelectMention,
        onMountMention,
        onLeaveSuggenstionFocus,
        onCloseSuggestion,
        onKeyPress
    }
};

export default useChatTextState;