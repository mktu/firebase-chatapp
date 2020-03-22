import React, {useMemo} from 'react';
import styled, { css } from 'styled-components';
import { find } from 'linkifyjs';
import Linkify from 'react-linkify';
import { LinkPreview } from '../../LinkPreview';
import { buildMatchInfo } from '../../../logics/regexHelper';
import { MENTION_REGEX } from '../../../constants';

const innerStyle = css`
    display : inline-block;
    white-space : pre-wrap;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    background-color : ${({ theme }) => `${theme.palette.grey['200']}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
`;

const Wrapper = styled.div`
    max-width : 500px;
    & > span{
        ${innerStyle};
    }
    & > span > a {
        ${innerStyle};
    }
`;

const LinkDecorator = (decoratedHref: string, decoratedText: string, key: number): React.ReactNode =>{
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
    return matchInfos.map(m=>m.matched?(
        <MentionText key={m.text}>
            {m.text}
        </MentionText>
    ):m.text)
}

const Baloon: React.FC<{
    className?: string,
    message: string
}> = ({
    className,
    message,
}) => {
    const urls = find(message);
    const mentionDecorated = useMemo(()=>makeMentionDecorator(message),[message]);
    return (
        <Wrapper className={className}>
            {
                urls.length > 0 ? (
                    <React.Fragment>
                        <span>
                            <Linkify componentDecorator={LinkDecorator}>
                                {mentionDecorated}
                            </Linkify>
                        </span>
                        <LinkPreview url={urls[0].href} />
                    </React.Fragment>
                ) : (
                        <span>
                            {mentionDecorated}
                        </span>
                    )
            }
        </Wrapper>

    )
};

export default Baloon;