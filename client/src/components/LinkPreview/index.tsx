import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { ScrapperWraper, ReactTinyLinkType } from 'react-tiny-link';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    &>div{
        margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    &>div>.image{
        border-radius : 2px;
        width : 50px;
    }
`;

const Texts = styled.div`
    &>.title {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width : 100%;
        }
        overflow: hidden;
`;

const LinkPreview: React.FC<{
    url: string,
}> = ({
    url,
}) => {
        const [linkData, setLinkData] = useState<{
            title: any;
            url: any;
            description: any;
            type: ReactTinyLinkType;
            video: any[];
            image: any[];
        }>();

        useEffect(() => {
            const client = fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
                headers: {
                    'x-requested-with': '',
                },
            });
            ScrapperWraper(url, client, []).then((data) => {
                setLinkData(data);
            })
        }, [url]);
        if (!linkData) {
            return null;
        }
        return (
            <Wrapper>
                <div>
                    <img className='image' alt='link' src={linkData.image[0]} />
                </div>
                <Texts>
                    <Typography className='title' display='block'> {linkData.title}</Typography>
                    <Typography className='title' variant='caption' display='block'> {url}</Typography>
                </Texts>
            </Wrapper>
        )
    }


export { LinkPreview };
