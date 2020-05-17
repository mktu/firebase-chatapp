import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    height : 100%;
    display : flex;
    box-sizing: border-box;
    & > .room-list{
        width : 20%;
        margin-right : 1rem;
        box-sizing: border-box;
        height : 100%;
    }
    & > .chat-room{
        box-sizing: border-box;
        padding : 5px;
        height : 100%;
        width : ${({ open }: { open: boolean }) => open ? `75%` : `0`};
        transition: all 0.3s ease-out;
    }
`;

type Props = {
    renderRoomList: (className: string) => React.ReactElement,
    chatroom: React.ReactElement,
    loading: boolean,
    open: boolean,
};

const Presenter: React.FC<Props> = ({
    renderRoomList,
    chatroom,
    loading,
    open
}) => {
    if(loading){
        return (
            <Wrapper open={open}>
                loading rooms...
            </Wrapper>
        )
    }
    return (
        <Wrapper open={open}>
            {renderRoomList('room-list')}
            <div className='chat-room'>
                {chatroom}
            </div>
        </Wrapper>
    )
};

export default Presenter;