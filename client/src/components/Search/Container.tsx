import React from 'react';
import algoliasearch from 'algoliasearch';
import { InstantSearch } from 'react-instantsearch-dom';
import { useHistory } from "react-router-dom";
import SearchBox from './SearchBox';
import Hits from './Hits';

const searchClient = process.env.REACT_APP_ALGOLIA_APP_ID && process.env.REACT_APP_ALGOLIA_API_KEY &&
    algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);


const Container: React.FC<{
    keyword? : string
}> = ({
    keyword
}) => {
    const history = useHistory();
    return (<InstantSearch searchClient={searchClient} indexName='messages'>
        <div>
            <SearchBox keyword={keyword}/>
            <Hits onSelect={(roomId,messageId)=>{
                history.push(`/rooms/${roomId}?message=${messageId}`);
            }}/>
        </div>
    </InstantSearch>)
}

export default Container;