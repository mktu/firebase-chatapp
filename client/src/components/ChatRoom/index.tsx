import React, {useRef,useEffect} from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import Header from './Header';
import Messages from './Messages';
import Input from './Input';

const Wrapper = styled.div`
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height : 100%;
    & > .room-messages {
        height : 65vh;
        width : 100%;
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
                <Header room={room} profiles={profiles}/>
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