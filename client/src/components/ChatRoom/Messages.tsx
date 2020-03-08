import React, { useMemo } from 'react';
import List from '@material-ui/core/List';
import SingleMessage from './SingleMessage';
import InfiniteScrollable from '../InfiniteScrollable';
import { Profile } from '../../../../types/profile';
import { MessagesLoader } from '../Loaders';

const Messages: React.FC<{
    className?: string,
    roomId: string,
    profiles: Profile[]
}> = ({
    className,
    roomId,
    profiles
}) => {
        return useMemo(() =>
            (
                <div className={className} id='chat-room-messages'>
                    <MessagesLoader roomId={roomId}
                        loading={() => {
                            return (<div>loading messages...</div>);
                        }}
                    >
                        {
                            (messages, readMore, hasMore) => {
                                return (
                                    <InfiniteScrollable
                                        loadMore={readMore}
                                        hasMore={hasMore}
                                        items={messages}
                                        listComponent={List}
                                        renderItem={(message)=>(
                                            <SingleMessage key={message.id} roomId={roomId} profiles={profiles} message={message} />
                                        )}
                                    />
                                )
                            }
                        }
                    </MessagesLoader>
                </div >
            ), [roomId, className, profiles])
    };

export default Messages;