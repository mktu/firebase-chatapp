import React, { useState, useMemo, useEffect, useRef } from 'react';
import Scroller from 'react-simple-infinite-scroller';
import { Props } from '../types';
import { domutil } from '../../../utils'

export type Classes = 'root' | 'list-item' | 'focus-item' | 'notification';
type ScrollDownType = 'jumpable-to-top' | 'disable';

type PropsType<T> = {
    items: T[],
    children: (item: T) => React.ReactElement,
    uniqueKey : keyof T,
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

function makeScrollableListWithRef <T>() {
    return React.forwardRef<HTMLElement, PropsType<T>>(
        ({
            items,
            children,
            className,
            uniqueKey,
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
            const List = listComponent;
            const ListItemComponent = listItemComponent;
            const NotificationComponent = notificationComponent;
            const [automaticallyScroll, setAutomaticallyScroll] = useState<ScrollDownType>('disable');
            const newItemNavigatable = items.length > 0 && trackingId !== items[0][uniqueKey] && automaticallyScroll === 'jumpable-to-top';

            useEffect(() => {
                let enableAutomaticallyScrollDown = false;
                let unmounted = false;
                const parentNode = itemsEndRef.current && domutil.getScrollableParent(itemsEndRef.current);
                const onScroll = (event: Event) => {
                    if (unmounted) return;
                    const node = event.target as HTMLElement;
                    if (autoScrollThreshold < node.scrollTop && !hasNewerItems) {
                        if (enableAutomaticallyScrollDown) {
                            setAutomaticallyScroll('jumpable-to-top');
                        }
                        enableAutomaticallyScrollDown = true;
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
                else if (trackingId !== items[0][uniqueKey]) {
                    setTrackingId(items[0][uniqueKey]!);
                }
            }, [items, trackingId, uniqueKey]);

            const rootClass = className || classes['root'];
            const listItemClass = classes['list-item'];
            const focusItemClass = classes['focus-item'];
            const notificationClass = classes['notification'];

            return useMemo(() => (
                <React.Fragment>
                    <div ref={itemsEndRef} />
                    <List className={rootClass} ref={ref}>
                        {items.map(item => ListItemComponent ? (
                            <ListItemComponent className={focusItemId === item[uniqueKey] ? `${listItemClass} ${focusItemClass}` : listItemClass} key={item[uniqueKey]} ref={focusItemId === item[uniqueKey] ? focusItemRef : undefined}>
                                {children(item)}
                            </ListItemComponent>
                        ) : children(item))}
                    </List>
                    {NotificationComponent && (
                        <NotificationComponent className={notificationClass} show={newItemNavigatable} onClick={() => {
                            itemsEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        }} />
                    )}
                </React.Fragment>
            ), [rootClass, listItemClass, notificationClass, focusItemClass, items, children, newItemNavigatable, NotificationComponent, focusItemId, ListItemComponent, ref, uniqueKey]);
        }
    );
};

function ScrollableContainer<T>({
    items,
    loadMore,
    hasOlderItems,
    uniqueKey,
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
            canScrollUp={hasNewerItems}
            canScrollDown={hasOlderItems}
            nextScrollThreshold={nextScrollThreshold}
        >
            <ScrollableList
                items={items}
                uniqueKey={uniqueKey}
                className={className}
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