import React, { useMemo, useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import ProfileContext from '../../contexts/ProfileContext';
import Typography from '@material-ui/core/Typography';
import { Emoji } from 'emoji-mart'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import { Profile } from '../../types/profile';
import { Message } from '../../types/message';

type Props = {
    className?: string,
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
`;

const ReceivedMessage = styled.div`
    display : flex;
    justify-content : flex-end;
    align-items : center;
    width : 100%;
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

const EmojiActions = styled(IconButton)`
    display : flex;
    justify-content : flex-end;
    align-items : start;
    ${({ showEmoAction, theme }: { showEmoAction: boolean, theme: any }) => showEmoAction ? `
        padding : 2px;
        border-radius :${theme.shape.borderRadius}px;
        border : 1px solid ${theme.palette.divider};
        margin-right : ${theme.spacing(0.5)}px;
       
    ` : `
        width : 0;
        padding : 0;
        border-radius :${theme.shape.borderRadius}px;
        margin-right : ${theme.spacing(0.5)}px;
        overflow : hidden;
    `}
     transition: all 0.1s ease-out;
    &:hover{
        background-color : transparent;
    }
`;

const SingleMessage: React.FC<Props> = ({
    className,
    profiles,
    message
}: Props) => {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const userSent = profiles.find(p => p.id === message.profileId);
    const amISent = userSent?.id === profile?.id;
    const date = new Date(message.date);
    const time = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    const [showEmoAction, setShowEmoAction] = useState(false);
    const onHoverReceivedMessage = useCallback(() => {
        setShowEmoAction(true);
    }, []);
    const onLeaveReceivedMessage = useCallback(() => {
        setShowEmoAction(false);
    }, []);

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
                    </SentMessage>
                ) : (
                        <ReceivedMessage onMouseEnter={onHoverReceivedMessage} onMouseLeave={onLeaveReceivedMessage}>
                            <EmojiActions disableRipple disableTouchRipple showEmoAction={showEmoAction}>
                                <React.Fragment>
                                    <InsertEmoticonIcon fontSize='small' />
                                    <AddCircleOutlineIcon style={{ fontSize: 15 }} />
                                </React.Fragment>
                            </EmojiActions>
                            <div className='message-wrapper'>
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
        onHoverReceivedMessage,
        onLeaveReceivedMessage,
        showEmoAction,
        time,
        userSent
    ])
};

export default SingleMessage;