import React, { useMemo, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Portal from '@material-ui/core/Portal';
import { find } from 'linkifyjs';
import Linkify from 'react-linkify';
import { LinkPreview } from '../../../LinkPreview';
import { buildMatchInfo } from '../../../../logics/regexHelper';
import { MENTION_REGEX } from '../../../../constants';
import { domutil } from '../../../../utils';

const innerStyle = css`
    display : inline-block;
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    background-color : #E8EDF2;
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
`;

const Wrapper = styled.div`
    width : 100%;
    position : relative;
    & > span {
        max-width : 50vw;
        display : inline-block;
        white-space : pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        & > span{
            ${innerStyle};
        }
    }
`;

const LinkDecorator = (decoratedHref: string, decoratedText: string, key: number): React.ReactNode => {
    return (
        <a href={decoratedHref} key={key} target='_blank' rel="noopener noreferrer">
            {decoratedText}
        </a>
    );
}

const MentionText = styled.span`
    color : dodgerblue;
    cursor: pointer;
    display : inline-block;
    background-color : rgba(30,144,255,0.1);
`;

const makeMentionDecorator = (source: string) => {
    const matchInfos = buildMatchInfo(source, MENTION_REGEX);
    return matchInfos.map(m => m.matched ? (
        <MentionText key={m.text}>
            {m.text}
        </MentionText>
    ) : m.text)
}

type BaloonRect = {
    top: number,
    left: number,
    width: number,
    height: number,
    bottom: number,
    right: number
}

type PropsType = {
    className?: string,
    message: string,
    renderPortal?: (rect: BaloonRect) => React.ReactElement,
}

const Baloon: React.FC<PropsType> = ({
    className,
    message,
    renderPortal
}) => {
    const urls = find(message);
    const [spanElement, setSpanElement] = useState<HTMLSpanElement>();
    const [rect, setRect] = useState<BaloonRect>();
    useEffect(() => {
        const portalContainer = spanElement?.parentElement || undefined;
        if (spanElement && portalContainer) {
            const newrect = spanElement && domutil.calcRelativePosition(spanElement, portalContainer);
            setRect(newrect);
        }
        //It is necessary to put a message in dipendency to adjust the position of the portal when resizing
    }, [message, spanElement]);
    const mentionDecorated = useMemo(() => makeMentionDecorator(message), [message]);
    return (
        <Wrapper className={className}>
            <span ref={(r) => {
                setSpanElement(r || undefined)
            }}>
                {message.length > 0 ? (
                    <span>
                        {urls.length > 0 ? (
                            <Linkify componentDecorator={LinkDecorator}>
                                {mentionDecorated}
                            </Linkify>
                        ) : mentionDecorated}
                    </span>
                ) : <React.Fragment />}

                {urls.length > 0 && (<LinkPreview url={urls[0].href} />)}
            </span>
            {renderPortal && rect && (
                <Portal container={spanElement?.parentElement}>
                    {renderPortal(rect)}
                </Portal>
            )}
        </Wrapper>

    )
};

export default Baloon;