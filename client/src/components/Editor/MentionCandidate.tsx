import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ContentBlock } from 'draft-js';
import { MENTION_REGEX, MENTION_TRIGGER } from '../../constants';
import { StrategyCallback, findWithRegex } from './common';

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

const getRelativeParent = (element: (HTMLElement | null)): HTMLElement | undefined => {
    if (!element) {
        return undefined;
    }

    const position = window
        .getComputedStyle(element)
        .getPropertyValue('position');

    if (position !== 'static') {
        return element;
    }

    return getRelativeParent(element.parentElement);
}

const calcRelativePosition = (portalElement: HTMLElement, parentElement?: HTMLElement) => {
    let relativeTop, relativeLeft = 0;
    let relativeScrollLeft, relativeScrollWidth, relativeScrollTop, relativeScrollHeight = 0;
    const portalRect = portalElement.getBoundingClientRect();
    if (parentElement) {
        relativeScrollLeft = parentElement.scrollLeft;
        relativeScrollWidth = parentElement.scrollWidth;
        relativeScrollTop = parentElement.scrollTop;
        relativeScrollHeight = parentElement.scrollHeight;


        const relativeParentRect = parentElement.getBoundingClientRect();
        relativeLeft = portalRect.left - relativeParentRect.left;
        relativeTop = portalRect.top - relativeParentRect.top;
        
    } else {
        relativeScrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        relativeScrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;
        relativeScrollWidth = document.body.scrollWidth;
        relativeScrollHeight = document.body.scrollHeight;

        relativeTop = portalRect.top;
        relativeLeft = portalRect.left;
    }

    const left = relativeLeft + relativeScrollLeft;
    const top = relativeTop + relativeScrollTop;
    const bottom = relativeScrollHeight - relativeScrollTop - portalRect.bottom;
    const right = relativeScrollWidth - relativeScrollLeft - portalRect.right;
    const rect = {
        left,
        top,
        bottom,
        right,
        width : portalRect.width,
        height : portalRect.height
    }
    return rect;
}

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
                let domRect :ReturnType<typeof calcRelativePosition> | undefined;
                if(portalRef.current){
                    domRect = calcRelativePosition(portalRef.current, getRelativeParent(portalRef.current));
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