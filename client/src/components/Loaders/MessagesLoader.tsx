import React, {useCallback } from 'react';
import { registMessagesListener, getMessages } from '../../services/message';
import { Message } from '../../../../types/message';
import InfiniteSnapshotLoader, { SnapshotListenerRegister, SingleItemLoader } from './InfiniteSnapshotLoader';

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

        const itemLoader: SingleItemLoader<Message> = useCallback(({
            order,
            onReceived,
            onFailed
        }) => {
            getMessages({
                roomId,
                limit: 1,
                order,
                onAdded: (items) => {
                    items.length > 0 && onReceived(items[0])
                },
                onFailed
            })
        }, [roomId]);

        return <InfiniteSnapshotLoader
            children={children}
            fallback={fallback}
            loading={loading}
            registSnapshotListener={registSnapshotListener}
            itemLoader={itemLoader}
        />
    }

    export default MessagesLoader;