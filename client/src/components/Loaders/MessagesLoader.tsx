import React, { useCallback, useEffect, useState } from 'react';
import { registMessagesListener, getMessages } from '../../services/message';
import { Message } from '../../../../types/message';
import InfiniteSnapshotLoader, { SnapshotListenerRegister } from './InfiniteSnapshotLoader';
import { LoadingStatusType, LoadingStatus } from '../../constants';


type Children = (
    messages: Message[],
    readMore: () => void,
    hasMore: boolean
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
        const [sentinel, setSentinel] = useState<Message>();
        useEffect(() => {
            getMessages({
                roomId,
                limit: 1,
                order: { key: 'date', direction: 'asc' },
                onAdded: (items) => {
                    items.length > 0 && setSentinel(items[0])
                    setStatus(LoadingStatus.Succeeded);
                },
                onFailed: () => {
                    setStatus(LoadingStatus.Failed);
                }
            });
            return () => {
                setStatus(LoadingStatus.Loading);
            }
        }, [roomId]);

        const registSnapshotListener: SnapshotListenerRegister<Message> = useCallback(({
            limit,
            order,
            start,
            onAdded,
            onModified,
            onDeleted
        }) => {
            return registMessagesListener({
                roomId,
                limit,
                order,
                start,
                onAdded,
                onModified,
                onDeleted
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
            sentinel={sentinel!}
            registSnapshotListener={registSnapshotListener}
        />
    }

export default MessagesLoader;