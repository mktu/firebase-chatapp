import React, { useCallback, useEffect, useState } from 'react';
import { Message } from '../../../../../types/message';
import { Profile } from '../../../../../types/profile';
import InfiniteSnapshotLoader, { SnapshotListenerRegister } from '../../Loaders/InfiniteSnapshotLoader';
import { LoadingStatusType, LoadingStatus } from '../../../constants';
import Presenter from './Presenter';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';
import SingleMessageContainer from '../SingleMessage';
import {MessageListenerRegister, GetMessages, GetMessage, AddReaction} from '../types';

const Container: React.FC<{
    roomId: string,
    focusMessageId?: string,
    className?:string,
    messageListenerRegister: MessageListenerRegister,
    getMessages: GetMessages,
    getMessage: GetMessage,
    addReaction : AddReaction,
    profiles : Profile[],
    profile : Profile,
}> = ({
    roomId,
    className,
    messageListenerRegister,
    getMessages,
    getMessage,
    addReaction,
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
        useEffect(()=>{
            status === 'loading' && setTimeout(() => {
                setStatus(prev=>{
                    return prev==='loading' ? 'succeeded' : prev;
                })
            }, 3000);
        },[status]);

        const registSnapshotListener: SnapshotListenerRegister<Message> = useCallback((args) => {
            return messageListenerRegister({
                roomId,
                ...args
            })
        }, [roomId, messageListenerRegister]);

        return <Presenter className={className} loadingStatus={status}>
            {
                ({
                    listComponent,
                    listItemComponent,
                    classes
                }) => (
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
                                            loadMore={readMore}
                                            hasOlderItems={hasOlderItems}
                                            items={messages}
                                            classes={classes}
                                            focusItemId={focusMessageId}
                                            listComponent={listComponent}
                                            listItemComponent={listItemComponent}
                                            hasNewerItems={hasNewerItems}
                                            renderNewItemNotification={(show, onClick) => (
                                                <NewItemNotification className='messages-notification' show={show} onClick={onClick} />)}
                                            renderItem={(message: Message) => (<SingleMessageContainer
                                                roomId={roomId}
                                                profile={profile!}
                                                message={message}
                                                profiles={profiles}
                                                addReaction={addReaction}
                                            />)}
                                        />
                                    )
                            }
                        </InfiniteSnapshotLoader>
                    )
            }
        </Presenter>

    }

export default Container;