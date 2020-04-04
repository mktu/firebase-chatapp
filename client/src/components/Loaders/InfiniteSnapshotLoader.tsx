import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

type Order = {
    key: string,
    order: 'desc' | 'asc'
}

type LoadDirection = 'backward' | 'forward';

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
        return direction === 'backward' ? { key: orderBase.key, order: 'desc' } : { key: orderBase.key, order: 'asc' };
    }
    return direction === 'backward' ? { key: orderBase.key, order: 'asc' } : { key: orderBase.key, order: 'desc' };
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
    const backwardListenable = backwardSentinel ? ! Boolean(loaded.find(m => m.id === backwardSentinel.id)) : false;
    const forwardListenable = forwardSentinel ? ! Boolean(loaded.find(m => m.id === forwardSentinel?.id)) : false;
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
        const endAt = direction === 'forward' ? forwardSentinel?.date : undefined;
        const unsubscribe = registSnapshotListener(
            {
                limit,
                order: calcOrder(direction, order),
                startAfter,
                startAt,
                endAt,
                onAdded: (results) => {
                    if (results.length > 0) {
                        if (direction === 'backward') {
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
        backwardListenable,
        forwardListenable,
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
        backwardListenable,
        forwardListenable,
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
            direction : 'backward'
        });
    }, [startDate, readItems]);

    const allItems = useMemo(() => {
        return forwardListenable ? loaded : [...items, ...loaded];
    }, [items, loaded, forwardListenable]);

    const handleReadMore = useCallback((forward?: boolean) => {
        if (allItems.length > 0) {
            if (!forward && backwardListenable) {
                readItems({
                    startAfter: allItems[allItems.length - 1].date,
                    direction: 'backward'
                });
            }
            else if (forward && forwardListenable) {
                readItems({
                    startAfter: allItems[0].date,
                    direction: 'forward'
                });
            }
        }

    }, [backwardListenable, allItems, readItems, forwardListenable]);

    return children(allItems, handleReadMore, backwardListenable, forwardListenable);
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
            direction : 'backward'
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