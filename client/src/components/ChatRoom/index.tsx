import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Room } from '../../types/room';
import useRoomOwnerState from '../../hooks/useRoomOwnerState';
import RequestRoom from '../RequestRoom';

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

const RequestsWrapper = styled(List)`

`;

const Request = styled(ListItem)`
`;

const InputBox = styled.div`

`;
export { RequestRoom as JoinRequest };
export default ({ className, room }: Props) => {
    const hasRoom = Boolean(room);
    const {
        requests,
        handleAcceptRequest,
        handleRejectRequest } = useRoomOwnerState({ room });
    return (
        <Paper className={className} >
            {hasRoom && (
                <React.Fragment>
                    <Typography>{room!.roomName}</Typography>

                    <MenuWrapper>

                    </MenuWrapper>
                    <RequestsWrapper>
                        {requests.map(req => {
                            return (
                                <ListItem id={req.id} >
                                    <ListItemText>{req.nickName}</ListItemText>
                                    <ListItemSecondaryAction>
                                        <Button color='secondary' onClick={() => {
                                            handleAcceptRequest(req);
                                        }}>ACCEPT</Button>
                                        <Button color='secondary' onClick={() => {
                                            handleRejectRequest(req);
                                        }}>REFUSE</Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </RequestsWrapper>
                    <InputBox>

                    </InputBox>
                </React.Fragment>
            )}
        </Paper>
    )
};