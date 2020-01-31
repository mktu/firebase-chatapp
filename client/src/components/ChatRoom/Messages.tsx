import React, { useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import List from '@material-ui/core/List';
import SingleMessage from './SingleMessage';
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
                <MessagesLoader roomId={roomId} 
                    loading={()=>{
                        return (<div>loading messages...</div>);
                    }}
                >
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
                                        {messages.map((mes) => (<SingleMessage key={mes.id} roomId={roomId} profiles={profiles} message={mes}/>))}
                                    </List>
                                </InfiniteScroll>
                            )
                        }
                    }
                </MessagesLoader>
            </div >
        ), [roomId,className,profiles])
};

export default Messages;