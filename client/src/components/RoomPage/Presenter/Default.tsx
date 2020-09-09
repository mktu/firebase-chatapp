import React, {useContext} from 'react';
import styled from 'styled-components';
import CustomTheme, { ThemeType } from '../ThemeContext';
import { Spin1s200pxIcon } from '../../Icons';

type WrapperProps = {
    customtheme: ThemeType,
    theme: any
}

const Wrapper = styled.div`
    height : 100%;
    display : flex;
    box-sizing: border-box;
    
    & > .room-list{
        width : 20%;
        margin-right : 1rem;
        box-sizing: border-box;
        height : 100%;
        background-color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.main}`};
        color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.text}`};
    }

    & > .sidebar{
        width : 75px;
        box-sizing: border-box;
        height : 100%;
        background-color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.dark}`};
        color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.text}`};
    }
`;

const Chatroom = styled.div`
    box-sizing: border-box;
    padding : 5px;
    height : ${({ open }: { open: boolean }) => open ? `100%` : `0`};
    width : ${({ open }: { open: boolean }) => open ? `70%` : `0`};
    ${({ open,roomPage }: { open: boolean, roomPage : boolean }) => open && roomPage && `
        transition: all 0.3s ease-out;
    `};
    > .non-room{
        width : 100%;
        height : 100%;
        display : flex;
        align-items : center;
        justify-content : center;
    }
`;

export type Props = {
    roomList: React.ReactElement,
    sidebar: React.ReactElement,
    chatrooms: React.ReactElement,
    roomHome?: React.ReactElement,
    request?: React.ReactElement,
    loading: boolean,
    showRoom: boolean,
    error ?: string
};

const Presenter: React.FC<Props> = ({
    roomList,
    sidebar,
    chatrooms,
    loading,
    showRoom,
    roomHome,
    error,
    request
}) => {
    const customtheme = useContext(CustomTheme);
    return (
        <Wrapper customtheme={customtheme}>
            <div className='sidebar'>
                {sidebar}
            </div>
            <div className='room-list'>
                {roomList}
            </div>
            <Chatroom open={showRoom} roomPage={true}>
                {chatrooms}
            </Chatroom>
            <Chatroom open={!showRoom} roomPage={false}>
                {loading && (
                    <div className='non-room'>
                        <Spin1s200pxIcon width='100px' height='100px' />
                    </div>
                )}
                {error && (
                    <div>{error}</div>
                )}
                {request && (
                    <div className='non-room'>{request}</div>
                )}
                {roomHome && (
                    <div className='non-room'>{roomHome}</div>
                )}
            </Chatroom>
        </Wrapper>
    )
};

export default Presenter;