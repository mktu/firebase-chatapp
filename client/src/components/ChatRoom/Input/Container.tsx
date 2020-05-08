import React, { useState, useCallback, useEffect } from 'react';
import ChatEditor, { KeyEvent, EditorModifier } from '../../Editor';
import { Profile } from '../../../../../types/profile';
import DefaultPresenter, { types } from './Presenters';
import { SuggestionType } from './types';

const Container = ({
    className,
    profiles,
    submitMessage,
    onCancel,
    initText,
    presenter = DefaultPresenter,
    initMentions=[],
    suggestionPlacement = 'above'
}: {
    className?: string,
    profiles: Profile[],
    submitMessage: (
        message: string,
        mentions: string[]
    ) => void,
    onCancel?: () => void,
    initText?:string,
    initMentions?:string[],
    presenter?: React.FC<types.PresenterProps<Profile>>,
    suggestionPlacement?: 'above' | 'below'
}) => {
    const [inputMessage, setInputMessage] = useState<string>();
    const [mentions, setMentions] = useState<string[]>([]);
    const [modifier, setModifier] = useState<EditorModifier>();
    const [suggestion, setSuggestion] = useState<SuggestionType>();
    const [focusSuggestion, setFocusSuggestion] = useState(false);
    const hasText = inputMessage && inputMessage !=='';

    useEffect(()=>{
        if(hasText && initMentions.length > 0){
            const mentions = initMentions.map(mention=>{
                const profile = profiles.find(p=>p.id===mention);
                return profile && {
                    mention : profile.nickname,
                    profileId : mention
                }
            }).filter(Boolean).map(m=>m!);
            modifier?.initMention(mentions);
        }
    },[hasText,initMentions,modifier,profiles]);

    const onChangeText = useCallback((text: string) => {
        setInputMessage(text);
    }, []);

    const onCancelInput = useCallback(() => {
        modifier?.initialize();
        onCancel&&onCancel();
    }, [modifier,onCancel]);

    const handleSubmitMessage = useCallback(() => {
        if (inputMessage) {
            submitMessage(
                inputMessage,
                mentions
            );
            modifier?.initialize();
        }
    }, [inputMessage, modifier, submitMessage, mentions])

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
        if (key === 'CtrlEnter') {
            handleSubmitMessage();
        }
        if (suggestion) {
            if (suggestionPlacement === 'above' && key === 'UpArrow') {
                setFocusSuggestion(true);
            }
            else if (suggestionPlacement === 'below' && key === 'DownArrow'){
                setFocusSuggestion(true);
            }
        }
    }, [suggestion, setFocusSuggestion, handleSubmitMessage, suggestionPlacement]);

    const onLeaveSuggenstionFocus = useCallback(() => {
        setFocusSuggestion(false);
        modifier?.focus();
    }, [setFocusSuggestion, modifier]);
    
    const onCloseSuggestion = useCallback(() => {
        setSuggestion(undefined);
    }, [setSuggestion]);

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
            onCloseSuggestion={onCloseSuggestion}
            onCancel={onCancelInput}
        />
    )
};

export default Container;