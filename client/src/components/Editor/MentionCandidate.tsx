import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ContentBlock } from 'draft-js';
import { MENTION_REGEX, MENTION_TRIGGER } from '../../constants';
import { StrategyCallback, findWithRegex } from './common';
import { domutil } from '../../utils'

export type OnChangeMentionCandidate = (
    text: string,
    start: number,
    end: number,
    mounted: boolean,
    rect?: {
        top : number,
        left : number,
        right : number,
        bottom : number,
        width : number,
        height : number
    }
) => void;

const MentionText = styled.span`
    color : dodgerblue;
    cursor: pointer;
    display : inline-block;
`;

export const createMentionCandidateComponent = (onChangeMentionCandidate: OnChangeMentionCandidate) => {
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
            const portalRef = useRef<HTMLElement | null>(null);
            useEffect(() => {
                let domRect :ReturnType<typeof domutil.calcRelativePosition> | undefined;
                if(portalRef.current){
                    domRect = domutil.calcRelativePosition(portalRef.current, domutil.getRelativeParent(portalRef.current));
                }
                const mentionIndex = decoratedText.lastIndexOf(MENTION_TRIGGER);
                onChangeMentionCandidate(decoratedText, mentionIndex + 1, end, true, domRect);
                return () => {
                    onChangeMentionCandidate('', 0, 0, false);
                }
            }, [decoratedText, start, end]);

            return (
                <MentionText ref={portalRef}>
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