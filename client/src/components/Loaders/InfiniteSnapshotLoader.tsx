import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

type Direction = {
    key: string,
    direction: 'desc' | 'asc'
}

type Unsubscribe = () => void;

type ItemTypeBase = {
    id: string,
    date: number
}

export type SnapshotListenerRegister<T> = (
    {
        limit,
        order,
        start,
        onAdded,
        onModified,
        onDeleted
    }:
        {
            limit?: number,
            order: Direction,
            start: number,
            onAdded: (results: T[]) => void,
            onModified: (results: T[]) => void,
            onDeleted: (results: T[]) => void,
        }
) => Unsubscribe;

export type SingleItemLoader<T> = (
    {
        order,
        onReceived,
        onFailed
    }:
        {
            order: Direction,
            onReceived: (results: T) => void,
            onFailed: (error : Error)=>void
        }) => void;

type Children<T> = (
    items: T[],
    readMore: () => void,
    hasMore: boolean
) => React.ReactElement;


function useInfiniteSnapshotListener<T extends ItemTypeBase>({
    limit,
    order,
    sentinel,
    registSnapshotListener
}: {
    limit?: number,
    order: Direction,
    sentinel: T,
    registSnapshotListener: SnapshotListenerRegister<T>
}) {
    const [hasMore, setHasMore] = useState(false);
    const [loaded, setMessages] = useState<T[]>([]);
    const unsubscribes = useRef<Unsubscribe[]>([]);
    const readItems = useCallback((start: number) => {
        const unsubscribe = registSnapshotListener(
            {
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
            }
        )
        unsubscribes.current.push(unsubscribe);
    }, [limit, order, sentinel, registSnapshotListener]);

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
        readItems
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

function BackwardItemLoader<T extends ItemTypeBase>(
    {
        children,
        items,
        sentinel,
        limit,
        startDate,
        registSnapshotListener
    }: {
        children: Children<T>,
        items: T[],
        sentinel: T,
        limit: number
        startDate: number,
        registSnapshotListener: SnapshotListenerRegister<T>
    }
) {
    const {
        hasMore,
        loaded,
        readItems
    } = useInfiniteSnapshotListener({
        limit,
        order: descOrder,
        sentinel,
        registSnapshotListener
    })
    useEffect(() => {
        readItems(startDate);
    }, [startDate, readItems]);

    const allItems = useMemo(() => {
        return [...items, ...loaded];
    }, [items, loaded]);

    const handleReadMore = useCallback(() => {
        if (hasMore && allItems.length > 0) {
            readItems(allItems[allItems.length - 1].date);
        }
    }, [hasMore, allItems, readItems]);

    return children(allItems, handleReadMore, hasMore);
}

function LatestItemLoader<T extends ItemTypeBase>(
    {
        children,
        sentinel,
        registSnapshotListener
    }: {
        children: Children<T>,
        sentinel: T,
        registSnapshotListener: SnapshotListenerRegister<T>
    }
) {
    const startDate = useMemo(() => {
        return Date.now();
    }, []);
    const {
        loaded,
        readItems: readMessages
    } = useInfiniteSnapshotListener({
        order: ascOrder,
        sentinel,
        registSnapshotListener
    })
    useEffect(() => {
        readMessages(startDate);
    }, [startDate, readMessages]);

    return <BackwardItemLoader
        children={children}
        items={loaded}
        sentinel={sentinel}
        startDate={startDate}
        limit={10}
        registSnapshotListener={registSnapshotListener}
    />;
}

export default LatestItemLoader;