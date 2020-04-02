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
        start,
        onAdded,
        onModified,
        onDeleted
    }:
        {
            limit?: number,
            order: Order,
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

const calcOrder = (direction:LoadDirection, orderBase:Order) : Order=> {
    if(orderBase.order==='desc'){
        return direction === 'backward' ? {key:orderBase.key,order:'desc'} : {key:orderBase.key,order:'asc'};
    }
    return direction === 'backward' ? {key:orderBase.key,order:'asc'} : {key:orderBase.key,order:'desc'};
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
    backwardSentinel: T,
    forwardSentinel?: T,
    registSnapshotListener: SnapshotListenerRegister<T>
}) {
    const [backwardListenable, setBackwardListenable] = useState(false);
    const [forwardListenable, setForwardListenable] = useState(false);
    const [loaded, setMessages] = useState<T[]>([]);
    const unsubscribes = useRef<Unsubscribe[]>([]);
    const readItems = useCallback((start: number, direction: LoadDirection) => {
        const unsubscribe = registSnapshotListener(
            {
                limit,
                order:calcOrder(direction,order),
                start,
                onAdded: (results) => {
                    if (results.length > 0) {
                        if (direction === 'backward') {
                            if (backwardSentinel) {
                                setBackwardListenable(!Boolean(results.find(m => m.id === backwardSentinel?.id)));
                            }
                            if (order.order === 'desc') {
                                setMessages(prev => [...prev, ...results])
                            } else {
                                setMessages(prev => [...results, ...prev]);
                            }
                        }
                        else{
                            if (forwardSentinel) {
                                setForwardListenable(!Boolean(results.find(m => m.id === forwardSentinel?.id)));
                            }
                            if (order.order === 'desc') {
                                setMessages(prev => [...results, ...prev])
                            } else {
                                setMessages(prev => [...prev, ...results]);
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
    }, [limit, order, backwardSentinel, forwardSentinel, registSnapshotListener]);

    useEffect(() => {
        return () => {
            for (const unsubscribe of unsubscribes.current) {
                unsubscribe();
            }
            setMessages([]);
            setBackwardListenable(false);
            setForwardListenable(false);
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
        backwardListenable,
        forwardListenable,
        loaded,
        readItems
    } = useInfiniteSnapshotListener({
        limit,
        order: descOrder,
        backwardSentinel: sentinel,
        registSnapshotListener
    })
    useEffect(() => {
        readItems(startDate, 'backward');
    }, [startDate, readItems]);

    const allItems = useMemo(() => {
        return [...items, ...loaded];
    }, [items, loaded]);

    const handleReadMore = useCallback((forward?: boolean) => {
        if(allItems.length > 0){
            if (!forward && backwardListenable) {
                readItems(allItems[allItems.length - 1].date, 'backward');
            }
            else if(forward && forwardListenable) {
                readItems(allItems[0].date, 'forward');
            }
        }
        
    }, [backwardListenable, allItems, readItems, forwardListenable]);

    return children(allItems, handleReadMore, backwardListenable, forwardListenable);
}

function LatestItemLoader<T extends ItemTypeBase>(
    {
        children,
        backwardSentinel,
        forwardSentinel,
        registSnapshotListener
    }: {
        children: Children<T>,
        backwardSentinel: T,
        forwardSentinel?: T,
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
        readItems(startDate, 'backward');
    }, [startDate, readItems]);

    return <BackwardItemLoader
        children={children}
        items={loaded}
        sentinel={backwardSentinel}
        startDate={startDate}
        limit={10}
        registSnapshotListener={registSnapshotListener}
    />;
}

export default LatestItemLoader;