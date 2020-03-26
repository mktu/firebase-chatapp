import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Editor,
    EditorState,
    CompositeDecorator,
    Modifier
} from 'draft-js';
import { findLinkStrategy, createLinkComponent } from './Link';
import { findMentionCandidateStrategy, createMentionCandidateComponent, UpdateMentionCandidate as UpdateMentionCandidateAlias } from './MentionCandidate';
import { getMentionReplacer, findMentionStrategy, createMentionComponent } from './Mention';

export type TextInserter = (characters: string) => void;
export type TextInitializer = () => void;
export type MentionReplacer = (mention: string, profileId: string) => void;
export type Focuser = ()=>void;
export type UpdateMentionCandidate = UpdateMentionCandidateAlias;
export type KeyEvent = 'DownArrow'|'UpArrow'|'LeftArrow'|'RightArrow';

const ChatEditor: React.FC<{
    notifyTextChanged: (text: string) => void,
    updateMentionCandidate: UpdateMentionCandidate,
    onMounted: (
        inserter: TextInserter,
        initializer: TextInitializer,
        mentionReplacer: MentionReplacer,
        focuser : Focuser
    ) => void,
    onMountedMention: (profileId: string) =>void,
    onKeyPress? : (key:KeyEvent)=>void,
}> = ({
        notifyTextChanged,
        onMounted,
        updateMentionCandidate,
        onMountedMention,
        onKeyPress
    }) => {
        const ref = useRef<Editor|null>(null);
        const constructDecorator = useCallback(() => {
            return new CompositeDecorator([
                {
                    strategy: findLinkStrategy,
                    component: createLinkComponent(),
                },
                {
                    strategy: findMentionStrategy,
                    component: createMentionComponent(onMountedMention)
                },
                {
                    strategy: findMentionCandidateStrategy,
                    component: createMentionCandidateComponent(updateMentionCandidate)
                }
            ]);
        }, [updateMentionCandidate,onMountedMention]);

        const [editorState, setEditorState] = useState(
            EditorState.createEmpty(constructDecorator())
        );
        const onChange = (editorState: EditorState) => {
            setEditorState(editorState);
        }
        const plainText = editorState.getCurrentContent().getPlainText();
        useEffect(() => {
            const inserter = (characters: string) => {
                const selectionState = editorState.getSelection();
                const newContentState = Modifier.insertText(editorState.getCurrentContent(), selectionState, characters);
                const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
                setEditorState(newEditorState);
            };
            const initializer = () => {
                setEditorState(EditorState.createEmpty(constructDecorator()));
            };
            const focuser = () => {
                ref.current?.focus();
            }
            onMounted(inserter, initializer, getMentionReplacer(editorState, setEditorState),focuser)
        }, [onMounted, setEditorState, editorState, constructDecorator]);

        useEffect(()=>{
            notifyTextChanged(plainText);
        },[plainText,notifyTextChanged])

        const handleKeyEvent = useCallback((key:KeyEvent) => ()=>{
            onKeyPress && onKeyPress(key);
        },[onKeyPress]);

        return (<Editor
            ref={ref}
            editorState={editorState}
            onChange={onChange}
            onDownArrow={handleKeyEvent('DownArrow')}
            onUpArrow={handleKeyEvent('UpArrow')}
            onRightArrow={handleKeyEvent('RightArrow')}
            onLeftArrow={handleKeyEvent('LeftArrow')}
        />)
    }

export default ChatEditor;