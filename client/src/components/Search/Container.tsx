import React from 'react';
import algoliasearch from 'algoliasearch';
import { connectInfiniteHits, connectSearchBox } from 'react-instantsearch-dom';
import { InstantSearch } from 'react-instantsearch-dom';
import { useHistory } from "react-router-dom";
import SearchBoxContainer from './SearchBox';
import HitsContainer from './Hits';
import Presenter from './Presenter';
import Refinements from './Refinements';

const searchClient = process.env.REACT_APP_ALGOLIA_APP_ID && process.env.REACT_APP_ALGOLIA_API_KEY &&
    algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);

const SearchBox = connectSearchBox(SearchBoxContainer);
const Hits = connectInfiniteHits(HitsContainer);

const Container: React.FC<{
    keyword?: string,
    className?: string
}> = ({
    keyword,
    className
}) => {
        const history = useHistory();
        return (<InstantSearch searchClient={searchClient} indexName='messages'>
            <Presenter
                className={className}
                renderRefinements={(style) => (
                    <Refinements
                        className={style}
                        renderSearchBox={(style) => (
                            <SearchBox className={style} keyword={keyword} />
                        )}
                    />
                )}
                renderHits={(style) => (
                    <Hits
                        className={style}
                        onSelect={(roomId, messageId) => {
                            history.push(`/rooms/${roomId}?message=${messageId}`);
                        }} />
                )}
            />
        </InstantSearch>)
    }

export default Container;