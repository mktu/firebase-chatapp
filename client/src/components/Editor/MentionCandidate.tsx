import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ContentBlock } from 'draft-js';
import { MENTION_REGEX, MENTION_TRIGGER } from '../../constants';
import { StrategyCallback, findWithRegex } from './common';

export type UpdateMentionCandidate = (
    text: string,
    start: number,
    end: number,
    mounted : boolean
) => void;

const MentionText = styled.span`
    color : dodgerblue;
    cursor: pointer;
    display : inline-block;
`;

export const createMentionCandidateComponent = (onUpdate: UpdateMentionCandidate) => {
    const Mention: React.FC<{
        decoratedText: string,
        start: number,
        end: number,
        children: React.ReactNode
    }> = ({
        decoratedText,
        start,
        end,
        children
    }) => {
            useEffect(() => {
                const mentionIndex = decoratedText.lastIndexOf(MENTION_TRIGGER);
                onUpdate(decoratedText, mentionIndex+1, end, true);
                return ()=>{
                    onUpdate('',0,0,false);
                }
            }, [decoratedText, start, end]);

            return (
                <MentionText >
                    {children}
                </MentionText>
            )
        }
    return Mention;
}

export const findMentionCandidateStrategy = (
    contentBlock: ContentBlock,
    callback: StrategyCallback
) => {
    findWithRegex(MENTION_REGEX, contentBlock, callback);
}