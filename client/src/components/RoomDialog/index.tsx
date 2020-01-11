import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import useRoomDialogState from '../../hooks/useRoomDialogState';

type Props = {
    show: boolean,
    onClose: () => void,
    onSave: (roomName : string) => void
}

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

export default ({ show, onClose, onSave }: Props) => {
    const { handleChangeName, handleSubmit, roomName } = useRoomDialogState(onSave);
    return (
        <Dialog
            open={show}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle >CREATE NEW ROOM</DialogTitle>
            <DialogContent>
                <TextField required fullWidth onChange={handleChangeName} value={roomName} label="Room name" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    CANCEL
                </Button>
                <Button onClick={handleSubmit} color="primary" autoFocus>
                    CREATE
          </Button>
            </DialogActions>
        </Dialog>
    )
};