import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller'
import List from '@material-ui/core/List';
import SingleMessage from './SingleMessage';
import { Profile } from '../../../../types/profile';
import { MessagesLoader } from '../Loaders';
import { Message } from '../../../../types/message';

const StyledList = styled(List)`
    display:flex;
    flex-direction : column-reverse;
`;

const MessageList: React.FC<{
    profiles: Profile[],
    messages: Message[],
    roomId: string,
    loadMore: () => void,
    hasMore: boolean,
    autoScrollThreshold?: number
}> = ({
    profiles,
    messages,
    roomId,
    loadMore,
    hasMore,
    autoScrollThreshold = 100
}) => {
        const messagesEndRef = useRef<any>(null);
        const [manualScroll, setManualScroll] = useState(false);
        const [latestMessage, setLatestMessage] = useState<Message>();
        const [automaticallyScrollDown, setAutomaticallyScrollDown] = useState(false);
        useEffect(() => {
            let enableAutomaticallyScrollDown = false;
            messagesEndRef.current && messagesEndRef.current.parentNode.addEventListener('scroll', (event: any) => {
                const node = event.target;
                const margin = node.scrollHeight - (node.scrollTop + node.clientHeight);
                if (margin < autoScrollThreshold) {
                    if (!enableAutomaticallyScrollDown) {
                        setAutomaticallyScrollDown(true);
                    }
                    enableAutomaticallyScrollDown = true;
                } else {
                    if (enableAutomaticallyScrollDown) {
                        setAutomaticallyScrollDown(false);
                    }
                    enableAutomaticallyScrollDown = false;
                }
            });
        }, [])
        useEffect(() => {
            if (messages.length == 0) return;

            if (messagesEndRef.current) {
                if (!latestMessage) {
                    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                        setManualScroll(true);
                    }, 1000);
                }
                else if (latestMessage.id !== messages[0].id) {
                    if (automaticallyScrollDown) {
                        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }
            setLatestMessage(messages[0]);
        }, [messages]);

        return useMemo(() => (
            <React.Fragment>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={hasMore && manualScroll}
                    useWindow={false}
                    isReverse
                >
                    <StyledList>
                        {messages.map((mes) => (<SingleMessage key={mes.id} roomId={roomId} profiles={profiles} message={mes} />))}
                    </StyledList>
                </InfiniteScroll>
                <div ref={messagesEndRef} />
            </React.Fragment>
        ), [messages, loadMore, hasMore, roomId, profiles, manualScroll]);
    }

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
                                    <MessageList
                                        loadMore={readMore}
                                        hasMore={hasMore}
                                        messages={messages}
                                        profiles={profiles}
                                        roomId={roomId}
                                    />
                                )
                            }
                        }
                    </MessagesLoader>
                </div >
            ), [roomId, className, profiles])
    };

export default Messages;