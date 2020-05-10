import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position : absolute;
    display : flex;
    align-items : flex-end;
    &>.reactions{
        display : flex;
        align-items : flex-end;
        margin-left : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
    ${({ bottom, left }: Pos) => `
        bottom : ${bottom}px;
        left : ${left}px;
    `}
`;

type Pos = {
    bottom: number,
    left: number
}

type PropsType = {
    bottom : number,
    left : number,
    showEditActions : boolean,
    renderEditActions : (style?:string)=>void,
    renderEmojiReactions : (style?:string)=>void
}

const Presenter : React.FC<PropsType> = ({
    bottom,
    left,
    showEditActions,
    renderEditActions,
    renderEmojiReactions
})=>{
    return (
        <Wrapper bottom={bottom} left={left}>
            {renderEmojiReactions('reactions')}
            {showEditActions && renderEditActions()}
        </Wrapper>
    )
}

export default Presenter;