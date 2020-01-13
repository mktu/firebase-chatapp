import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useJoinChatRoomState } from '../../hooks/useChatRoomState';

type Props = {
    roomId: string,
    className?: string,
};
const Paper = styled(PaperBase)`
    width : 50%;
    padding : 1rem;
`

const MenuWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
    justify-content : flex-end;
`;

const MessageBox = styled.div`

`;

const InputBox = styled.div`

`;

const JoinRequest: React.FC<Props> = ({ className, roomId }) => {
    const {
        room,
        request } = useJoinChatRoomState(roomId);
    if (!request) {
        return (
            <Paper className={className} >
                {room && (
                    <React.Fragment>
                        <Typography>{`Request to join the ${room.roomName} room ?`}</Typography>
                    </React.Fragment>
                )}

            </Paper >
        )
    }
    return (
        <Paper className={className} >
            {room && (
                <React.Fragment>
                    <Typography>{`You are requesting to join ${room.roomName} room`}</Typography>
                    <MenuWrapper>

                    </MenuWrapper>
                    <MessageBox>

                    </MessageBox>
                    <InputBox>

                    </InputBox>
                </React.Fragment>
            )}

        </Paper >
    )
};

export default JoinRequest;