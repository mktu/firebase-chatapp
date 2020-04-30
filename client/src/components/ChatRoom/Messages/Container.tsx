import React, { useCallback, useEffect, useState, useMemo } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Message } from '../../../../../types/message';
import { Profile } from '../../../../../types/profile';
import InfiniteSnapshotListener, { SnapshotListenerRegister } from '../../Loaders/InfiniteSnapshotListener';
import { LoadingStatusType, LoadingStatus } from '../../../constants';
import Presenter from './Presenter';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';
import SingleMessageContainer from '../SingleMessage';
import { MessageListenerRegister, GetMessageAtEnd, GetMessage, AddReaction, EditMessage, DisableMessage } from '../types';

const Container: React.FC<{
    focusMessageId?: string,
    className?: string,
    messageListenerRegister: MessageListenerRegister,
    getLatestMessage: GetMessageAtEnd,
    getOldestMessage:GetMessageAtEnd,
    getMessage: GetMessage,
    addReaction: AddReaction,
    editMessage : EditMessage,
    disableMessage: DisableMessage,
    profiles: Profile[],
    profile: Profile,
}> = ({
    className,
    messageListenerRegister,
    getLatestMessage,
    getOldestMessage,
    getMessage,
    addReaction,
    editMessage,
    disableMessage,
    profiles,
    profile,
    focusMessageId,
}) => {
        const [status, setStatus] = useState<LoadingStatusType>(LoadingStatus.Loading);
        const [backwardSentinel, setBackwardSentinel] = useState<Message>();
        const [forwardSentinel, setForwardSentinel] = useState<Message>();
        const [start, setStart] = useState<Message>();
        useEffect(() => {
            let unmounted = false;
            if (focusMessageId) {
                getMessage({
                    messageId: focusMessageId,
                    onSucceeded: (message) => {
                        if (unmounted) return;
                        setStart(message)
                    }
                })
            }
            getOldestMessage({
                onAdded: (item) => {
                    if (unmounted) return;
                    setBackwardSentinel(item)
                    setStatus(LoadingStatus.Succeeded);
                },
                onFailed: () => {
                    if (unmounted) return;
                    setStatus(LoadingStatus.Failed);
                }
            })
            getLatestMessage({
                onAdded: (item) => {
                    if (unmounted) return;
                    setForwardSentinel(item);
                },
                onFailed: () => {
                    if (unmounted) return;
                    setStatus(LoadingStatus.Failed);
                }
            })
            return () => {
                unmounted = true;
                setStatus(LoadingStatus.Loading);
                setStart(undefined);
                setBackwardSentinel(undefined);
                setForwardSentinel(undefined);
            }
        }, [focusMessageId, getMessage, getLatestMessage,getOldestMessage]);

        // loading timeout
        useEffect(() => {
            status === 'loading' && setTimeout(() => {
                setStatus(prev => {
                    return prev === 'loading' ? 'succeeded' : prev;
                })
            }, 3000);
        }, [status]);

        const registSnapshotListener: SnapshotListenerRegister<Message> = useCallback((args) => {
            return messageListenerRegister(args);
        }, [messageListenerRegister]);

        const startDate = useMemo(() => {
            return Date.now();
        }, []);
        return <Presenter className={className} loadingStatus={status}>
            {
                ({ classes }) => (
                    <InfiniteSnapshotListener
                        start={start}
                        sortOrigin={startDate}
                        sortKey='date'
                        backwardSentinel={backwardSentinel}
                        forwardSentinel={forwardSentinel}
                        registSnapshotListener={registSnapshotListener}
                    >
                        {
                            (
                                messages,
                                readMore,
                                hasOlderItems,
                                hasNewerItems
                            ) => (
                                    <InfiniteScrollable
                                        classes={classes}
                                        loadMore={readMore}
                                        hasOlderItems={hasOlderItems}
                                        hasNewerItems={hasNewerItems}
                                        items={messages}
                                        focusItemId={focusMessageId}
                                        listComponent={List}
                                        listItemComponent={ListItem}
                                        notificationComponent={NewItemNotification}
                                    >
                                        {(message: Message) => (
                                            <SingleMessageContainer
                                                profile={profile!}
                                                message={message}
                                                profiles={profiles}
                                                addReaction={addReaction}
                                                editMessage={editMessage}
                                                disableMessage={disableMessage}
                                            />)}
                                    </InfiniteScrollable>
                                )
                        }
                    </InfiniteSnapshotListener>
                )
            }
        </Presenter>

    }

export default Container;