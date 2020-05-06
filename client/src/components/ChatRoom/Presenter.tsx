import React, {useMemo} from 'react';
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
        max-height :75vh;
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
    const header = useMemo(()=>renderHeader('room-header'),[renderHeader]);
    const messages = useMemo(()=>renderMessages('room-messages'),[renderMessages]);
    const footer = useMemo(()=>renderFooter('room-input'),[renderFooter]);
        return (
            <Wrapper className={className} >
                {header}
                {messages}
                {footer}
            </Wrapper>
        )
    };

export default Presenter;