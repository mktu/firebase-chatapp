import React, { useState, useCallback, useEffect } from 'react';
import {
    Editor,
    EditorState,
    CompositeDecorator,
    Modifier
} from 'draft-js';
import { findLinkStrategy, createLinkComponent } from './Link';
import { findMentionCandidateStrategy, createMentionCandidateComponent, UpdateMentionCandidate as UpdateMentionCandidateAlias } from './MentionCandidate';
import { getMentionReplacer, findMentionStrategy, createMentionComponent } from './Mention';

export type UpdateMentionCandidate = UpdateMentionCandidateAlias;

const ChatEditor: React.FC<{
    notifyTextChanged: (text: string) => void,
    updateMentionCandidate: UpdateMentionCandidate,
    onMounted: (
        inserter: (characters: string) => void,
        initializer: () => void,
        mentionReplacer: (mention: string) => void
    ) => void,
}> = ({
    notifyTextChanged,
    onMounted,
    updateMentionCandidate
}) => {

        const constructDecorator = useCallback(() => {
            return new CompositeDecorator([
                {
                    strategy: findLinkStrategy,
                    component: createLinkComponent(),
                },
                {
                    strategy: findMentionStrategy,
                    component : createMentionComponent()
                },
                {
                    strategy: findMentionCandidateStrategy,
                    component: createMentionCandidateComponent(updateMentionCandidate)
                }
            ]);
        }, [updateMentionCandidate]);

        const [editorState, setEditorState] = useState(
            EditorState.createEmpty(constructDecorator())
        );

        const onChange = (editorState: EditorState) => {
            setEditorState(editorState);
            notifyTextChanged(editorState.getCurrentContent().getPlainText());
        }

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
            
            onMounted(inserter, initializer, getMentionReplacer(editorState, setEditorState))
        }, [onMounted, setEditorState, editorState, constructDecorator]);

        return (<Editor
            editorState={editorState}
            onChange={onChange}
        />)
    }

export default ChatEditor;