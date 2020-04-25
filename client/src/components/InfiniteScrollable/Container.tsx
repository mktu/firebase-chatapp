import React, {useMemo} from 'react';
import InfiniteScroller from './InfiniteScroller';
import makeScrollableListWithRef from './ScrollableList';

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
    const ScrollableList = useMemo(()=>makeScrollableListWithRef<T>(),[]);
    return (
        <InfiniteScroller
            loadMore={loadMore}
            canScrollUp={hasOlderItems}
            canScrollDown={hasNewerItems}
            nextScrollThreshold={nextScrollThreshold}
        >
            <ScrollableList
                items={items}
                loadMore={loadMore}
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
        </InfiniteScroller>
    )
}


export default ScrollableContainer;