import React, { useMemo } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import { Profile } from '../../types/profile';
import { Message } from '../../types/message';
import useMessageState from './useMessageState';
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

const Balloon = styled.div`
    max-width : 500px;
    & > span{
        display : inline-block;
        white-space : pre-wrap;
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
        background-color : ${({ theme }) => `${theme.palette.grey['200']}`};
        border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    }
`;

const UserBox = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const SingleMessage: React.FC<Props> = ({
    className,
    profiles,
    message,
    roomId
}: Props) => {

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
            <ListItem className={className} >
                {amISent ? (
                    <SentMessage>
                        {avatar}
                        <div className='message-wrapper'>
                            <Typography variant='caption' color='textSecondary'>{userSent?.nickname},{time}</Typography>
                            <Balloon>
                                <span>
                                    {message.message}
                                </span>
                            </Balloon>
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
                                <Balloon>
                                    <span>
                                        {message.message}
                                    </span>
                                </Balloon>
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
    ])
};

export default SingleMessage;