import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroller'

function ScrollableContainer<T extends { id: string }>({
    items,
    loadMore,
    hasMore,
    renderItem,
    autoScrollThreshold = 100,
    listComponent = 'div',
    renderNewItemNotification = () => (<div />)
}: {
    items: T[],
    renderItem: (item: T) => React.ReactElement,
    loadMore: () => void,
    hasMore: boolean,
    autoScrollThreshold?: number,
    listComponent?: any,
    renderNewItemNotification?: (show:boolean, onClickScrollToBottom: () => void) => React.ReactElement
}) {
    const itemsEndRef = useRef<any>(null);
    const [lastestId, setLatestId] = useState<string>();
    const StyledList = useMemo(() => styled(listComponent)`
        display:flex;
        flex-direction : column-reverse;
    `, [listComponent]);
    const [automaticallyScrollDown, setAutomaticallyScrollDown] = useState(false);
    const hasItemNotSeen = items.length>0 &&  lastestId !== items[0].id && !automaticallyScrollDown;
    useEffect(() => {
        let enableAutomaticallyScrollDown = false;
        let unmounted = false;
        const parentNode = itemsEndRef.current && itemsEndRef.current.parentNode;
        const onScroll = (event: any) => {
            if (unmounted) return;
            const node = event.target;
            const margin = node.scrollHeight - (node.scrollTop + node.clientHeight);
            if (margin < autoScrollThreshold) {
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
    }, [autoScrollThreshold]);

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
            <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={hasMore}
                useWindow={false}
                isReverse
            >
                <StyledList>
                    {items.map(renderItem)}
                </StyledList>
            </InfiniteScroll>
            <div ref={itemsEndRef} />
            {renderNewItemNotification(hasItemNotSeen, ()=>{
                itemsEndRef.current.scrollIntoView({ behavior: "smooth" });
            })}
        </React.Fragment>
    ), [items, loadMore, hasMore, renderItem,hasItemNotSeen,renderNewItemNotification]);
}


export default ScrollableContainer;