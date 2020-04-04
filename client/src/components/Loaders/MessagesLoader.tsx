import React, { useCallback, useEffect, useState } from 'react';
import { registMessagesListener, getMessages, getMessage } from '../../services/message';
import { Message } from '../../../../types/message';
import InfiniteSnapshotLoader, { SnapshotListenerRegister } from './InfiniteSnapshotLoader';
import { LoadingStatusType, LoadingStatus } from '../../constants';


type Children = (
    messages: Message[],
    readMore: () => void,
    hasMore: boolean,
    forwardScrollable?: boolean
) => React.ReactElement;

const MessagesLoader: React.FC<{
    children: Children,
    roomId: string,
    offsetMessageId?: string,
    fallback?: () => React.ReactElement,
    loading?: () => React.ReactElement,
}> = ({
    children,
    roomId,
    fallback,
    offsetMessageId,
    loading
}) => {
        const [status, setStatus] = useState<LoadingStatusType>(LoadingStatus.Loading);
        const [backwardSentinel, setBackwardSentinel] = useState<Message>();
        const [forwardSentinel, setForwardSentinel] = useState<Message>();
        const [start, setStart] = useState<Message>();
        useEffect(() => {
            let unmounted = false;
            if (offsetMessageId) {
                getMessage({
                    roomId,
                    messageId: offsetMessageId,
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
        }, [roomId, offsetMessageId]);

        const registSnapshotListener: SnapshotListenerRegister<Message> = useCallback((args) => {
            return registMessagesListener({
                roomId,
                ...args
            })
        }, [roomId]);

        if (status === LoadingStatus.Failed) {
            return fallback ? fallback() : null;
        }

        if (status === LoadingStatus.Loading) {
            return loading ? loading() : null;
        }
        return <InfiniteSnapshotLoader
            children={children}
            start={start}
            backwardSentinel={backwardSentinel}
            forwardSentinel={forwardSentinel}
            registSnapshotListener={registSnapshotListener}
        />
    }

export default MessagesLoader;