export type Classes = 'root' | 'list-item' | 'focus-item' | 'notification';
export type Props<T> = {
    items: T[],
    children: (item: T) => React.ReactElement,
    loadMore: (toNewer?: boolean) => void,
    hasOlderItems: boolean,
    hasNewerItems: boolean,
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
}