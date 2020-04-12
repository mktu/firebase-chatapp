import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
    width : 100%;
`;


const EditMessage: React.FC<{
    className?: string,
    children :  React.ReactElement
}> = ({
    className,
    children
}) => {
        return (
            <Wrapper className={className}>
                {children}
            </Wrapper>)
    };

export default EditMessage;