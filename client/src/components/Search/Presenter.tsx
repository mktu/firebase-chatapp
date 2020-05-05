import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    width : 100%;
    height : 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    & > .refinements{
        padding-top : ${({ theme }) => `${theme.spacing(1.5)}px`};
        padding-bottom : ${({ theme }) => `${theme.spacing(1.5)}px`};
        border-bottom :  ${({ theme }) => `1px solid ${theme.palette.divider}`};
    }
    & > .hits{
        max-height :80vh;
    }
`
function Presenter({
    className,
    renderRefinements,
    renderHits
}: {
    className?: string
    renderRefinements: (className?: string) => React.ReactNode,
    renderHits: (className?: string) => React.ReactNode,
}) {
    return (
        <Wrapper className={className}>
            {renderRefinements('refinements')}
            {renderHits('hits')}
        </Wrapper>
    )
}


export default Presenter;