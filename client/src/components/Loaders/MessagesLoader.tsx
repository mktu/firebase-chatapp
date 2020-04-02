import React, { useCallback, useEffect, useState } from 'react';
import { registMessagesListener, getMessages } from '../../services/message';
import { Message } from '../../../../types/message';
import InfiniteSnapshotLoader, { SnapshotListenerRegister } from './InfiniteSnapshotLoader';
import { LoadingStatusType, LoadingStatus } from '../../constants';


type Children = (
    messages: Message[],
    readMore: () => void,
    hasMore: boolean,
    forwardScrollable?:boolean
) => React.ReactElement;

const MessagesLoader: React.FC<{
    children: Children,
    roomId: string,
    fallback?: () => React.ReactElement,
    loading?: () => React.ReactElement,
}> = ({
    children,
    roomId,
    fallback,
    loading
}) => {
        const [status, setStatus] = useState<LoadingStatusType>(LoadingStatus.Loading);
        const [backwardSentinel, setBackwardSentinel] = useState<Message>();
        const [forwardSentinel, setForwardSentinel] = useState<Message>();
        useEffect(() => {
            getMessages({
                roomId,
                limit: 1,
                order: { key: 'date', order: 'asc' },
                onAdded: (items) => {
                    items.length > 0 && setBackwardSentinel(items[0])
                    setStatus(LoadingStatus.Succeeded);
                },
                onFailed: () => {
                    setStatus(LoadingStatus.Failed);
                }
            });
            getMessages({
                roomId,
                limit: 1,
                order: { key: 'date', order: 'desc' },
                onAdded: (items) => {
                    items.length > 0 && setForwardSentinel(items[0])
                },
                onFailed: () => {
                    setStatus(LoadingStatus.Failed);
                }
            });
            return () => {
                setStatus(LoadingStatus.Loading);
                setBackwardSentinel(undefined);
                setForwardSentinel(undefined);
            }
        }, [roomId]);

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
            backwardSentinel={backwardSentinel}
            forwardSentinel={forwardSentinel}
            registSnapshotListener={registSnapshotListener}
        />
    }

export default MessagesLoader;