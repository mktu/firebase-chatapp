import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';
import Hits from '../../components/Search/Hits';
import SearchBox from '../../components/Search/SearchBox';
import { Presenter, Refinements } from '../../components/Search'
import { Message } from '../../../../types/message';

const MAX_PAGE_SIZE = 10;
const ITEM_MAX_IN_PAGE = 20;
const FULL_ITEMS: Message[] = [...Array(ITEM_MAX_IN_PAGE * MAX_PAGE_SIZE).keys()].map(i => ({
    roomId: 'room',
    id: i.toString(),
    date: Date.now() + i,
    message: `this is ${i}`,
    senderId: 'test1',
    senderName: 'test1',
    roomName: 'room'
}));

const Container = ({
    items = FULL_ITEMS
}: {
    items?: Message[]
}) => {

    const [loaded, setLoaded] = useState<Message[]>([]);
    useEffect(() => {
        setLoaded(items.slice(0, MAX_PAGE_SIZE));
    }, [])

    return (
        <Presenter
            renderRefinements={() => (
                <Refinements
                    renderSearchBox={(className) => (
                        <SearchBox className={className}
                            refine={action('refine')}
                            currentRefinement={'test'}
                            isSearchStalled={false}
                        />
                    )} />
            )}
            renderHits={(className) => (
                <Hits
                    className={className}
                    hits={loaded}
                    hasMore={loaded.length < items.length}
                    hasPrevious={false}
                    onSelect={action('onSelect')}
                    refineNext={() => {
                        setTimeout(() => {
                            setLoaded(prev => {
                                const next = prev.length + MAX_PAGE_SIZE;
                                return items.slice(0, next);
                            })
                        }, 500);
                    }}
                    refinePrevious={action('previous')}
                />
            )}
        />
    )
}

export default {
    title: 'Search/Container',
};

export const Default = () => <Container />;
