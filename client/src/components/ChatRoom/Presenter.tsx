import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height : 100%;
    & > .room-messages {
        height : 70vh;
        width : 100%;
        padding : 2px;
        overflow : scroll;
        border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
        border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
        margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    & > .room-requests {
        height : 10vh;
    }
`;

const Presenter: React.FC<{
    className?: string,
    renderHeader : (style:string)=>React.ReactElement,
    renderMessages : (style:string)=>React.ReactElement,
    renderFooter : (style:string)=>React.ReactElement
}> = ({
    className,
    renderHeader,
    renderMessages,
    renderFooter
}) => {
        return (
            <Wrapper className={className} >
                {renderHeader('room-header')}
                {renderMessages('room-messages')}
                {renderFooter('room-input')}
            </Wrapper>
        )
    };

export default Presenter;