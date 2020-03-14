import React from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Baloon from './Baloon';
import { AddEmojiReaction, EmojiReactions } from '../../Emoji';

const userStyle = css`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const SentMessageWrapper = styled.div`
    display : flex;
    justify-content : flex-start;
    align-items : center;
    width : 100%;
    &>.message-wrapper{
        margin-left : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    &>.reactions{
        display : flex;
        align-items : flex-end;
        margin-left : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
    &>.sender{
        ${userStyle};
    }
`;

const ReceivedMessageWrapper = styled.div`
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
    &>.sender{
        ${userStyle};
    }
`;

const SentMessage: React.FC<{
    className?: string,
    time: string,
    handleAddReaction: (reactionId: string) => void,
    reactions: { [s: string]: string[] },
    message: string,
    sender: string
}> = React.forwardRef(({
    className,
    time,
    handleAddReaction,
    sender,
    message,
    reactions = {},
}, ref: any) => {

    return (<SentMessageWrapper ref={ref} className={className}>
        <div className='sender'>
            <Avatar>
                {sender[0]}
            </Avatar>
        </div>
        <div className='message-wrapper'>
            <Typography variant='caption' color='textSecondary'>{sender},{time}</Typography>
            <Baloon message={message} />
        </div>
        <EmojiReactions className='reactions' readonly reactions={reactions} handleAddReaction={handleAddReaction} />
    </SentMessageWrapper>)
});

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
}> = React.forwardRef(({
    onHoverReceivedMessage,
    onLeaveReceivedMessage,
    showEmoAction,
    handleAddReaction,
    message,
    sender,
    time,
    className,
    reactions = {}
}, ref: any) => {
    return (
        <ReceivedMessageWrapper className={className} onMouseEnter={onHoverReceivedMessage} onMouseLeave={onLeaveReceivedMessage}>
            <div className='emoji-reaction-sender'>
                {showEmoAction && (<AddEmojiReaction handleAddReaction={handleAddReaction} />)}
            </div>
            <EmojiReactions className='reactions' reactions={reactions} handleAddReaction={handleAddReaction} />
            <div className='message-wrapper' >
                <Typography variant='caption' color='textSecondary'>{sender},{time}</Typography>
                <Baloon message={message} />
            </div>
            <div className='sender'>
                <Avatar>
                    {sender[0]}
                </Avatar>
            </div>
        </ReceivedMessageWrapper>)
});

export {
    SentMessage,
    ReceivedMessage
}