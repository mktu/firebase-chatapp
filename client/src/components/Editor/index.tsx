import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
    Editor,
    EditorState,
    SelectionState,
    CompositeDecorator,
    Modifier,
    getDefaultKeyBinding,
    KeyBindingUtil
} from 'draft-js';
import { findLinkStrategy, createLinkComponent } from './Link';
import { findMentionCandidateStrategy, createMentionCandidateComponent, OnChangeMentionCandidate as OnChangeMentionCandidateAlias } from './MentionCandidate';
import { getMentionInitializer, getMentionReplacer, findMentionStrategy, createMentionComponent, Mention } from './Mention';

export type OnChangeMentionCandidate = OnChangeMentionCandidateAlias;
export type KeyEvent = 'DownArrow' | 'UpArrow' | 'LeftArrow' | 'RightArrow' | 'CtrlEnter';

export type EditorModifier = {
    insert: (characters: string) => void,
    initialize: () => void;
    setMention: (mention: string, profileId: string) => void,
    initMention: (mentions: Mention[]) => void,
    focus: () => void
}

const ChatEditor: React.FC<{
    onChangeText: (text: string) => void,
    onChangeMentionCandidate: OnChangeMentionCandidateAlias,
    attachModifier: (modifier: EditorModifier) => void,
    onMountMention: (profileId: string) => void,
    onKeyPress?: (key: KeyEvent) => void,
    initText?: string
}> = ({
    onChangeText,
    attachModifier,
    onChangeMentionCandidate,
    onMountMention,
    onKeyPress,
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

        const initialState = useMemo(() => EditorState.createEmpty(constructDecorator()), [constructDecorator])
        const [editorState, setEditorState] = useState<EditorState>(initialState);
        useEffect(() => {
            setEditorState(initialState)
        }, [initialState])

        const onChange = (editorState: EditorState) => {
            setEditorState(editorState);
        }
        const plainText = editorState.getCurrentContent().getPlainText();
        useEffect(() => {
            attachModifier({
                insert: (characters: string) => {
                    setEditorState(prev => {
                        const selectionState = prev.getSelection();
                        const newContentState = Modifier.insertText(prev.getCurrentContent(), selectionState, characters);
                        const newEditorState = EditorState.push(prev, newContentState, 'insert-characters');
                        return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
                    });

                },
                initialize: () => {
                    setEditorState(prev => {
                        const contentState = prev.getCurrentContent();
                        const firstBlock = contentState.getFirstBlock();
                        const lastBlock = contentState.getLastBlock();
                        const allSelected = new SelectionState({
                            anchorKey: firstBlock.getKey(),
                            anchorOffset: 0,
                            focusKey: lastBlock.getKey(),
                            focusOffset: lastBlock.getLength(),
                            hasFocus: true
                        });
                        const newContentState = Modifier.removeRange(prev.getCurrentContent(), allSelected, 'backward');
                        const newEditorState = EditorState.push(prev, newContentState, 'remove-range');
                        return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
                    });
                },
                focus: () => {
                    editorRef.current?.focus();
                },
                setMention: getMentionReplacer(setEditorState),
                initMention: getMentionInitializer(setEditorState),
            })
        }, [attachModifier, setEditorState]);

        useEffect(() => {
            onChangeText(plainText);
        }, [plainText, onChangeText])

        useEffect(() => {
            initText && setEditorState(prev => {
                const selectionState = prev.getSelection();
                const newContentState = Modifier.insertText(prev.getCurrentContent(), selectionState, initText);
                const newEditorState = EditorState.set(prev, { currentContent: newContentState });
                return newEditorState;
            });
        }, [initText, setEditorState])

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