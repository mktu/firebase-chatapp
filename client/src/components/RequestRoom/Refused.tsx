import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { JoinRequest, RequestStatus } from '../../types/room';

type Props = {
    request: JoinRequest,
    onOk: () => void,
};

const Refused: React.FC<Props> = ({
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

export default Refused;