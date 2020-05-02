import React, { useState, useMemo, useEffect, useRef } from 'react';
import Scroller from '../InfiniteScroller';
import { Props } from '../types';
import { domutil } from '../../../utils'

export type ScrollDownType = 'jumpable-to-bottom' | 'automatically-scroll-down' | 'disable';
export type Classes = 'root' | 'list-item' | 'focus-item' | 'notification';

type ListProps<T> = {
    items: T[],
    uniqueKey : keyof T,
    children: (item: T) => React.ReactElement,
    hasNewerItems?: boolean,
    focusItemId?: T[keyof T],
    listComponent?: any,
    listItemComponent?: any,
    notificationComponent?: any,
    autoScrollThreshold?: number,
    className?: string,
    classes?: {
        [key in Classes]?: string
    }
    renderNewItemNotification?: (show: boolean, onClickScrollToBottom: () => void) => React.ReactElement
}

const style = {
    'display':'flex',
    'flexDirection' : 'column-reverse'
}

function makeScrollableListWithRef<T>(){
    return React.forwardRef<HTMLElement, ListProps<T>>(
        ({
            items,
            children,
            uniqueKey,
            className,
            focusItemId,
            hasNewerItems,
            notificationComponent,
            listComponent = 'div',
            listItemComponent,
            autoScrollThreshold = 100,
            classes = {},
        }, ref) => {
            const itemsEndRef = useRef<HTMLDivElement | null>(null);
            const focusItemRef = useRef<HTMLElement | null>(null);
            const [trackingId, setTrackingId] = useState<T[keyof T]>();
            
            const hasItem = items.length > 0;
            const List = listComponent;
            const ListItemComponent = listItemComponent;
            const NotificationComponent = notificationComponent;
            const [automaticallyScrollDown, setAutomaticallyScrollDown] = useState<ScrollDownType>('disable');
            const newItemNavigatable = items.length > 0 && trackingId !== items[0][uniqueKey] && automaticallyScrollDown === 'jumpable-to-bottom';
            
            useEffect(() => {
                let enableAutomaticallyScrollDown = false;
                let unmounted = false;
                const parentNode = itemsEndRef.current && domutil.getScrollableParent(itemsEndRef.current);
                const onScroll = (event: Event) => {
                    if (unmounted) return;
                    const node = event.target as HTMLElement;
                    const marginBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
                    // automatically scrolling down will be enabled after the most recent item has loaded
                    if (marginBottom < autoScrollThreshold && !hasNewerItems) {
                        if (!enableAutomaticallyScrollDown) {
                            setAutomaticallyScrollDown('automatically-scroll-down');
                        }
                        enableAutomaticallyScrollDown = true;
                    } else {
                        if (enableAutomaticallyScrollDown) { // once reach to the bottom, the scroll position can return to the bottom again
                            setAutomaticallyScrollDown('jumpable-to-bottom');
                        }
                        enableAutomaticallyScrollDown = false;
                    }
                };
                parentNode && parentNode.addEventListener('scroll', onScroll);
                return () => {
                    unmounted = true;
                    parentNode && parentNode.removeEventListener('scroll', onScroll);
                }
            }, [autoScrollThreshold, hasNewerItems]);
        
            useEffect(() => {
                if (items.length === 0) return;
                if (!trackingId) {
                    const parentNode = itemsEndRef.current && domutil.getScrollableParent(itemsEndRef.current);
                    const element = focusItemRef.current || itemsEndRef.current;
                    const scrollHeight = parentNode?.scrollHeight || 0;
                    const clientHeight = parentNode?.clientHeight || 0;
                    // scroll begins, start tracking the first item
                    if (element && scrollHeight > clientHeight) {
                        element.scrollIntoView();
                        setTrackingId(items[0][uniqueKey]!);
                    }
                }
                else if (trackingId !== items[0][uniqueKey] && itemsEndRef.current) {
                    if (automaticallyScrollDown === 'automatically-scroll-down') {
                        setTrackingId(items[0][uniqueKey]!);
                        itemsEndRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }, [items, automaticallyScrollDown, trackingId, uniqueKey]);
        
            useEffect(() => {
                hasItem && focusItemRef.current && focusItemRef.current.focus();
            }, [hasItem]);
        
            const rootClass = className || classes['root'];
            const listItemClass = classes['list-item'];
            const focusItemClass = classes['focus-item'];
            const notificationClass = classes['notification'];
        
            return useMemo(() => (
                <React.Fragment>
                    <List className={rootClass} style={style} ref={ref}>
                        {items.map(item => ListItemComponent ? (
                            <ListItemComponent className={focusItemId === item[uniqueKey] ? `${listItemClass} ${focusItemClass}` : listItemClass} key={item[uniqueKey]} ref={focusItemId === item[uniqueKey] ? focusItemRef : undefined}>
                                {children(item)}
                            </ListItemComponent>
                        ) : children(item))}
                    </List>
                    <div ref={itemsEndRef} />
                    {NotificationComponent && (
                        <NotificationComponent className={notificationClass} show={newItemNavigatable} onClick={() => {
                            itemsEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        }} />
                    )}
                </React.Fragment>
            ), [rootClass, listItemClass, notificationClass, focusItemClass, items, children, newItemNavigatable, NotificationComponent, focusItemId, ListItemComponent,uniqueKey,ref]);
        }
    );
};

function ScrollableContainer<T>({
    items,
    loadMore,
    uniqueKey,
    hasOlderItems,
    children,
    className,
    focusItemId,
    hasNewerItems,
    notificationComponent,
    autoScrollThreshold = 100,
    nextScrollThreshold = 250,
    listComponent = 'div',
    listItemComponent,
    classes = {},
}: Props<T>) {
    const ScrollableList = useMemo(()=>makeScrollableListWithRef<T>(),[]);
    return (
        <Scroller
            loadMore={loadMore}
            canScrollUp={hasOlderItems}
            canScrollDown={hasNewerItems}
            nextScrollThreshold={nextScrollThreshold}
        >
            <ScrollableList
                items={items}
                className={className}
                uniqueKey={uniqueKey}
                focusItemId={focusItemId}
                notificationComponent={notificationComponent}
                autoScrollThreshold={autoScrollThreshold}
                listComponent={listComponent}
                hasNewerItems={hasNewerItems}
                listItemComponent={listItemComponent}
                classes={classes}
            >
                {children}
            </ScrollableList>
        </Scroller>
    )
}


export default ScrollableContainer;