import React from 'react';
import styled from 'styled-components';
import { Spin1s200pxIcon } from '../Icons';

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
        width : 75%;
        transition: all 0.3s ease-out;

        > .loading{
            width : 100%;
            height : 100%;
            display : flex;
            align-items : center;
            justify-content : center;
        }
    }
`;

const Chatroom = styled.div`
    box-sizing: border-box;
    padding : 5px;
    height : ${({ open }: { open: boolean }) => open ? `100%` : `0`};
    width : ${({ open }: { open: boolean }) => open ? `75%` : `0`};
    ${({ open,roomPage }: { open: boolean, roomPage : boolean }) => open && roomPage && `
        transition: all 0.3s ease-out;
    `};
    

    > .loading{
        width : 100%;
        height : 100%;
        display : flex;
        align-items : center;
        justify-content : center;
    }
`;

type Props = {
    renderRoomList: (className: string) => React.ReactElement,
    chatrooms: React.ReactElement,
    loading: boolean,
    showRoom: boolean,
    error ?: string
};

const Presenter: React.FC<Props> = ({
    renderRoomList,
    chatrooms,
    loading,
    showRoom,
    error
}) => {
    return (
        <Wrapper>
            {renderRoomList('room-list')}
            <Chatroom open={showRoom} roomPage={true}>
                {chatrooms}
            </Chatroom>
            <Chatroom open={!showRoom} roomPage={false}>
                {loading && (
                    <div className='loading'>
                        <Spin1s200pxIcon width='100px' height='100px' />
                    </div>
                )}
                {error && (
                    <div>{error}</div>
                )}
            </Chatroom>
        </Wrapper>
    )
};

export default Presenter;