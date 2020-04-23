import React, { useEffect } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided } from 'react-instantsearch-core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

type PropsType = {
    keyword? : string
} & SearchBoxProvided;

const SearchBox: React.FC<PropsType> = ({
    refine,
    currentRefinement,
    keyword
}) => {
    useEffect(()=>{
        keyword && refine(keyword);
    },[keyword,refine])
    return (
        <Paper>
            <InputBase value={currentRefinement} onChange={(e)=>{
                refine(e.target.value);
            }}/>
        </Paper>
    )
};

export default connectSearchBox(SearchBox);