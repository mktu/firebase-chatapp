import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height : 100%;
    & > .room-header{
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    & > .room-messages {
        height : 100%;
        width : 100%;
        padding : 2px;
        box-sizing: border-box;
        overflow : scroll;
        border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
        border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    }
    & > .room-input{
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
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