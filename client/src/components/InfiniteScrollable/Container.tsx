import React from 'react';
import InfiniteScroller from './InfiniteScroller';
import ScrollableList from './ScrollableList';

export type Classes = 'root' | 'list-item' | 'focus-item' | 'notification';

function ScrollableContainer<T extends { id: string }>({
    items,
    loadMore,
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
}: {
    items: T[],
    children: (item: T) => React.ReactElement,
    loadMore: (toNewer?: boolean) => void,
    hasOlderItems: boolean,
    hasNewerItems?: boolean,
    focusItemId?: string,
    autoScrollThreshold?: number,
    nextScrollThreshold?: number
    listComponent?: any,
    listItemComponent?: any,
    notificationComponent?: any,
    className?: string,
    classes?: {
        [key in Classes]?: string
    }
    renderNewItemNotification?: (show: boolean, onClickScrollToBottom: () => void) => React.ReactElement
}) {
    return (
        <InfiniteScroller
            items={items}
            loadMore={loadMore}
            hasOlderItems={hasOlderItems}
            hasNewerItems={hasNewerItems}
            autoScrollThreshold={autoScrollThreshold}
            nextScrollThreshold={nextScrollThreshold}
        >
            <ScrollableList
                items={items}
                loadMore={loadMore}
                className={className}
                focusItemId={focusItemId}
                notificationComponent={notificationComponent}
                listComponent={listComponent}
                hasNewerItems={hasNewerItems}
                listItemComponent={listItemComponent}
                classes={classes}
            >
                {children}
            </ScrollableList>
        </InfiniteScroller>
    )
}


export default ScrollableContainer;