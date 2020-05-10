import React from 'react';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';

const Wrapper = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const User: React.FC<{
    children: React.ReactElement | string,
    className?: string
}> = ({
    children,
    className
}) => (<Wrapper className={className}>
    <Avatar>
        {children}
    </Avatar>
</Wrapper>);

export default User;