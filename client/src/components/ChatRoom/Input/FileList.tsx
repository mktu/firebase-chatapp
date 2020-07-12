import React from 'react';
import styled from 'styled-components';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import LinearProgress from './LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import { isImage } from '../../../utils';
import { MessageImage } from '../../../../../types/message';

type ImageListProps = {
    files: File[],
    storedFiles?: MessageImage[]
}

const ImageContent = styled.div`
    > .image-src{
        display : flex;
        align-items : center;
        justify-content : center;
        padding  : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const Img = styled.img`
    max-width : 90%;
    height : auto;
`;

export const ImageList: React.FC<ImageListProps> = ({
    files,
    storedFiles
}) => {
    return (
        <div>
            {files.map(image => {
                const imageUrl = URL.createObjectURL(image);
                return isImage(image.type) ? (
                    <ImageContent key={imageUrl}>
                        <div className='image-src'>
                            <Tooltip title={image.name}>
                                <Img src={imageUrl} alt={image.name} />
                            </Tooltip>
                        </div>
                    </ImageContent>
                ) : <div />
            })}
            {storedFiles?.map(image => isImage(image.type) ? (
                <ImageContent key={image.url}>
                    <div className='image-src'>
                        <Tooltip title={image.name}>
                            <Img src={image.url} alt={image.name} />
                        </Tooltip>
                    </div>
                </ImageContent>
            ) : <div />
            )}
        </div>
    )
};

type FileListProps = {
    files: File[],
    storedFiles?: MessageImage[],
    uploadProgresses?: {
        [key: string]: number
    }
}

const ImageFileList = styled.div`
    font-size : 0.8rem;
    margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
    &>.imagefile-item{
        border-bottom : ${({ theme }) => `1px solid ${theme.palette.divider}`};
        padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
        > div {
            display : flex;
            align-items : center;
        }
    }
`;

const UploadIcon = styled(CloudUploadIcon)`
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
    color : gray;
`;

const CloudIcon = styled(CloudDoneIcon)`
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
    color : gray;
`;

export const FileList: React.FC<FileListProps> = ({
    files,
    uploadProgresses,
    storedFiles
}) => {
    return (
        <ImageFileList>
            {storedFiles && storedFiles.map(file => (
                <div className='imagefile-item'>
                    <div>
                        <CloudIcon />
                        {file.name} ({file.size / 1000} KB)
                    </div>
                </div>
            ))}
            {files.map((file) => (
                <div className='imagefile-item'>
                    <div>
                        <UploadIcon />
                        {file.name} ({file.size / 1000} KB)
                    </div>
                    {uploadProgresses && (
                        <LinearProgress value={uploadProgresses[file.name] || 0} />
                    )}
                </div>
            ))}
        </ImageFileList>)
};