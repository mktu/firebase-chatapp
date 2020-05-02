export type Classes = 'root' | 'list-item' | 'focus-item' | 'notification';
export type Props<T> = {
    items: T[],
    children: (item: T) => React.ReactElement,
    uniqueKey: keyof T,
    loadMore: (toNewer?: boolean) => void,
    hasOlderItems: boolean,
    hasNewerItems: boolean,
    focusItemId?: T[keyof T],
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