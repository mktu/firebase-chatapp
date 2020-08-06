import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import GetAppIcon from '@material-ui/icons/GetApp';
import Portal from '@material-ui/core/Portal';
import { calcRelativePosition } from '../../utils/dom';

type ColorProps = { [key: string]: any };

const getColor = ({
    isDragAccept,
    isDragReject,
    isDragActive
}: ColorProps) => {
    if (isDragAccept) {
        return '#00e676';
    }
    if (isDragReject) {
        return '#ff1744';
    }
    if (isDragActive) {
        return '#2196f3';
    }
    return 'transparent';
}

const Wrapper = styled.div`
    border-width: 2px;
    border-radius: 2px;
    border-color: ${(props: ColorProps) => getColor(props)};
    border-style: dashed;
    position : relative;

    &:focus{
        outline : none;
    }
    > .avatar-wrapper{
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
        display : flex;
        align-items : center;

        > .support-text{
            padding : ${({ theme }) => `${theme.spacing(3)}px`};
            color : ${({ theme }) => `${theme.palette.grey['500']}`};
            display : flex;
            align-items : center;
        }
    }
`;

const AvatarImg = styled.img`
    width : 200px;
    height : auto;
`;

const AvatarWrapper = styled.div`
    width : 200px;
    height : 200px;
    border-radius : 50%;
    overflow:hidden;
    display:flex;
    align-items:center;
`;

type Pos = {
    left: number,
    bottom: number
}

const PortalWrapper = styled.div`
    position : absolute;
    box-sizing: border-box;
    left : ${({ left }: Pos) => `${left}px`};
    bottom :  ${({ bottom }: Pos) => `${bottom}px`};
    transform: translate(-50%, -25%);
    
    > .upload-label{
        border-radius : 0.5rem;
        border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
        background-color : ${({ theme }) => `${theme.palette.background.paper}`};
        display : flex;
        align-items : center;
        justify-content : center;
        font-size : 1.8rem;
        cursor : pointer;
        > input{
            display : none;
        }
    }
`;


type Props = {
    className?: string,
    dropZoneProps: DropzoneRootProps,
    dropZoneInputProps: DropzoneInputProps,
    imgUrl?: string,
    setImage: (file: File) => void
}

const Avatar: React.FC<Props> = ({
    className,
    dropZoneProps,
    dropZoneInputProps,
    imgUrl,
    setImage
}) => {
    const [element, setElement] = useState<HTMLElement>();
    const [parent, setParent] = useState<HTMLDivElement>();
    const pos = (element && parent) ? calcRelativePosition(element, parent) : { left: 0, bottom: 0, width: 0 };
    return (
        <Wrapper className={className} {...dropZoneProps} ref={(elm) => {
            elm && setParent(elm)
        }}>
            <input {...dropZoneInputProps} />
            <div className='avatar-wrapper'>
                <AvatarWrapper ref={(elm) => {
                        elm && setElement(elm);
                    }} >
                    <AvatarImg alt='Avatar image' src={imgUrl || 'https://via.placeholder.com/200?text=200+x+200+image'} />
                </AvatarWrapper>
                <div className='support-text'>
                    <GetAppIcon />
                    <Typography variant='subtitle1' color='inherit'>DROP IMAGE HERE</Typography>
                </div>
                <Portal container={parent}>
                    <PortalWrapper bottom={pos.bottom} left={pos.left + 100}>
                        <label htmlFor="file-upload" className='upload-label'>
                            <PhotoCameraIcon fontSize='inherit' color='action' />
                            <input id="file-upload" type='file' onChange={(e) => {
                                e.target.files && e.target.files?.length === 1 && setImage(e.target.files[0])
                            }
                            } />
                        </label>
                    </PortalWrapper>
                </Portal>
            </div>
        </Wrapper>
    )
}

export default Avatar;