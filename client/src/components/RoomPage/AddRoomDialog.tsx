import React, { useState, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import {
    ProfileContext,
    ServiceContext
} from '../../contexts';

type Props = {
    onClose: () => void,
    onSucceed?: (roomId:string)=>void
}

export const AddRoomContainer = ({
    onClose,
    onSucceed
}: Props) => {

    const [newRoomName, setNewRoomName] = useState<string>('');
    const { createRoom } = useContext(ServiceContext);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const { id: profileId } = profile || {};
    const { enqueueSnackbar } = useSnackbar();
    return (
        <React.Fragment>
            <DialogTitle >CREATE NEW ROOM</DialogTitle>
            <DialogContent>
                <TextField required fullWidth onChange={(e) => {
                    setNewRoomName(e.target.value)
                }} value={newRoomName} label="Room name" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    CANCEL
                </Button>
                <Button onClick={() => {
                    if (profileId) {
                        createRoom(
                            newRoomName,
                            profileId,
                            (room) => {
                                onSucceed && onSucceed(room.id)
                                enqueueSnackbar(`Created ${newRoomName} room.`, {variant:'success'});
                            }
                        );
                        onClose();
                    }
                }} color="primary" autoFocus>
                    CREATE
          </Button>
            </DialogActions>
        </React.Fragment>
    )
}

type DialogProps = {
    show: boolean,
    onClose: () => void,
    children: React.ReactElement
}

export const AddRoomDialog = ({
    show,
    onClose,
    children
}: DialogProps) => {
    return (
        <Dialog
            open={show}
            onClose={onClose}
            fullWidth
        >
            {children}
        </Dialog>
    )
}