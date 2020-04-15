import React, { useCallback, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Message } from '../../../../../types/message';
import { Profile } from '../../../../../types/profile';
import InfiniteSnapshotLoader, { SnapshotListenerRegister } from '../../Loaders/InfiniteSnapshotLoader';
import { LoadingStatusType, LoadingStatus } from '../../../constants';
import Presenter from './Presenter';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';
import SingleMessageContainer from '../SingleMessage';
import { MessageListenerRegister, GetMessages, GetMessage, AddReaction, EditMessage, DisableMessage } from '../types';

const Container: React.FC<{
    roomId: string,
    focusMessageId?: string,
    className?: string,
    messageListenerRegister: MessageListenerRegister,
    getMessages: GetMessages,
    getMessage: GetMessage,
    addReaction: AddReaction,
    editMessage : EditMessage,
    disableMessage: DisableMessage,
    profiles: Profile[],
    profile: Profile,
}> = ({
    roomId,
    className,
    messageListenerRegister,
    getMessages,
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
                    roomId,
                    messageId: focusMessageId,
                    onSucceeded: (message) => {
                        if (unmounted) return;
                        setStart(message)
                    }
                })
            }
            getMessages({
                roomId,
                limit: 1,
                order: { key: 'date', order: 'asc' },
                onAdded: (items) => {
                    if (unmounted) return;
                    items.length > 0 && setBackwardSentinel(items[0])
                    setStatus(LoadingStatus.Succeeded);
                },
                onFailed: () => {
                    if (unmounted) return;
                    setStatus(LoadingStatus.Failed);
                }
            });
            getMessages({
                roomId,
                limit: 1,
                order: { key: 'date', order: 'desc' },
                onAdded: (items) => {
                    if (unmounted) return;
                    items.length > 0 && setForwardSentinel(items[0])
                },
                onFailed: () => {
                    if (unmounted) return;
                    setStatus(LoadingStatus.Failed);
                }
            });
            return () => {
                unmounted = true;
                setStatus(LoadingStatus.Loading);
                setStart(undefined);
                setBackwardSentinel(undefined);
                setForwardSentinel(undefined);
            }
        }, [roomId, focusMessageId, getMessage, getMessages]);

        // loading timeout
        useEffect(() => {
            status === 'loading' && setTimeout(() => {
                setStatus(prev => {
                    return prev === 'loading' ? 'succeeded' : prev;
                })
            }, 3000);
        }, [status]);

        const registSnapshotListener: SnapshotListenerRegister<Message> = useCallback((args) => {
            return messageListenerRegister({
                roomId,
                ...args
            })
        }, [roomId, messageListenerRegister]);

        return <Presenter className={className} loadingStatus={status}>
            {
                ({ classes }) => (
                    <InfiniteSnapshotLoader
                        start={start}
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
                                                roomId={roomId}
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
                    </InfiniteSnapshotLoader>
                )
            }
        </Presenter>

    }

export default Container;