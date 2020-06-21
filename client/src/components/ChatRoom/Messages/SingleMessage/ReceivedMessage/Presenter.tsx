import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
    display : flex;
    justify-content : flex-end;
    align-items : center;
    width : 100%;
    &>.emoji-reaction-sender{
        transition: all 0.1s ease-out;
    }
    &>.reactions{
        display : flex;
        align-items : flex-end;
    }
    &>.message-wrapper{
        margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
        display : flex;
        flex-direction : column;
        align-items : flex-end;
    }
`;

type PropsType = {
    className?: string,
    time: string,
    renderReactions: (style?: string) => React.ReactElement,
    reactionAdder: React.ReactElement,
    baloon: React.ReactElement,
    avatar: React.ReactElement,
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void,
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
    sender: string,
    update?: boolean,
};


const ReceivedMessage = React.forwardRef<HTMLDivElement, PropsType>(({
    sender,
    time,
    className,
    renderReactions,
    reactionAdder,
    baloon,
    avatar,
    onMouseEnter,
    onMouseLeave,
    update = false
}, ref) => {
    return (
        <Wrapper
            ref={ref}
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <div className='emoji-reaction-sender'>
                {reactionAdder}
            </div>
            {renderReactions('reactions')}
            <div className='message-wrapper' >
                <Typography variant='caption' color='textSecondary'>{sender} {time} {update && 'UPDATED'}</Typography>
                {baloon}
            </div>
            {avatar}
        </Wrapper>)
});

export default ReceivedMessage;