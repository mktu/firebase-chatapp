import React from 'react';
import styled from 'styled-components';
import {
    EditorState,
    ContentState,
    ContentBlock,
    Modifier
} from 'draft-js';
import { StrategyCallback } from './common';
import { MENTION_TRIGGEZR } from '../../constants'

export const getMentionReplacer = (editorState: EditorState, setEditorState: (editorState: EditorState) => void) =>
    (mention: string) => {
        const contentStateWithEntity = editorState
            .getCurrentContent()
            .createEntity('mention', 'IMMUTABLE', {
                mention,
            });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const currentSelectionState = editorState.getSelection();
        const anchorKey = currentSelectionState.getAnchorKey();
        const anchorOffset = currentSelectionState.getAnchorOffset(); // current key position
        const currentContent = editorState.getCurrentContent();
        const currentBlock = currentContent.getBlockForKey(anchorKey);
        const blockText = currentBlock.getText();
        const textToAnchor = blockText.substr(0, anchorOffset);
        const begin = textToAnchor.lastIndexOf(MENTION_TRIGGEZR);
        const end = anchorOffset;
        const mentionTextSelection = currentSelectionState.merge({
            anchorOffset: begin,
            focusOffset: end,
        }) as typeof currentSelectionState;
        let mentionReplacedContent = Modifier.replaceText(
            currentContent,
            mentionTextSelection,
            `${MENTION_TRIGGEZR}${mention}`,
            undefined,
            entityKey
        );
        const newEditorState = EditorState.push(editorState, mentionReplacedContent, 'change-block-data');
        setEditorState(EditorState.forceSelection(
            newEditorState,
            mentionReplacedContent.getSelectionAfter()
        ));
    }

export const findMentionStrategy = (
    contentBlock : ContentBlock,
    callback : StrategyCallback,
    contentState : ContentState
) => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'mention'
        );
    }, callback);
};

const MentionText = styled.span`
    color : dodgerblue;
    cursor: pointer;
    display : inline-block;
    background-color : rgba(30,144,255,0.2);
`;

export const createMentionComponent = () => {
    const Mention: React.FC<{
        children: React.ReactNode
    }> = ({
        children
    }) => {
            return (
                <MentionText >
                    {children}
                </MentionText>
            )
        }
    return Mention;
}