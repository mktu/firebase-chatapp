import React, { useState, useMemo, useEffect } from 'react';
import { registMessagesListener, getMessages } from '../../services/message';
import { Message } from '../../types/message';
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

function useMessageListener({
    roomId,
    limit,
    order,
    start,
    sentinel,
}: {
    roomId: string,
    limit?: number,
    order: Direction,
    start?: number,
    sentinel: Message,
}) {
    const [hasMore, setHasMore] = useState(false);
    const [loaded, setMessages] = useState<Message[]>([]);
    
    useEffect(() => {
        const unsubscribe = registMessagesListener({
            roomId,
            limit,
            order,
            start,
            onAdded: (results) => {
                if (results.length > 0) {
                    setMessages(prev => [...results, ...prev]);
                    if (sentinel) {
                        setHasMore(!Boolean(results.find(m => m.id === sentinel?.id)));
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
        return () => {
            unsubscribe && unsubscribe();
            setMessages([]);
            setHasMore(false);
        };
    }, [roomId, start, limit, order, sentinel]);

    return {
        hasMore,
        loaded
    }
}


const descOrder : Direction = {
    key: 'date',
    direction: 'desc'
};
const ascOrder : Direction = {
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
        limit:number
        startDate? : number
    }
) {
    const {
        hasMore,
        loaded,
    } = useMessageListener({
        roomId,
        limit,
        order: descOrder,
        start: startDate,
        sentinel
    })
    const [readMore, setReadMore] = useState<boolean>(false);
    const handleReadMore = () => {
        setReadMore(true);
    };
    const allMessages = useMemo(() => {
        return [...messages, ...loaded];
    }, [messages, loaded]);

    if (hasMore&&readMore) {
        return <BackwardMessageLoader
            roomId={roomId}
            children={children}
            messages={allMessages}
            sentinel={sentinel}
            limit={10}
            startDate={loaded[loaded.length-1].date}
        />;
    }
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
    const startDate = useMemo(()=>{
        return Date.now();
    },[]);
    const {
        loaded,
    } = useMessageListener({
        roomId,
        order: ascOrder,
        start: startDate,
        sentinel
    })
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
        return ()=>{
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