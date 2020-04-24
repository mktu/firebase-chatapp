import React, { useState, useMemo, useEffect, useRef } from 'react';
import {ScrollState} from './types';
import {domutil} from '../../utils'

function ScrollableContainer<T>({
    items,
    loadMore,
    hasOlderItems,
    hasNewerItems,
    children,
    autoScrollThreshold = 100,
    nextScrollThreshold = 250,
}: {
    items: T[],
    children: React.ReactElement,
    loadMore: (toNewer?: boolean) => void,
    hasOlderItems: boolean,
    hasNewerItems?: boolean,
    autoScrollThreshold?: number,
    nextScrollThreshold?: number
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState<ScrollState>();

    useEffect(() => {
        let nextLoad: 'newer' | 'none' | 'older' = 'none';
        let unmounted = false;
        const parentNode = ref.current && domutil.getScrollableParent(ref.current);
        const onScroll = (event: Event) => {
            if (unmounted) return;
            const node = event.target as HTMLElement;
            const marginBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
            const marginTop = node.scrollTop;
            if (marginTop < nextScrollThreshold && nextLoad !== 'older' && hasOlderItems && !loading) {
                nextLoad = 'older';
                parentNode && setLoading({
                    direction: nextLoad,
                    snapshot: {
                        scrollHeight: parentNode.scrollHeight,
                        scrollTop: parentNode.scrollTop
                    }
                });
                loadMore(false);
            }
            else if (marginBottom < nextScrollThreshold && nextLoad !== 'newer' && hasNewerItems && !loading) {
                nextLoad = 'newer';
                parentNode && setLoading({
                    direction: nextLoad,
                    snapshot: {
                        scrollHeight: parentNode.scrollHeight,
                        scrollTop: parentNode.scrollTop
                    }
                });
                loadMore(true);
            }
        };
        parentNode && parentNode.addEventListener('scroll', onScroll);
        return () => {
            unmounted = true;
            parentNode && parentNode.removeEventListener('scroll', onScroll);
        }
    }, [autoScrollThreshold, hasOlderItems, loading, loadMore, setLoading, nextScrollThreshold, hasNewerItems]);


    useEffect(() => {
        const parentNode = ref.current && domutil.getScrollableParent(ref.current);
        if (parentNode && loading) {
            const { snapshot, direction } = loading;
            if (parentNode.scrollHeight !== snapshot.scrollHeight) {
                if (direction === 'older') {
                    parentNode.scrollTop = parentNode.scrollHeight -
                        snapshot.scrollHeight + snapshot.scrollTop;
                }
                setLoading(undefined);
            }
        }
    }, [items.length, loading])

    return useMemo(() => (
        <div ref={ref}>
            {children}
        </div>
    ), [children]);
}


export default ScrollableContainer;