import React, { useState } from 'react';
import styled from 'styled-components';
import InfiniteScrollable, { NewItemNotification } from '../components/InfiniteScrollable';

type ItemType = { id: string };

const MAX_PAGE_SIZE = 10;
const ITEM_MAX_IN_PAGE = 20;
const FULL_ITEMS = [...Array(ITEM_MAX_IN_PAGE * MAX_PAGE_SIZE).keys()].map(i => ({ id: i.toString() }));

export default {
    title: 'InfiniteScrollable',
};

const Wrapper = styled.div`
    & > .loader{
        height : 60vh;
        overflow : auto;
        padding : 0 1rem 0 1rem;
        border-radius : 5px;
        border : 1px solid gray;
    }
    & > .loader > .notification{
        position : absolute;
        left: 0;
        right: 0;
        margin: auto;
    }
    position : relative;
`;

const DummyLoader: React.FC<{
    children: (
        hasMore: boolean,
        readMore: () => void,
        items: ItemType[]
    ) => React.ReactElement,
    latest?: ItemType[]
}> = ({
    children,
    latest = []
}) => {
        const [page, setPage] = useState(0);
        const hasMore = page < MAX_PAGE_SIZE;
        const loadMore = () => {
            if (hasMore) {
                setTimeout(() => {
                    setPage(i => i + 1);
                }, 500);
            }
        }
        const items = [...latest, ...FULL_ITEMS.slice(0, MAX_PAGE_SIZE * page)];
        return children(
            hasMore,
            loadMore,
            items
        );
    }

export const Default = () => {
    const [count, setCount] = useState(0);
    const latest = [...Array(count).keys()].map(i => ({ id: (-1 * (i + 1)).toString() })).reverse();
    return (
        <Wrapper>
            <div className='loader'>
                <DummyLoader latest={latest}>
                    {
                        (hasMore, loadMore, items) => (
                            <InfiniteScrollable
                                classes={{
                                    'notification': 'notification'
                                }}
                                items={items}
                                hasOlderItems={hasMore}
                                loadMore={loadMore}
                                notificationComponent={NewItemNotification}
                            >
                                {(item) => {
                                    return <div key={item.id}>{item.id}</div>
                                }}
                            </InfiniteScrollable>
                        )
                    }
                </DummyLoader>
            </div>
            <div>
                <button onClick={() => {
                    setCount(i => i + 1);
                }}>add</button>
            </div>
        </Wrapper>
    )
}