import React, { useMemo } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import SingleMessage from './SingleMessage';
import InfiniteScrollable from '../InfiniteScrollable';
import { Profile } from '../../../../types/profile';
import { MessagesLoader } from '../Loaders';
import NewItemNotification from '../InfiniteScrollable/NewItemNotification';

const Wrapper = styled.div`
    position : relative;
    & > .messages-scrollable{
        overflow : auto;
        height : 100%;
    }
    & > .messages-scrollable > .messages-notification{
        position : absolute;
        left: 0;
        right: 0;
        margin: auto;
    }
`;

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
                <Wrapper className={className} >
                    <div className='messages-scrollable'>
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
                                            renderNewItemNotification={(show, onClick) => (
                                                <NewItemNotification className='messages-notification' show={show} onClick={onClick} />)}
                                            renderItem={(message) => (
                                                <SingleMessage key={message.id} roomId={roomId} profiles={profiles} message={message} />
                                            )}
                                        />
                                    )
                                }
                            }
                        </MessagesLoader>
                    </div>
                </Wrapper >
            ), [roomId, className, profiles])
    };

export default Messages;