import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

type Props = {
    show: boolean,
    roomName : string,
    handleChangeRoomName : (e : React.ChangeEvent<HTMLInputElement>) => void,
    onClose: () => void,
    onSave: () => void
}

export default ({ show, onClose, roomName, handleChangeRoomName, onSave }: Props) => {
    return (
        <Dialog
            open={show}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle >CREATE NEW ROOM</DialogTitle>
            <DialogContent>
                <TextField required fullWidth onChange={handleChangeRoomName} value={roomName} label="Room name" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    CANCEL
                </Button>
                <Button onClick={onSave} color="primary" autoFocus>
                    CREATE
          </Button>
            </DialogActions>
        </Dialog>
    )
};