import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';


const Wrapper = styled.div`
    width : 100%;
    display : flex;
    align-items : center;
    justify-content : space-between;
    box-sizing: border-box;

    & > .refinements-text{

    }
    & > .refinements-searchbox{
        display : flex;
        align-items: center;
    }
`
function Presenter({
    className,
    renderSearchBox,
}: {
    className?: string
    renderSearchBox: (className?: string) => React.ReactNode,
}) {
    return (
        <Wrapper className={className}>
            <Typography className='refinements-text' variant='h5'>Search Result</Typography>
            {renderSearchBox('search-box')}
        </Wrapper>
    )
}


export default Presenter;