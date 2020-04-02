import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';

function ScrollableContainer<T extends { id: string }>({
    items,
    loadMore,
    hasMore,
    renderItem,
    className,
    listItemClassName,
    focusItemId,
    forwardScrollable,
    autoScrollThreshold = 100,
    nextScrollThreshold = 250,
    listComponent = 'div',
    listItemComponent = 'div',
    renderNewItemNotification = () => (<div />)
}: {
    items: T[],
    renderItem: (item: T) => React.ReactElement,
    loadMore: (forward?: boolean) => void,
    hasMore: boolean,
    forwardScrollable?: boolean,
    focusItemId?: string,
    autoScrollThreshold?: number,
    nextScrollThreshold?: number
    listComponent?: any,
    listItemComponent?: any,
    listItemClassName?: string,
    className?: string,
    renderNewItemNotification?: (show: boolean, onClickScrollToBottom: () => void) => React.ReactElement
}) {
    const itemsEndRef = useRef<HTMLDivElement | null>(null);
    const focusItemRef = useRef<Element | null>(null);
    const [trackingId, setTrackingId] = useState<string>();
    const StyledList = useMemo(() => styled(listComponent)`
        display:flex;
        flex-direction : column-reverse;
    `, [listComponent]);
    const [automaticallyScrollDown, setAutomaticallyScrollDown] = useState(false);
    const [loading, setLoading] = useState<{
        direction: 'forward' | 'none' | 'backward',
        snapshot: {
            scrollTop: number,
            scrollHeight: number
        }
    }>();
    const ListItemComponent = listItemComponent;

    const hasItemNotSeen = items.length > 0 && trackingId !== items[0].id && !automaticallyScrollDown;
    useEffect(() => {
        let enableAutomaticallyScrollDown = false;
        let nextLoad: 'forward' | 'none' | 'backward' = 'none';
        let unmounted = false;
        const parentNode = itemsEndRef.current && itemsEndRef.current.parentElement;
        const onScroll = (event: Event) => {
            if (unmounted) return;
            const node = event.target as HTMLElement;
            const marginBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
            const marginTop = node.scrollTop;
            if (marginTop < nextScrollThreshold && nextLoad !== 'backward' && hasMore && !loading) {
                nextLoad = 'backward';
                parentNode && setLoading({
                    direction: nextLoad,
                    snapshot: {
                        scrollHeight: parentNode.scrollHeight,
                        scrollTop: parentNode.scrollTop
                    }
                });
                loadMore(false);
            }
            else if (marginBottom < nextScrollThreshold && nextLoad !== 'forward' && forwardScrollable && !loading) {
                nextLoad = 'forward';
                parentNode && setLoading({
                    direction: nextLoad,
                    snapshot: {
                        scrollHeight: parentNode.scrollHeight,
                        scrollTop: parentNode.scrollTop
                    }
                });
                loadMore(true);
            }
            // automatically scrolling down will be enabled after the most recent item has loaded
            if (marginBottom < autoScrollThreshold && !forwardScrollable) {
                if (!enableAutomaticallyScrollDown) {
                    setAutomaticallyScrollDown(true);
                }
                enableAutomaticallyScrollDown = true;
            } else {
                if (enableAutomaticallyScrollDown) {
                    setAutomaticallyScrollDown(false);
                }
                enableAutomaticallyScrollDown = false;
            }
        };
        parentNode && parentNode.addEventListener('scroll', onScroll);
        return () => {
            unmounted = true;
            parentNode && parentNode.removeEventListener('scroll', onScroll);
        }
    }, [autoScrollThreshold, hasMore, loading, loadMore, setLoading, nextScrollThreshold, forwardScrollable]);


    useEffect(() => {
        const parentNode = itemsEndRef.current && itemsEndRef.current.parentElement;
        if (parentNode && loading) {
            const { snapshot, direction } = loading;
            if (parentNode.scrollHeight !== snapshot.scrollHeight) {
                if (direction === 'backward') {
                    parentNode.scrollTop = parentNode.scrollHeight -
                        snapshot.scrollHeight + snapshot.scrollTop;
                }
                setLoading(undefined);
            }
        }
    }, [items.length, loading])

    useEffect(() => {
        if (items.length === 0) return;
        if (!trackingId) {
            const parentNode = itemsEndRef.current && itemsEndRef.current.parentElement;
            const element = focusItemRef.current || itemsEndRef.current;
            const scrollHeight = parentNode?.scrollHeight || 0;
            const clientHeight = parentNode?.clientHeight || 0;
            // scroll begins, start tracking the first item
            if (element && scrollHeight>clientHeight) {
                element.scrollIntoView();
                setTrackingId(items[0].id!);
            }
        }
        else if (trackingId !== items[0].id && itemsEndRef.current) {
            if (automaticallyScrollDown) {
                setTrackingId(items[0].id!);
                itemsEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [items, automaticallyScrollDown, trackingId]);

    return useMemo(() => (
        <React.Fragment>
            <StyledList className={className}>
                {items.map(item => (
                    <ListItemComponent className={listItemClassName} key={item.id} ref={focusItemId === item.id ? focusItemRef : undefined}>
                        {renderItem(item)}
                    </ListItemComponent>
                ))}
            </StyledList>
            <div ref={itemsEndRef} />
            {renderNewItemNotification(hasItemNotSeen, () => {
                itemsEndRef.current?.scrollIntoView({ behavior: "smooth" });
            })}
        </React.Fragment>
    ), [className, items, renderItem, hasItemNotSeen, renderNewItemNotification, focusItemId, listItemClassName]);
}


export default ScrollableContainer;