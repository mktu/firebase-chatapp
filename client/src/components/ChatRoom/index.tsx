import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../types/room';
import useChatRoomState from '../../hooks/useChatRoomState';
import JoinRequest from './JoinRequest';

type Props = {
    room: Room,
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
export {JoinRequest};
export default ({ className, room }: Props) => {
    const hasRoom = Boolean(room);
    const {
        requests,
        handleAcceptRequest,
        handleRejectRequest} = useChatRoomState({room});
    return (
        <Paper  className={className} >
            {hasRoom && (
                <React.Fragment>
                    <Typography>{room!.roomName}</Typography>
                    <MenuWrapper>

                    </MenuWrapper>
                    <MessageBox>

                    </MessageBox>
                    <InputBox>

                    </InputBox>
                </React.Fragment>
            )}
        </Paper>
    )
};