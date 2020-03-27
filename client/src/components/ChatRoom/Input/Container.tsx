import React, { useState, useCallback } from 'react';
import ChatEditor, {
    KeyEvent,
    TextInserter,
    TextInitializer,
    MentionReplacer,
    Focuser
} from '../../Editor';
import { Profile } from '../../../../../types/profile';
import Presenter from './Presenter';

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
        mentionReplacer: MentionReplacer,
        focuser : Focuser
    }>({
        inserter: () => { }, initializer: () => { }, mentionReplacer: () => { }, focuser : ()=>{}
    });
    const [suggestion, setSuggestion] = useState<SuggestionType>();
    const [focusSuggestion,setFocusSuggestion] = useState(false);

    const handleChangeInput = useCallback((text: string) => {
        setInputMessage(text);
    }, []);


    const handleSubmitMessage = useCallback(() => {
        if (inputMessage !== '') {
            createMessage(
                roomId,
                inputMessage,
                profile!.id,
                mentions
            );
            editorCommands.initializer();
        }
    },[inputMessage,editorCommands,createMessage,mentions,profile,roomId])

    const onSelectEmoji = (emoji: string) => {
        editorCommands.inserter(emoji);
    }

    const onEditorMounted = useCallback((
        inserter: TextInserter,
        initializer: TextInitializer,
        mentionReplacer: MentionReplacer,
        focuser : Focuser
    ) => {
        setEditorCommands({
            inserter,
            initializer,
            mentionReplacer,
            focuser
        });
    }, [setEditorCommands]);

    const updateMentionCandidate = useCallback((text: string, start: number, end: number, mounted: boolean, rect?: PortalRectType) => {
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

    const onKeyPress = useCallback((key:KeyEvent)=>{
        if(key==='CtrlEnter'){
            handleSubmitMessage();
        }
        if(suggestion){
            if(key==='UpArrow'){
                setFocusSuggestion(true);
            }
        }
    },[suggestion,setFocusSuggestion,handleSubmitMessage]);

    const onLeaveSuggenstionFocus = useCallback(()=>{
        setSuggestion(undefined);
        setFocusSuggestion(false);
        editorCommands.focuser();
    },[setFocusSuggestion,editorCommands]);

    const renderRichEditor = useCallback(() => {
        return (
            <ChatEditor
                notifyTextChanged={handleChangeInput}
                onMounted={onEditorMounted}
                onMountedMention={onMountedMention}
                updateMentionCandidate={updateMentionCandidate}
                onKeyPress={onKeyPress}
            />
        )
    }, [handleChangeInput, onEditorMounted, onMountedMention, updateMentionCandidate, onKeyPress])
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
        />
    )
};

export default Container;