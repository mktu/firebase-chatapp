import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';

const Wrapper = styled.div`

    & >.message{
        display : flex;
        justify-content : flex-start;
        align-items : center;
        width : 100%;
        >.message-wrapper{
            margin-left : ${({ theme }) => `${theme.spacing(1)}px`};
            >.message-header{
                display : flex;
                align-items : center;
            }
        }
    }
`;

const StyledVisibilityIcon = styled(VisibilityIcon)`
    color : ${({ theme }) => `${theme.palette.text.hint}`};
    font-size : ${({ theme }) => `${theme.typography.caption.fontSize}`};
    margin-left :  ${({ theme }) => `${theme.spacing(1)}px`};
    margin-right :  ${({ theme }) => `${theme.spacing(0.5)}px`};
`;

const EditorStyle = styled.div`
    width : 100%;
`;

type PropsType = {
    className?: string,
    time: string,
    avatar: React.ReactElement,
    baloon: React.ReactElement,
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void,
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
    sender: string,
    update?: boolean,
    readCount?: number,
    images?: React.ReactElement
};

const Presenter = React.forwardRef<HTMLDivElement, PropsType>(({
    className,
    time,
    avatar,
    baloon,
    onMouseEnter,
    onMouseLeave,
    sender,
    update = false,
    readCount,
    images
}, ref) => {
    return (
        <Wrapper className={className} ref={ref}>
            <div className='message'
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {avatar}
                <div className='message-wrapper'>
                    <div className='message-header'>
                        <div>
                            <Typography variant='caption' color='textSecondary'>{sender} {time} {update && 'UPDATED'}</Typography>
                        </div>
                        {readCount && (
                            <div>
                                <StyledVisibilityIcon />
                                <Typography variant='caption' color='textSecondary'>
                                    {readCount}
                                </Typography>
                            </div>)}
                    </div>
                    <div>
                        {baloon}
                    </div>
                </div>
            </div>
            {images}
        </Wrapper>)
});

export default Presenter;

export {
    EditorStyle
}

