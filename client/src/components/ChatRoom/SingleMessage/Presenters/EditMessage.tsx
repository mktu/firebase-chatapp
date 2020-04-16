import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
    width : 100%;
`;

type PropsType = {
    className?: string,
    children: React.ReactElement
}

const EditMessage = React.forwardRef<HTMLDivElement,PropsType>(({
    className,
    children
}, ref) => {
    return (
        <Wrapper className={className} ref={ref}>
            {children}
        </Wrapper>)
});

export default EditMessage;