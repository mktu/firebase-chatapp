import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
    EditorState,
    ContentState,
    ContentBlock,
    SelectionState,
    Modifier
} from 'draft-js';
import { StrategyCallback, serach } from './common';
import { MENTION_TRIGGER } from '../../constants'

type SetEditorState = (prev: EditorState) => EditorState;
export type Mention = {
    mention: string, profileId: string
};

export const getMentionInitializer = (setEditorState: (action: SetEditorState) => void) =>
    (mentions: Mention[]) => {
        setEditorState(editorState => {
            const extendedMentions = mentions.reduce((acc, cur) => {
                const selectionStates = serach(editorState, new RegExp(`${MENTION_TRIGGER}${cur.mention}`,'g'));
                return [...acc, {
                    selectionStates,
                    mention: cur
                }];
            }, [] as {
                selectionStates: SelectionState[],
                mention: Mention
            }[])

            let contentState = editorState.getCurrentContent();
            for (const extendedMention of extendedMentions) {
                const contentStateWithEntity = editorState
                    .getCurrentContent()
                    .createEntity('mention', 'IMMUTABLE', extendedMention.mention);
                const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                for (const selectionState of extendedMention.selectionStates) {
                    contentState = Modifier.replaceText(
                        contentState,
                        selectionState,
                        `${MENTION_TRIGGER}${extendedMention.mention.mention}`,
                        undefined,
                        entityKey
                    )
                }
            }
            return EditorState.push(
                editorState,
                contentState,
                'change-block-data'
            )
        });
    }

export const getMentionReplacer = (setEditorState: (action: SetEditorState) => void) =>
    (mention: string, profileId: string) => {
        setEditorState(editorState => {
            const contentStateWithEntity = editorState
                .getCurrentContent()
                .createEntity('mention', 'IMMUTABLE', {
                    mention,
                    profileId
                });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const currentSelectionState = editorState.getSelection();
            const anchorKey = currentSelectionState.getAnchorKey();
            const anchorOffset = currentSelectionState.getAnchorOffset(); // current key position
            const currentContent = editorState.getCurrentContent();
            const currentBlock = currentContent.getBlockForKey(anchorKey);
            const blockText = currentBlock.getText();
            const textToAnchor = blockText.substr(0, anchorOffset);
            const begin = textToAnchor.lastIndexOf(MENTION_TRIGGER);
            const end = anchorOffset;
            const mentionTextSelection = currentSelectionState.merge({
                anchorOffset: begin,
                focusOffset: end,
            }) as typeof currentSelectionState;
            let mentionReplacedContent = Modifier.replaceText(
                currentContent,
                mentionTextSelection,
                `${MENTION_TRIGGER}${mention}`,
                undefined,
                entityKey
            );
            const newEditorState = EditorState.push(editorState, mentionReplacedContent, 'change-block-data');
            return EditorState.forceSelection(
                newEditorState,
                mentionReplacedContent.getSelectionAfter()
            );
        })

    }

export const findMentionStrategy = (
    contentBlock: ContentBlock,
    callback: StrategyCallback,
    contentState: ContentState
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

export const createMentionComponent = (onMountMention: (profileId: string, unmounted?: boolean) => void) => {
    const Mention: React.FC<{
        children: React.ReactNode,
        entityKey: string,
        contentState: ContentState,
    }> = ({
        children,
        entityKey,
        contentState
    }) => {
            const { profileId } = contentState.getEntity(entityKey).getData();
            useEffect(() => {
                onMountMention(profileId);
                return () => {
                    onMountMention(profileId, true);
                }
            }, [profileId])
            return (
                <MentionText >
                    {children}
                </MentionText>
            )
        }
    return Mention;
}