import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoadingPage from '../LoadingPage';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import useRequestState from '../../hooks/useRequestState';
import { Room, JoinRequest, RequestStatus } from '../../types/room';

type Props = {
    room: Room,
    className?: string,
};

type BodyProps = {
    room?: Room,
    className?: string,
    request?: JoinRequest,
    makeJoinRequest: () => void,
    closeJoinRequest: () => void
}

type RefusedDialogProps = {
    request: JoinRequest,
    onOk: () => void,
};

const Paper = styled(PaperBase)`
    width : 50%;
    padding : 1rem;
`

const RightAlignWrapper = styled.div`
    display : flex;
    justify-content : flex-end;
`;

const Refused: React.FC<RefusedDialogProps> = ({
    request,
    onOk,
}) => {
    return (
        <Dialog
            open={request.status === RequestStatus.Rejected}
        >
            <DialogTitle>{`Request has refuded by owner.`}</DialogTitle>
            <DialogContent>
            Your request will be withdrawn. Please request again if necessary.
            </DialogContent>
            <DialogActions>
                <Button color='secondary' onClick={onOk}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}

const Body: React.FC<BodyProps> = ({
    room,
    request,
    makeJoinRequest,
    closeJoinRequest }) => {

    if (!request && room) {
        return (
            <React.Fragment>
                <Typography>{`Request to join the "${room!.roomName}" room ?`}</Typography>
                <RightAlignWrapper>
                    <Button color='secondary' onClick={makeJoinRequest}>YES</Button>
                </RightAlignWrapper>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <Typography>{`You are requesting to join "${room!.roomName}" room`}</Typography>
            <Refused request={request!}
                onOk={closeJoinRequest}
            />
        </React.Fragment>
    )
}

const Request: React.FC<Props> = ({ className, room }) => {
    const {
        request,
        makeJoinRequest,
        closeJoinRequest
    } = useRequestState(room);
    if(!room){
        return <LoadingPage message='loading room'/>
    }
    return (
        <Paper className={className} >
            <Body room={room} request={request} makeJoinRequest={makeJoinRequest} closeJoinRequest={closeJoinRequest} />
        </Paper >
    )
};

export default Request;