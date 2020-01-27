import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import ProfileContext from '../../contexts/ProfileContext';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
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
`;

const ReceivedMessage = styled.div`
    display : flex;
    justify-content : flex-end;
    align-items : center;
    width : 100%;
`;

const MessageBox = styled.div`
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    background-color : ${({ theme }) => `${theme.palette.grey['200']}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    max-width : 60%;
    margin-left : ${({ theme }) => `${theme.spacing(1)}px`};
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
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
    message
}: Props) => {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const userSent = profiles.find(p => p.id === message.profileId);
    const amISent = userSent?.id === profile?.id;
    const date = new Date(message.date);
    const time = `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

    return useMemo(() =>
        (
            <ListItem className={className} >
                {amISent ? (
                    <SentMessage>
                        <UserBox>
                            <Avatar>
                                {userSent?.nickname[0]}
                            </Avatar>
                            <Typography variant='caption' color='textSecondary'>
                                {time}
                            </Typography>
                        </UserBox>
                        <MessageBox>
                            {message.message}
                        </MessageBox>
                    </SentMessage>
                ) : (
                        <ReceivedMessage>
                            <MessageBox>
                                {message.message}
                            </MessageBox>
                            <UserBox>
                                <Avatar>
                                    {userSent?.nickname[0]}
                                </Avatar>
                                <Typography variant='caption' color='textSecondary'>
                                    {time}
                                </Typography>
                            </UserBox>
                        </ReceivedMessage>
                    )}
            </ListItem >
        ), [profiles, message])
};

export default SingleMessage;