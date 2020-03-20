import React from 'react';
import styled from 'styled-components';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import Header from './Header';
import Messages from './Messages';
import Input from './Input';
import { RequestsLoader } from '../Loaders';

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

const ChatRoom: React.FC<{
    room: Room,
    profiles: Profile[],
    className?: string,
}> = ({
    className,
    profiles,
    room
}) => {
        return (
            <Wrapper className={className} >
                <RequestsLoader roomId={room.id}>
                    {(requests) => (
                        <Header requests={requests} room={room} profiles={profiles} />
                    )}
                </RequestsLoader>

                <Messages className='room-messages' roomId={room.id} profiles={profiles} />
                <Input
                    className='room-input'
                    suggestionCandidates={profiles}
                    roomId={room.id}
                />
            </Wrapper>
        )
    };

export default ChatRoom;