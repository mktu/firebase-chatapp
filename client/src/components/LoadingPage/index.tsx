import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';


const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;


export default () => {
    return (
        <Wrapper>
            <CircularProgress />
        </Wrapper>
    )
};