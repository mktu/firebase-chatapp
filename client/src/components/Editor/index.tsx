import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Editor,
    EditorState,
    CompositeDecorator,
    Modifier,
    getDefaultKeyBinding,
    KeyBindingUtil
} from 'draft-js';
import { findLinkStrategy, createLinkComponent } from './Link';
import { findMentionCandidateStrategy, createMentionCandidateComponent, OnChangeMentionCandidate as OnChangeMentionCandidateAlias } from './MentionCandidate';
import { getMentionReplacer, findMentionStrategy, createMentionComponent } from './Mention';

export type OnChangeMentionCandidate = OnChangeMentionCandidateAlias;
export type KeyEvent = 'DownArrow' | 'UpArrow' | 'LeftArrow' | 'RightArrow' | 'CtrlEnter';

export type EditorModifier = {
    insert: (characters: string) => void,
    initialize: () => void;
    setMention: (mention: string, profileId: string) => void,
    focus: () => void
}

const ChatEditor: React.FC<{
    onChangeText: (text: string) => void,
    onChangeMentionCandidate: OnChangeMentionCandidateAlias,
    attachModifier: (modifier: EditorModifier) => void,
    onMountMention: (profileId: string) => void,
    onKeyPress?: (key: KeyEvent) => void,
    placeholder?: string,
    initText?: string
}> = ({
    onChangeText,
    attachModifier,
    onChangeMentionCandidate,
    onMountMention,
    onKeyPress,
    placeholder,
    initText
}) => {
        const editorRef = useRef<Editor | null>(null);
        const constructDecorator = useCallback(() => {
            return new CompositeDecorator([
                {
                    strategy: findLinkStrategy,
                    component: createLinkComponent(),
                },
                {
                    strategy: findMentionStrategy,
                    component: createMentionComponent(onMountMention)
                },
                {
                    strategy: findMentionCandidateStrategy,
                    component: createMentionCandidateComponent(onChangeMentionCandidate)
                }
            ]);
        }, [onChangeMentionCandidate, onMountMention]);

        const [editorState, setEditorState] = useState(
            EditorState.createEmpty(constructDecorator())
        );
        const onChange = (editorState: EditorState) => {
            setEditorState(editorState);
        }
        const plainText = editorState.getCurrentContent().getPlainText();
        useEffect(() => {
            attachModifier({
                insert: (characters: string) => {
                    setEditorState( prev => {
                        const selectionState = prev.getSelection();
                        const newContentState = Modifier.insertText(prev.getCurrentContent(), selectionState, characters);
                        const newEditorState = EditorState.set(prev, { currentContent: newContentState });
                        return newEditorState;
                    });

                },
                initialize: () => {
                    setEditorState(EditorState.createEmpty(constructDecorator()));
                },
                focus: () => {
                    editorRef.current?.focus();
                },
                setMention: getMentionReplacer(setEditorState)
            })
        }, [attachModifier, setEditorState, constructDecorator]);

        useEffect(() => {
            onChangeText(plainText);
        }, [plainText, onChangeText])

        useEffect(()=>{
            initText && setEditorState( prev => {
                const selectionState = prev.getSelection();
                const newContentState = Modifier.insertText(prev.getCurrentContent(), selectionState, initText);
                const newEditorState = EditorState.set(prev, { currentContent: newContentState });
                return newEditorState;
            });
        },[initText,setEditorState])

        const handleKeyEvent = useCallback((key: KeyEvent) => () => {
            onKeyPress && onKeyPress(key);
        }, [onKeyPress]);

        return (<Editor
            ref={editorRef}
            blockStyleFn={(block) => {
                switch (block.getType()) {
                    case 'blockquote': return 'RichEditor-blockquote';
                }
                return '';
            }}
            placeholder={placeholder}
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={(command) => {
                if (command === 'ctrl-enter') {
                    handleKeyEvent('CtrlEnter')();
                    return 'handled';
                }
                return 'not-handled';
            }}
            keyBindingFn={(e) => {
                if (e.keyCode === 13 /* enter key */ && KeyBindingUtil.hasCommandModifier(e)) {
                    return 'ctrl-enter';
                }
                return getDefaultKeyBinding(e);
            }}
            onDownArrow={handleKeyEvent('DownArrow')}
            onUpArrow={handleKeyEvent('UpArrow')}
            onRightArrow={handleKeyEvent('RightArrow')}
            onLeftArrow={handleKeyEvent('LeftArrow')}
        />)
    };

export default ChatEditor;