import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import useVisitorState from '../../hooks/useVisitorState';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const Paper = styled(PaperBase)`
    width : 60%;
    padding : 1rem;
`

const ButtonWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
    justify-content : space-around;
`;

export default () => {
    const {handleAnonymousLogin, handleGoogoleLogin} = useVisitorState();
    return (
        <Wrapper>
            <Paper>
                <Typography>Select login type</Typography>
                <ButtonWrapper>
                    <Button onClick={handleAnonymousLogin} variant='contained' color='secondary'>START WITH ANONYMOUS</Button>
                    <Button onClick={handleGoogoleLogin} variant='contained' color='secondary'>START WITH SIGNUP</Button>
                </ButtonWrapper>
            </Paper>
        </Wrapper>
    )
};