import React, { useState, useMemo, useEffect, useRef } from 'react';
import { domutil } from '../../utils'

type ScrollDirection = 'down' | 'none' | 'up';

type ScrollState = {
    direction: ScrollDirection,
    snapshot: {
        scrollTop: number,
        scrollHeight: number
    }
}

type Children<T extends HTMLElement> = React.ReactElement & {
    ref?: React.Ref<T>;
}

function ScrollableContainer<T extends HTMLElement>({
    loadMore,
    canScrollUp,
    canScrollDown,
    children,
    nextScrollThreshold = 250,
}: {
    children: Children<T>
    loadMore: (toNewer?: boolean) => void,
    canScrollUp: boolean,
    canScrollDown?: boolean,
    nextScrollThreshold?: number
}) {
    const rootRef = useRef<T | null>(null);
    const [loading, setLoading] = useState<ScrollState>();
    useEffect(() => {
        let nextLoad: ScrollDirection = 'none';
        let unmounted = false;
        const parentNode = rootRef.current && domutil.getScrollableParent(rootRef.current);
        const onScroll = (event: Event) => {
            if (unmounted) return;
            const node = event.target as T;
            const marginBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
            const marginTop = node.scrollTop;
            if (marginTop < nextScrollThreshold && nextLoad !== 'up' && canScrollUp && !loading) {
                nextLoad = 'up';
                parentNode && setLoading({
                    direction: nextLoad,
                    snapshot: {
                        scrollHeight: parentNode.scrollHeight,
                        scrollTop: parentNode.scrollTop
                    }
                });
                loadMore(false);
            }
            else if (marginBottom < nextScrollThreshold && nextLoad !== 'down' && canScrollDown && !loading) {
                nextLoad = 'down';
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
    }, [canScrollUp, loading, loadMore, setLoading, nextScrollThreshold, canScrollDown]);


    useEffect(() => {
        const parentNode = rootRef.current && domutil.getScrollableParent(rootRef.current);
        if (parentNode && loading) {
            const { snapshot, direction } = loading;
            if (parentNode.scrollHeight !== snapshot.scrollHeight) {
                if (direction === 'up') {
                    parentNode.scrollTop = parentNode.scrollHeight -
                        snapshot.scrollHeight + snapshot.scrollTop;
                }
                setLoading(undefined);
            }
        }
    }, [children, loading])

    // ScrollHeight may not exceed clientHeight when focusing on old items.
    // In this case, scrolling cannot be performed and newer items cannot be read.
    // So the next new item needs to be loaded programmatically.
    useEffect(() => {
        const parentNode = rootRef.current && domutil.getScrollableParent(rootRef.current);
        const scrollHeight = parentNode?.scrollHeight || 0;
        const clientHeight = parentNode?.clientHeight || 0;
        const scrollTop = parentNode?.scrollTop || 0;
        if (scrollHeight === clientHeight &&
            canScrollDown && 
            scrollTop === 0) {
                console.log('load more first')
                loadMore(true);
        }
    }, [loadMore, canScrollDown, children])

    return useMemo(() => {
        const childProps = {
            ...children.props,
            ref: (value: T) => {
                if (children.ref) {
                    if (typeof children.ref === 'function') {
                        children.ref(value);
                    }
                    else {
                        const refObject = children.ref as React.MutableRefObject<T>
                        refObject.current = value;
                    }
                }
                rootRef.current = value;
            }
        }
        return React.cloneElement(children, childProps);
    }, [children]);
}


export default ScrollableContainer;