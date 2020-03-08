import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { registMessagesListener, getMessages } from '../../services/message';
import { Message } from '../../../../types/message';
import { LoadingStatus } from '../../constants';

type Children = (
    messages: Message[],
    readMore: () => void,
    hasMore: boolean
) => React.ReactElement;

type Props = {
    children: Children,
    roomId: string,
    fallback?: () => React.ReactElement,
    loading?: () => React.ReactElement,
}

type Direction = {
    key: string,
    direction: 'desc' | 'asc'
}
type Unsubscribe = () => void;
function useMessageListener2({
    roomId,
    limit,
    order,
    sentinel,
}: {
    roomId: string,
    limit?: number,
    order: Direction,
    sentinel: Message,
}) {
    const [hasMore, setHasMore] = useState(false);
    const [loaded, setMessages] = useState<Message[]>([]);
    const unsubscribes = useRef<Unsubscribe[]>([]);
    const readMessages = useCallback((start: number) => {
        const unsubscribe = registMessagesListener({
            roomId,
            limit,
            order,
            start,
            onAdded: (results) => {
                if (results.length > 0) {
                    if (sentinel) {
                        // It is necessary first to not attach the scroll event of react-infinite-scroller
                        setHasMore(!Boolean(results.find(m => m.id === sentinel?.id)));
                    }
                    if (order.direction === 'desc') {
                        setMessages(prev => [...prev, ...results])
                    } else {
                        setMessages(prev => [...results, ...prev]);
                    }
                }
            },
            onModified: (results) => {
                setMessages(prev => {
                    return prev.map(mes => {
                        const found = results.find(m => m.id === mes.id);
                        if (found) {
                            return found;
                        }
                        return mes;
                    });
                })
            },
            onDeleted: (results) => {
                setMessages(prev => {
                    return prev.filter(mes => {
                        const found = results.find(m => m.id === mes.id);
                        if (found) {
                            return false;
                        }
                        return true;
                    })
                });
            }
        });
        unsubscribes.current.push(unsubscribe);
    }, [roomId, limit, order, sentinel]);

    useEffect(() => {
        return () => {
            for (const unsubscribe of unsubscribes.current) {
                unsubscribe();
            }
            setMessages([]);
            setHasMore(false);
            unsubscribes.current = [];
        };
    }, []);

    return {
        hasMore,
        loaded,
        readMessages
    }
}
const descOrder: Direction = {
    key: 'date',
    direction: 'desc'
};
const ascOrder: Direction = {
    key: 'date',
    direction: 'asc'
};

function BackwardMessageLoader(
    {
        roomId,
        children,
        messages,
        sentinel,
        limit,
        startDate
    }: {
        roomId: string,
        children: Children,
        messages: Message[],
        sentinel: Message,
        limit: number
        startDate: number
    }
) {
    const {
        hasMore,
        loaded,
        readMessages
    } = useMessageListener2({
        roomId,
        limit,
        order: descOrder,
        sentinel
    })
    useEffect(() => {
        readMessages(startDate);
    }, [startDate, readMessages]);

    const allMessages = useMemo(() => {
        return [...messages, ...loaded];
    }, [messages, loaded]);

    const handleReadMore = useCallback(() => {
        if (hasMore && allMessages.length > 0) {
            readMessages(allMessages[allMessages.length - 1].date);
        }
    }, [hasMore, allMessages,readMessages]);

    return children(allMessages, handleReadMore, hasMore);
}

function LatestMessageLoader(
    {
        roomId,
        children,
        sentinel
    }: {
        roomId: string,
        children: Children,
        sentinel: Message
    }
) {
    const startDate = useMemo(() => {
        return Date.now();
    }, []);
    const {
        loaded,
        readMessages
    } = useMessageListener2({
        roomId,
        order: ascOrder,
        sentinel
    })
    useEffect(()=>{
        readMessages(startDate);
    },[startDate,readMessages]);
    
    return <BackwardMessageLoader
        roomId={roomId}
        children={children}
        messages={loaded}
        sentinel={sentinel}
        startDate={startDate}
        limit={10}
    />;
}

const MessagesLoader: React.FC<Props> = ({
    children,
    roomId,
    fallback,
    loading
}) => {
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const [sentinel, setSentinel] = useState<Message>();
    useEffect(() => {
        getMessages({
            roomId,
            limit: 1,
            order: 'asc',
            onAdded: (results) => {
                setSentinel(results[0]);
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

    if (status === LoadingStatus.Failed) {
        return fallback ? fallback() : null;
    }

    if (status === LoadingStatus.Loading) {
        return loading ? loading() : null;
    }

    return <LatestMessageLoader
        roomId={roomId}
        children={children}
        sentinel={sentinel!}
    />
};

export default MessagesLoader;