import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller'

function ScrollableContainer<T extends { id: string }>({
    items,
    loadMore,
    hasMore,
    renderItem,
    className,
    autoScrollThreshold = 100,
    nextScrollThreshold = 250,
    listComponent = 'div',
    renderNewItemNotification = () => (<div />)
}: {
    items: T[],
    renderItem: (item: T) => React.ReactElement,
    loadMore: () => void,
    hasMore: boolean,
    autoScrollThreshold?: number,
    nextScrollThreshold?: number
    listComponent?: any,
    className?: string,
    renderNewItemNotification?: (show: boolean, onClickScrollToBottom: () => void) => React.ReactElement
}) {
    const itemsEndRef = useRef<HTMLDivElement | null>(null);
    const [lastestId, setLatestId] = useState<string>();
    const StyledList = useMemo(() => styled(listComponent)`
        display:flex;
        flex-direction : column-reverse;
    `, [listComponent]);
    const [automaticallyScrollDown, setAutomaticallyScrollDown] = useState(false);
    const [triggerNextLoad, setTriggerNextLoad] = useState<'forward' | 'none' | 'backward'>('none');
    const [loading, setLoading] = useState(false);
    const [lastScrollPosition, setLastScrollPosition] = useState<{
        scrollTop: number,
        scrollHeight: number
    }>();

    const hasItemNotSeen = items.length > 0 && lastestId !== items[0].id && !automaticallyScrollDown;
    useEffect(() => {
        let enableAutomaticallyScrollDown = false;
        let unmounted = false;
        const parentNode = itemsEndRef.current && itemsEndRef.current.parentNode;
        const onScroll = (event: any) => {
            if (unmounted) return;
            const node = event.target;
            const marginBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
            const marginTop = node.scrollTop;
            if (marginTop < nextScrollThreshold && triggerNextLoad!=='backward' ) {
                setTriggerNextLoad('backward');
            }
            else {
                triggerNextLoad!=='none' && setTriggerNextLoad('none')
            }
            if (marginBottom < autoScrollThreshold) {
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
    }, [autoScrollThreshold, hasMore, setTriggerNextLoad, triggerNextLoad, loading]);

    useEffect(() => {
        if (hasMore && !loading && triggerNextLoad !== 'none') {
            setLoading(true);
            const parentNode = itemsEndRef.current && itemsEndRef.current.parentElement
            if (parentNode) {
                console.log('UPDATE')
                setLastScrollPosition({
                    scrollHeight: parentNode.scrollHeight,
                    scrollTop: parentNode.scrollTop
                });
            }
            loadMore();
        }
    }, [hasMore, loadMore, loading, setLoading, triggerNextLoad, setLastScrollPosition]);

    useEffect(()=>{
        hasMore && loadMore();
    },[hasMore,loadMore]);

    useEffect(() => {
        const parentNode = itemsEndRef.current && itemsEndRef.current.parentElement;
        if (parentNode && lastScrollPosition) {
            console.log('Next Top')
            parentNode.scrollTop = parentNode.scrollHeight -
                lastScrollPosition.scrollHeight +
                lastScrollPosition.scrollTop;
            setLastScrollPosition(undefined)
            setLoading(false);
        }
    }, [items.length, setLastScrollPosition])

    useEffect(() => {
        if (items.length === 0) return;
        if (itemsEndRef.current) {
            if (!lastestId) {
                itemsEndRef.current.scrollIntoView();
                setLatestId(items[0].id!);
            }
            else if (lastestId !== items[0].id) {
                if (automaticallyScrollDown) {
                    setLatestId(items[0].id!);
                    itemsEndRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
    }, [items, automaticallyScrollDown, lastestId]);

    return useMemo(() => (
        <React.Fragment>
            <StyledList className={className}>
                {items.map(renderItem)}
            </StyledList>
            <div ref={itemsEndRef} />
            {renderNewItemNotification(hasItemNotSeen, () => {
                itemsEndRef.current?.scrollIntoView({ behavior: "smooth" });
            })}
        </React.Fragment>
    ), [className, items, renderItem, hasItemNotSeen, renderNewItemNotification]);
}


export default ScrollableContainer;