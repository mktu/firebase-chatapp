import React, { useMemo } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';

function EditUserPresenter<T extends {
    id: string,
    nickname: string,
}>({
    className,
    profiles,
    show,
    onClose,
    onDelete,
    owner
}: {
    className?: string,
    profiles: T[],
    show: boolean,
    onClose: () => void,
    onDelete: (id: string) => void,
    owner: boolean
}) {
    return (
        <Dialog fullWidth maxWidth='sm' open={show} className={className} onClose={onClose}>
            <DialogTitle >Users</DialogTitle>
            <DialogContent>
                <List>
                    {profiles.map((profile) => (<ListItem key={profile.id}>
                        <ListItemAvatar><Avatar>{profile.nickname[0]}</Avatar></ListItemAvatar>
                        <ListItemText>{profile.nickname}</ListItemText>
                        <ListItemSecondaryAction>
                            {owner && (
                                <IconButton onClick={() => {
                                    onDelete(profile.id);
                                }}>
                                    <HighlightOffIcon />
                                </IconButton>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    CLOSE
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default EditUserPresenter;