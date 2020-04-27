import React, { useEffect } from 'react';
import styled from 'styled-components';
import { SearchBoxProvided } from 'react-instantsearch-core';
import InputBase from '@material-ui/core/InputBase';

const Wrapper = styled.div`
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    padding : ${({ theme }) => `${theme.spacing(0.5)}px ${theme.spacing(1)}px`};
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
            <InputBase value={currentRefinement} onChange={(e)=>{
                refine(e.target.value);
            }}/>
        </Wrapper>
    )
};

export default SearchBox;