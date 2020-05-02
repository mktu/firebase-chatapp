import React from 'react';
import algoliasearch from 'algoliasearch';
import { connectInfiniteHits, connectSearchBox, connectHighlight } from 'react-instantsearch-dom';
import { InstantSearch} from 'react-instantsearch-dom';
import { useHistory } from "react-router-dom";
import SearchBoxComponent from './SearchBox';
import HitsComponent from './Hits';
import HighlightComponent from './Highlight';
import Presenter from './Presenter';
import Refinements from './Refinements';

const searchClient = process.env.REACT_APP_ALGOLIA_APP_ID && process.env.REACT_APP_ALGOLIA_API_KEY &&
    algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);

const SearchBox = connectSearchBox(SearchBoxComponent);
const Hits = connectInfiniteHits(HitsComponent);
const HighlightHit = connectHighlight(HighlightComponent);

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
                        highlight={(hit, attribute) => (
                            <HighlightHit
                                hit={hit}
                                attribute={attribute}
                            />
                        )}
                        onSelect={(roomId, messageId) => {
                            history.push(`/rooms/${roomId}?message=${messageId}`);
                        }}
                    />
                )}
            />
        </InstantSearch>)
    }

export default Container;