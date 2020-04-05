import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

export type Order = {
    key: string,
    order: 'desc' | 'asc'
}

type LoadDirection = 'older' | 'newer';

type Unsubscribe = () => void;

type ItemTypeBase = {
    id: string,
    date: number
}

export type SnapshotListenerRegister<T> = (
    {
        limit,
        order,
        startAfter,
        startAt,
        endAt,
        onAdded,
        onModified,
        onDeleted
    }:
        {
            limit?: number,
            order: Order,
            startAfter?: number,
            startAt?: number,
            endAt?: number
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
            order: Order,
            onReceived: (results: T) => void,
            onFailed: (error: Error) => void
        }) => void;
type ReadMore = (forward?: boolean) => void;
type Children<T> = (
    items: T[],
    readMore: ReadMore,
    backwardListenable: boolean,
    forwardListenable?: boolean
) => React.ReactElement;

const calcOrder = (direction: LoadDirection, orderBase: Order): Order => {
    if (orderBase.order === 'desc') {
        return direction === 'older' ? { key: orderBase.key, order: 'desc' } : { key: orderBase.key, order: 'asc' };
    }
    return direction === 'older' ? { key: orderBase.key, order: 'asc' } : { key: orderBase.key, order: 'desc' };
}


function useInfiniteSnapshotListener<T extends ItemTypeBase>({
    limit,
    order,
    backwardSentinel,
    forwardSentinel,
    registSnapshotListener
}: {
    limit?: number,
    order: Order,
    backwardSentinel?: T,
    forwardSentinel?: T,
    registSnapshotListener: SnapshotListenerRegister<T>
}) {
    const [loaded, setMessages] = useState<T[]>([]);
    const hasOlderItems = backwardSentinel ? ! Boolean(loaded.find(m => m.id === backwardSentinel.id)) : false;
    const hasNewerItems = forwardSentinel ? ! Boolean(loaded.find(m => m.id === forwardSentinel?.id)) : false;
    const unsubscribes = useRef<Unsubscribe[]>([]);
    const readItems = useCallback(({
        startAfter,
        startAt,
        direction
    }: {
        direction: LoadDirection
        startAt?: number,
        startAfter?: number,
    }) => {
        const endAt = direction === 'newer' ? forwardSentinel?.date : undefined;
        const unsubscribe = registSnapshotListener(
            {
                limit,
                order: calcOrder(direction, order),
                startAfter,
                startAt,
                endAt,
                onAdded: (results) => {
                    if (results.length > 0) {
                        if (direction === 'older') {
                            if (order.order === 'desc') {
                                setMessages(prev => [...prev, ...results])
                            } else {
                                setMessages(prev => [...results, ...prev]);
                            }
                        }
                        else {
                            if (order.order === 'desc') {
                                setMessages(prev => [...results.reverse(), ...prev])
                            } else {
                                setMessages(prev => [...prev, ...results.reverse()]);
                            }
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
    }, [limit, order, forwardSentinel, registSnapshotListener]);

    useEffect(() => {
        return () => {
            for (const unsubscribe of unsubscribes.current) {
                unsubscribe();
            }
            setMessages([]);
            unsubscribes.current = [];
        };
    }, []);

    return {
        hasOlderItems,
        hasNewerItems,
        loaded,
        readItems
    }
}
const descOrder: Order = {
    key: 'date',
    order: 'desc'
};
const ascOrder: Order = {
    key: 'date',
    order: 'asc'
};

function BackwardItemLoader<T extends ItemTypeBase>(
    {
        children,
        items,
        backwardSentinel,
        forwardSentinel,
        limit,
        startDate,
        registSnapshotListener
    }: {
        children: Children<T>,
        items: T[],
        backwardSentinel: T,
        forwardSentinel: T,
        limit: number
        startDate: number,
        registSnapshotListener: SnapshotListenerRegister<T>
    }
) {
    const {
        hasOlderItems,
        hasNewerItems,
        loaded,
        readItems
    } = useInfiniteSnapshotListener({
        limit,
        order: descOrder,
        backwardSentinel,
        forwardSentinel,
        registSnapshotListener
    })
    useEffect(() => {
        readItems({
            startAt : startDate,
            direction : 'older'
        });
    }, [startDate, readItems]);

    const allItems = useMemo(() => {
        return hasNewerItems ? loaded : [...items, ...loaded];
    }, [items, loaded, hasNewerItems]);

    const handleReadMore = useCallback((toNewer?: boolean) => {
        if (allItems.length > 0) {
            if (!toNewer && hasOlderItems) {
                readItems({
                    startAfter: allItems[allItems.length - 1].date,
                    direction: 'older'
                });
            }
            else if (toNewer && hasNewerItems) {
                readItems({
                    startAfter: allItems[0].date,
                    direction: 'newer'
                });
            }
        }

    }, [hasOlderItems, allItems, readItems, hasNewerItems]);

    return children(allItems, handleReadMore, hasOlderItems, hasNewerItems);
}

function LatestItemLoader<T extends ItemTypeBase>(
    {
        children,
        start,
        backwardSentinel,
        forwardSentinel,
        registSnapshotListener,
        limit=10
    }: {
        children: Children<T>,
        backwardSentinel?: T,
        forwardSentinel?: T,
        start?: T,
        limit?: number
        registSnapshotListener: SnapshotListenerRegister<T>
    }
) {
    const startDate = useMemo(() => {
        return Date.now();
    }, []);

    const {
        loaded,
        readItems
    } = useInfiniteSnapshotListener({
        order: ascOrder,
        backwardSentinel,
        registSnapshotListener
    })
    useEffect(() => {
        readItems({
            startAfter : startDate, 
            direction : 'older'
        });
    }, [startDate, readItems]);

    if (!forwardSentinel || !backwardSentinel) {
        return children(loaded, () => { }, false, false);
    }

    return <BackwardItemLoader
        children={children}
        items={loaded}
        backwardSentinel={backwardSentinel}
        forwardSentinel={forwardSentinel}
        startDate={start?start.date:startDate}
        limit={limit}
        registSnapshotListener={registSnapshotListener}
    />;
}

export default LatestItemLoader;