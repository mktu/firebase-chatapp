import React from 'react';
import styled, { css } from 'styled-components';
import { find } from 'linkifyjs';
import Linkify from 'react-linkify';
import { LinkPreview as LinkPreviewBase } from '../LinkPreview';

type Props = {
    className?: string,
    message: string
};

const LinkPreview = styled(LinkPreviewBase)`
`

const InnerStyle = css`
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
        ${InnerStyle};
    }
    & > span > a {
        ${InnerStyle};
    }
`;

const Decorator = (decoratedHref: string, decoratedText: string, key: number): React.ReactNode =>{
    return (
        <a href={decoratedHref} key={key} target='_blank' rel="noopener noreferrer">
          {decoratedText}
        </a>
      );
}

const Baloon: React.FC<Props> = ({
    className,
    message,
}: Props) => {
    const urls = find(message);
    return (
        <Wrapper className={className}>
            {
                urls.length > 0 ? (
                    <React.Fragment>
                        <span>
                            <Linkify componentDecorator={Decorator}>
                                {message}
                            </Linkify>
                        </span>
                        <LinkPreview url={urls[0].href} />
                    </React.Fragment>
                ) : (
                        <span>
                            {message}
                        </span>
                    )
            }
        </Wrapper>

    )
};

export default Baloon;