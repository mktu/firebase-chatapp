import React, { useState } from 'react';
import styled from 'styled-components';
import Link from '@material-ui/core/Link';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import DescriptionIcon from '@material-ui/icons/Description';
import { MessageImage } from '../../../../../../types/message';
import { isImage } from '../../../../utils';

const Wrapper = styled.div`
    margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
    font-size : 0.8rem;
        > div{
            ${({ pos }: { pos?: string }) => pos === 'right' && `
                display : flex;
                justify-content : flex-end;
                align-items : flex-end;
                flex-direction : column;
            `};
            > .image-name{
                display : block;
                display : flex;
                align-items : center;
                padding : ${({ theme }) => `${theme.spacing(1)}px`};
                color : #3477b4;
            }
        }
`;

const ImageIcon = styled(PhotoCameraIcon)`
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
`;

const FileIcon = styled(DescriptionIcon)`
    font-size : 2.5rem;
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
`;

const ImageSrc = styled.img`
    max-width : 50%;
    &:hover{
        cursor : pointer;
    }
`;

const Placeholder = styled.div`
    background: ${({ theme }) => `${theme.palette.grey[200]}`};
    width: 200px;
    height : 200px;
`;

const Image: React.FC<{
    image: MessageImage
}> = ({ image }) => {
    const [loaded, setLoaded] = useState(false);
    return <div>
        <ImageSrc onLoad={()=>{ setLoaded(true)}} src={image.url} alt={image.name} onClick={() => {
        window && window.open(image.url, '_blank');
    }} />
    {!loaded && <Placeholder />}
    </div> 
}

type Props = {
    className?: string,
    images?: MessageImage[],
    pos?: 'left' | 'right'
};

const FileImages: React.FC<Props> = ({
    className,
    images,
    pos
}) => {
    return (
        <Wrapper className={className} pos={pos}>
            {images && images.map((image) => {
                const result = isImage(image.type);
                return result ? (
                    <div key={image.url}>
                        <Link href={image.url} target="_blank" rel="noopener" download className='image-name'>
                            <ImageIcon /> {image.name} ({image.size / 1000} KB)
                        </Link>
                        <Image image={image} />
                    </div>
                ) : (
                        <div key={image.url}>
                            <Link href={image.url} target="_blank" rel="noopener" download className='image-name'>
                                <FileIcon /> {image.name} ({image.size / 1000} KB)
                            </Link>
                        </div>
                    )
            })}
        </Wrapper>)
};

export default FileImages;