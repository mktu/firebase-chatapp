import React, { useState, useMemo, useEffect } from 'react';
import { registMessagesListener, getMessages } from '../../services/message';
import { Message } from '../../types/message';
import { LoadingStatus } from '../../constants';

type Props = {
    children: (
        messages: Message[],
        readMore: () => void,
        hasMore: boolean
    ) => React.ReactElement,
    roomId: string,
    fallback?: () => React.ReactElement,
    loading?: () => React.ReactElement,
}

const MessagesLoader: React.FC<Props> = ({
    children,
    roomId,
    fallback,
    loading
}) => {
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const [sentinel, setSentinel] = useState<Message>();
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        getMessages({
            roomId, 
            limit:1, 
            order:'asc', 
            onAdded:(results) => {
                setSentinel(results[0]);
            },
        });
    },[roomId]);
    useEffect(() => {
        const unsubscribe = registMessagesListener(roomId, 10, (results) => {
            if (results.length > 0) {
                setMessages(prev => [...results, ...prev]);
                setStatus(LoadingStatus.Succeeded);
            } else {
                setStatus(LoadingStatus.Failed);
            }
        }, (results) => {
            setMessages(prev => {
                return prev.map(mes => {
                    const found = results.find(m => m.id === mes.id);
                    if (found) {
                        return found;
                    }
                    return mes;
                });
            })
        }, (results) => {
            setMessages(prev => {
                return prev.filter(mes => {
                    const found = results.find(m => m.id === mes.id);
                    if (found) {
                        return false;
                    }
                    return true;
                })
            });
        });
        return () => {
            unsubscribe();
            setMessages([]);
            setSentinel(undefined);
            setStatus(LoadingStatus.Loading);
        };
    }, [roomId]);
    const hasMore = useMemo(()=>{
        return sentinel && !Boolean(messages.find(m=>m.id===sentinel?.id));
     },[messages,sentinel,roomId]) || false;

    if (status === LoadingStatus.Failed) {
        return fallback ? fallback() : null;
    }

    if (status === LoadingStatus.Loading) {
        return loading ? loading() : null;
    }

    const readMore = () => {
        getMessages({
            roomId, 
            limit:10, 
            cursor:messages[messages.length - 1], 
            order:'desc', 
            onAdded:(results) => {
                setMessages(prev => [...prev, ...results]);
            }
        });
    };
    return children(messages, readMore, hasMore );
};

export default MessagesLoader;