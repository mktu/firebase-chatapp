import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

function Presenter<T extends {
    id: string,
    nickName: string
}>({
    className,
    handleAcceptRequest,
    handleRejectRequest,
    show,
    requests,
    onClose
}: {
    className?: string,
    handleAcceptRequest: (req: T) => void,
    handleRejectRequest: (req: T) => void,
    show: boolean,
    requests: T[],
    onClose : ()=>void
}) {
    return <Dialog open={show} fullWidth maxWidth='sm' onClose={onClose}>
        <DialogContent>
            <List className={className}>
                {requests.map(req => {
                    return (
                        <ListItem id={req.id} key={req.id}>
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
            </List>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>CLOSE</Button>
        </DialogActions>
    </Dialog>
}

export default Presenter;