import React from 'react';
import styled from 'styled-components';
import { Spin1s200pxIcon } from '../Icons';

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
                <Spin1s200pxIcon width='100'/>
                <div>{message && message}</div>
            </div>

        </Wrapper>
    )
};

export default LoadingPage;