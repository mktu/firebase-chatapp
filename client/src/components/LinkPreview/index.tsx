import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.a`
    display : block;
    display : flex;
    color : inherit;
    text-decoration: none;
    align-items : center;
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    & > div {
        margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
        overflow: hidden;
    }
    & > div > .image{
        border-radius : 2px;
        width : 50px;
    }
    & > div > .link-preview-text{
        overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width : 100%;
    }
`;

const peoxy = 'https://cors-anywhere.herokuapp.com';

const fetchLinkPreview = async (url: string) => {
    const response = await fetch(url, {
        headers: {
            'x-requested-with': '',
        },
    });
    const data = await response.text();
    const htmlDoc = new DOMParser().parseFromString(data, 'text/html');
    const baseUrl = htmlDoc.querySelector('base')?.getAttribute('href') || url;
    const images: (string | undefined)[] = [
        { tag: 'meta[property="og:logo"]', attr: 'content' },
        { tag: 'meta[itemprop="logo"]', attr: 'content' },
        { tag: 'img[itemprop="logo"]', attr: 'src' },
        { tag: 'meta[property="og:image"]', attr: 'content' },
        { tag: 'img[class*="logo" i]', attr: 'src' },
        { tag: 'img[src*="logo" i]', attr: 'src' },
        { tag: 'meta[property="og:image:secure_url"]', attr: 'content' },
        { tag: 'meta[property="og:image:url"]', attr: 'content' },
        { tag: 'meta[name="twitter:image:src"]', attr: 'content' },
        { tag: 'meta[name="twitter:image"]', attr: 'content' },
        { tag: 'meta[itemprop="image"]', attr: 'content' },
    ].map(keys => htmlDoc.querySelector(keys.tag)?.getAttribute(keys.attr))
        .filter(Boolean)
        .map(attr => {
            const normalizedUrl = attr?.toLocaleLowerCase();
            if (normalizedUrl?.startsWith('http://') || normalizedUrl?.startsWith('https://')) {
                return attr || undefined;
            }
            return baseUrl + attr
        })

    return {
        title: htmlDoc.querySelector('title')?.innerText || undefined,
        description: htmlDoc.querySelector('meta[name="description"]')?.getAttribute('content') || undefined,
        url: htmlDoc.querySelector('meta[property="og:url"]')?.getAttribute('content') || undefined,
        images
    }
}

const LinkPreview: React.FC<{
    url: string,
    className?: string
}> = ({
    url,
    className
}) => {
        const [linkData, setLinkData] = useState<{
            title?: string;
            url?: string;
            description?: string;
            images: (string | undefined)[];
        }>();
        useEffect(() => {
            let cancel = false;

            fetchLinkPreview(`${peoxy}/${url}`).then((data) => {
                !cancel && setLinkData(data)
            }).catch(console.error);

            return () => {
                cancel = true;
            }
        }, [url]);
        if (!linkData) {
            return null;
        }
        return (
            <Wrapper className={className} href={url} target='_blank' rel="noopener noreferrer">
                <div>
                    <img className='image' alt='link' src={linkData.images[0]} />
                </div>
                <div>
                    <Typography className='link-preview-text' display='block'> {linkData.title}</Typography>
                    <Typography className='link-preview-text' variant='caption' display='block'> {url}</Typography>
                </div>
            </Wrapper>
        )
    }


export { LinkPreview };
