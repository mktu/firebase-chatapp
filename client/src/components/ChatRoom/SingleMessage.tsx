import React, { useMemo } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import { Profile } from '../../../../types/profile';
import { Message } from '../../../../types/message';
import useMessageState from './useMessageState';
import Baloon from './Baloon';
import { AddEmojiReaction, EmojiReactions } from '../Emoji';

type Props = {
    className?: string,
    roomId: string,
    profiles: Profile[],
    message: Message
};

const SentMessage = styled.div`
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
`;

const ReceivedMessage = styled.div`
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

const UserBox = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const SingleMessage: React.FC<Props> = React.forwardRef(({
    className,
    profiles,
    message,
    roomId
}: Props, ref:any) => {

    const {
        userSent,
        amISent,
        time,
        onHoverReceivedMessage,
        onLeaveReceivedMessage,
        showEmoAction,
        handleAddReaction,
        reactions
    } = useMessageState(profiles, message, roomId);

    const avatar = useMemo(() => (
        <UserBox>
            <Avatar>
                {userSent?.nickname[0]}
            </Avatar>
        </UserBox>
    ), [userSent]);
    return useMemo(() =>
        (
            <ListItem className={className} ref={ref}>
                {amISent ? (
                    <SentMessage>
                        {avatar}
                        <div className='message-wrapper'>
                            <Typography variant='caption' color='textSecondary'>{userSent?.nickname},{time}</Typography>
                            <Baloon message={message.message} />
                        </div>
                        <EmojiReactions className='reactions' readonly reactions={reactions} handleAddReaction={handleAddReaction} />
                    </SentMessage>
                ) : (
                        <ReceivedMessage onMouseEnter={onHoverReceivedMessage} onMouseLeave={onLeaveReceivedMessage}>
                            <div className='emoji-reaction-sender'>
                                {showEmoAction && (<AddEmojiReaction handleAddReaction={handleAddReaction} />)}
                            </div>
                            <EmojiReactions className='reactions' reactions={reactions} handleAddReaction={handleAddReaction} />
                            <div className='message-wrapper' >
                                <Typography variant='caption' color='textSecondary'>{userSent?.nickname},{time}</Typography>
                                <Baloon message={message.message} />
                            </div>
                            {avatar}
                        </ReceivedMessage>
                    )}
            </ListItem >
        ), [
        message,
        amISent,
        avatar,
        className,
        reactions,
        onHoverReceivedMessage,
        onLeaveReceivedMessage,
        showEmoAction,
        handleAddReaction,
        time,
        userSent,
        ref
    ])
});

export default SingleMessage;