import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

export type Order = {
    key: string,
    order: 'desc' | 'asc'
}

type LoadDirection = 'older' | 'newer';
type LoadTarget = 'new' | 'existing';
type Unsubscribe = () => void;

type ItemTypeBase = {
    id: string,
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
            startAfter?: T[keyof T],
            startAt?: T[keyof T],
            endAt?: T[keyof T]
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
    forwardListenable: boolean
) => React.ReactElement;

const convertToFirestoreOrder = (direction: LoadDirection, loadTarget: LoadTarget, key : string): Order => {
    if (loadTarget === 'existing') {
        return direction === 'older' ? { key, order: 'desc' } : { key, order: 'asc' };
    }
    // loadTarget==='new'
    return direction === 'older' ? { key, order: 'asc' } : { key, order: 'desc' };
}

const hasMore = <T extends ItemTypeBase>(sentinel:T, loaded : T[]) => {
    if(sentinel){
        if(loaded.length === 0){ // has not read yet.
            return false;
        }
        return ! Boolean(loaded.find(m => m.id === sentinel.id))
    }
    return false;
}

function useInfiniteSnapshotListener<T extends ItemTypeBase>({
    limit,
    loadTarget,
    sortKey,
    forwardSentinel,
    registSnapshotListener
}: {
    limit?: number,
    loadTarget: LoadTarget,
    sortKey: keyof T,
    forwardSentinel?: T,
    registSnapshotListener: SnapshotListenerRegister<T>
}) {
    const [loaded, setMessages] = useState<T[]>([]);
    const unsubscribes = useRef<Unsubscribe[]>([]);
    const readItems = useCallback(({
        startAfter,
        startAt,
        direction
    }: {
        direction: LoadDirection
        startAt?: T[keyof T],
        startAfter?: T[keyof T],
    }) => {
        const endAt = direction === 'newer' ? forwardSentinel?.[sortKey] : undefined;
        const unsubscribe = registSnapshotListener(
            {
                limit,
                order: convertToFirestoreOrder(direction, loadTarget, sortKey.toString()),
                startAfter,
                startAt,
                endAt,
                onAdded: (results) => {
                    if (results.length > 0) {
                        if (direction === 'older') {
                            if (loadTarget === 'existing') {
                                setMessages(prev => [...prev, ...results])
                            } else {
                                setMessages(prev => [...results, ...prev]);
                            }
                        }
                        else {
                            if (loadTarget === 'existing') {
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
    }, [limit, loadTarget, sortKey, forwardSentinel, registSnapshotListener]);

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
        loaded,
        readItems
    }
}

function ExistingItemListener<T extends ItemTypeBase>(
    {
        children,
        items,
        backwardSentinel,
        forwardSentinel,
        limit,
        startDate,
        sortKey,
        registSnapshotListener
    }: {
        children: Children<T>,
        items: T[],
        backwardSentinel: T,
        forwardSentinel: T,
        limit: number,
        sortKey : keyof T,
        startDate: T[keyof T],
        registSnapshotListener: SnapshotListenerRegister<T>
    }
) {
    const {
        loaded,
        readItems
    } = useInfiniteSnapshotListener({
        limit,
        loadTarget : 'existing',
        sortKey,
        forwardSentinel,
        registSnapshotListener
    })
    useEffect(() => {
        readItems({
            startAt : startDate,
            direction : 'older'
        });
    }, [startDate, readItems]);

    const hasOlderItems = hasMore(backwardSentinel,loaded);
    const hasNewerItems = hasMore(forwardSentinel,loaded);

    const allItems = useMemo(() => {
        return hasNewerItems ? loaded : [...items, ...loaded];
    }, [items, loaded, hasNewerItems]);

    const handleReadMore = useCallback((toNewer?: boolean) => {
        if (allItems.length > 0) {
            if (!toNewer && hasOlderItems) {
                readItems({
                    startAfter: allItems[allItems.length - 1][sortKey],
                    direction: 'older'
                });
            }
            else if (toNewer && hasNewerItems) {
                readItems({
                    startAfter: allItems[0][sortKey],
                    direction: 'newer'
                });
            }
        }

    }, [hasOlderItems, allItems, readItems, hasNewerItems, sortKey]);

    return children(allItems, handleReadMore, hasOlderItems, hasNewerItems);
}

function NewItemListener<T extends ItemTypeBase>(
    {
        children,
        start,
        backwardSentinel,
        forwardSentinel,
        registSnapshotListener,
        sortKey,
        sortOrigin,
        limit=10
    }: {
        children: Children<T>,
        backwardSentinel?: T,
        forwardSentinel?: T,
        sortKey : keyof T,
        sortOrigin : T[keyof T],
        start?: T,
        limit?: number
        registSnapshotListener: SnapshotListenerRegister<T>
    }
) {
    const {
        loaded,
        readItems
    } = useInfiniteSnapshotListener({
        loadTarget: 'new',
        sortKey: sortKey,
        registSnapshotListener
    })
    useEffect(() => {
        readItems({
            startAfter : sortOrigin, 
            direction : 'older'
        });
    }, [sortOrigin, readItems]);

    if (!forwardSentinel || !backwardSentinel) {
        return children(loaded, () => { }, false, false);
    }

    return <ExistingItemListener
        children={children}
        items={loaded}
        sortKey={sortKey}
        backwardSentinel={backwardSentinel}
        forwardSentinel={forwardSentinel}
        startDate={start?start[sortKey]:sortOrigin}
        limit={limit}
        registSnapshotListener={registSnapshotListener}
    />;
}

export default NewItemListener;