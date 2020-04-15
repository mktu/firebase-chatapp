import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Baloon from '../Baloon';
import { AddEmojiReaction, EmojiReactions } from '../../../Emoji';
import User from '../User';


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


const ReceivedMessage: React.FC<{
    className?: string,
    time: string,
    onHoverReceivedMessage: () => void,
    onLeaveReceivedMessage: () => void,
    showEmoAction: boolean,
    reactions: { [s: string]: string[] },
    handleAddReaction: (reactionId: string) => void,
    message: string,
    sender: string
    update?: boolean
}> = React.forwardRef(({
    onHoverReceivedMessage,
    onLeaveReceivedMessage,
    showEmoAction,
    handleAddReaction,
    message,
    sender,
    time,
    className,
    reactions = {},
    update = false
}, ref: any) => {
    return (
        <Wrapper className={className} onMouseEnter={onHoverReceivedMessage} onMouseLeave={onLeaveReceivedMessage}>
            <div className='emoji-reaction-sender'>
                {showEmoAction && (<AddEmojiReaction handleAddReaction={handleAddReaction} />)}
            </div>
            <EmojiReactions className='reactions' reactions={reactions} handleAddReaction={handleAddReaction} />
            <div className='message-wrapper' >
                <Typography variant='caption' color='textSecondary'>{sender} {time} {update&&'UPDATED'}</Typography>
                <Baloon message={message} />
            </div>
            <User>
                {sender[0]}
            </User>
        </Wrapper>)
});

export default ReceivedMessage;