import React, { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { Message } from '../../../../../types/message';
import InfiniteSnapshotListener, { SnapshotListenerRegister } from '../../Loaders/InfiniteSnapshotListener';
import { ServiceContext } from '../../../contexts';
import { LoadingStatusType, LoadingStatus } from '../../../constants';

const MessageLoader: React.FC<{
    roomId: string,
    messageId?: string,
    children: (props:
        {
            messages: Message[],
            readMore: (forward?: boolean) => void,
            backwardListenable: boolean,
            forwardListenable: boolean
        }
    ) => React.ReactElement
}> = ({
    roomId,
    messageId,
    children
}) => {
        const [status, setStatus] = useState<LoadingStatusType>(LoadingStatus.Loading);
        const [backwardSentinel, setBackwardSentinel] = useState<Message>();
        const [forwardSentinel, setForwardSentinel] = useState<Message>();
        const [start, setStart] = useState<Message>();
        const { getLatestMessage, getOldestMessage, getMessage, registMessagesListener } = useContext(ServiceContext);

        useEffect(() => {
            let unmounted = false;
            if (messageId) {
                getMessage({
                    roomId,
                    messageId,
                    onSucceeded: (message) => {
                        if (unmounted) return;
                        setStart(message)
                    }
                })
            }
            return () => {
                unmounted = true;
                setStart(undefined);
            }
        },[messageId,roomId,getMessage]);

        useEffect(() => {
            let unmounted = false;
            
            getOldestMessage({
                roomId,
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
                roomId,
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
                setBackwardSentinel(undefined);
                setForwardSentinel(undefined);
            }
        }, [roomId, getLatestMessage, getOldestMessage]);

        // loading timeout
        useEffect(() => {
            let unmounted = false;
            status === 'loading' && setTimeout(() => {
                !unmounted && setStatus(prev => {
                    return prev === 'loading' ? 'succeeded' : prev;
                })
            }, 3000);
            return () => {
                unmounted = true;
            }
        }, [status]);

        const registSnapshotListener: SnapshotListenerRegister<Message> = useCallback((args) => {
            return registMessagesListener({ ...args, roomId });
        }, [roomId, registMessagesListener]);

        const startDate = useMemo(() => Date.now(), []);
        return (
            <InfiniteSnapshotListener
                loadOrigin={start?.date}
                sortOrigin={startDate}
                sortKey='date'
                uniqueKey='id'
                backwardSentinel={backwardSentinel}
                forwardSentinel={forwardSentinel}
                registSnapshotListener={registSnapshotListener}
            >
                {
                    (
                        messages,
                        readMore,
                        backwardListenable,
                        forwardListenable
                    ) => children({
                        messages,
                        readMore,
                        backwardListenable,
                        forwardListenable
                    })
                }
            </InfiniteSnapshotListener>
        )

    }

export default MessageLoader;