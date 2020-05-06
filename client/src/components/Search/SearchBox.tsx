import React, { useEffect } from 'react';
import styled from 'styled-components';
import { SearchBoxProvided } from 'react-instantsearch-core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const Wrapper = styled.div`
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    padding : ${({ theme }) => `${theme.spacing(0.5)}px ${theme.spacing(1)}px`};
    background-color : white;
    & > .search-icon-button{
        padding : ${({ theme }) => `${theme.spacing(0.1)}px`};
    }
`;

type PropsType = {
    keyword? : string,
    className? : string
} & SearchBoxProvided;

const SearchBox: React.FC<PropsType> = ({
    refine,
    currentRefinement,
    keyword,
    className
}) => {
    useEffect(()=>{
        keyword && refine(keyword);
    },[keyword,refine])
    return (
        <Wrapper className={className}>
            <InputBase placeholder='Search messages' fullWidth value={currentRefinement} onChange={(e)=>{
                refine(e.target.value);
            }}/>
            <IconButton className='search-icon-button' onClick={()=>{
                refine('');
            }}>
                <ClearIcon />
            </IconButton>
        </Wrapper>
    )
};

export default SearchBox;