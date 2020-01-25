import React, { useMemo } from 'react';

import Button from '@material-ui/core/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Profile } from '../../types/profile';
import { MessagesLoader } from '../Loaders';

type Props = {
    className?: string,
    roomId: string,
    profiles: Profile[]
};

const Messages: React.FC<Props> = ({
    className,
    roomId,
    profiles
}: Props) => {
    return useMemo(() =>
        (
            <div className={className} id='chat-room-messages'>
                <MessagesLoader roomId={roomId} >
                    {
                        (messages, readMore, hasMore) => {
                            return (
                                <InfiniteScroll
                                    scrollableTarget='chat-room-messages'
                                    next={readMore}
                                    hasMore={hasMore}
                                    dataLength={messages.length}
                                    loader={(<div>loading more messages...</div>)}
                                >
                                    <List>
                                        {messages.map(mes => {
                                            return (
                                                <ListItem id={mes.id} key={mes.id}>
                                                    <ListItemText>{mes.message}</ListItemText>
                                                </ListItem>
                                            )
                                        })}
                                        <div></div>
                                    </List>
                                </InfiniteScroll>
                            )
                        }
                    }
                </MessagesLoader>
            </div >
        ), [roomId])
};

export default Messages;