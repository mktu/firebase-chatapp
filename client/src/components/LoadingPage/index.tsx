import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';


const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

type Props = {
    message?: string
}

const LoadingPage: React.FC<Props> = ({ message }) => {
    return (
        <Wrapper>
            <div>
                <CircularProgress />
                {message && message}
            </div>

        </Wrapper>
    )
};

export default LoadingPage;