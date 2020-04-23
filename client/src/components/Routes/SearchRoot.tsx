import React from 'react';
import { Route, useLocation } from "react-router-dom";
import Search from '../Search';

const SearchRoot: React.FC<any> = (props) => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const keyword = urlParams.get('keyword') || undefined;
    return (
        <Route {...props}>
            <Search keyword={keyword}/>
        </Route>
    )
};

export default SearchRoot;