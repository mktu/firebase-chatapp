import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import User from '../User';

const Wrapper = styled.div`
    display : flex;
    justify-content : flex-start;
    align-items : center;
    width : 100%;
    &>.message-wrapper{
        margin-left : ${({ theme }) => `${theme.spacing(1)}px`};
        >.message-header{
            display : flex;
            align-items : center;
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
    renderBaloon: (style?: string) => React.ReactElement,
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void,
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
    sender: string,
    update?: boolean,
    readCount?: number,
};

const Presenter = React.forwardRef<HTMLDivElement, PropsType>(({
    className,
    time,
    renderBaloon,
    onMouseEnter,
    onMouseLeave,
    sender,
    update = false,
    readCount
}, ref) => {
    return (
        <Wrapper className={className} ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <User>
                {sender[0]}
            </User>
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
                    {renderBaloon()}
                </div>
            </div>
        </Wrapper>)
});

export default Presenter;

export {
    EditorStyle
}

