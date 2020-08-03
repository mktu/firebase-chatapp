import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';

type Props = {
    children: React.ReactElement
};

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
`;

const Paper = styled(PaperBase)`
    padding : 1rem;
`;

const Container: React.FC<Props> = ({ children }) => {
    return (
        <Wrapper >
            <Paper>
                {children}
            </Paper >
        </Wrapper>
    )
};

export default Container;