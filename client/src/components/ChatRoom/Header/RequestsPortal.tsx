import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { JoinRequest } from '../../../../../types/room';

const Wrapper = styled.div`
    width : 300px;
    &> .title{
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    &> .accept-all{
        color : ${({ theme }) => `${theme.palette.secondary.main}`};
        display : flex;
        justify-content : flex-end;
        padding-right : ${({ theme }) => `${theme.spacing(1)}px`};
        padding-top : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;
const Divider = styled.div`
    border-bottom : 1px solid ${({ theme }) => `${theme.palette.divider}`};
    width : 100%;
`;

type Props = {
    className?: string,
    handleAcceptRequest: (req: JoinRequest) => void,
    handleRejectRequest: (req: JoinRequest) => void,
    anchor: HTMLElement | null,
    requests: JoinRequest[],
    onClose: () => void
};

function RequestsPortal({
    className,
    handleAcceptRequest,
    handleRejectRequest,
    anchor,
    requests,
    onClose
}: Props) {
    useEffect(() => {
        if (requests.length === 0) {
            onClose()
        }
    }, [requests.length,onClose])
    return <Popover
        open={Boolean(anchor) && requests.length > 0}
        anchorEl={anchor}
        className={className}
        onClose={onClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
    >
        <Wrapper>
            <div className='title'>
                <Typography variant='subtitle1'>JOIN REQUESTS</Typography>
                <Typography variant='body1'>There are people want to join this room. Choose to accept or refuse</Typography>
            </div>
            <Divider />
            <div className='accept-all'>
                <ButtonBase onClick={() => {

                }}><CheckCircleIcon /> Accept all</ButtonBase>
            </div>
            <List className={className}>
                {requests.map(req => {
                    return (
                        <ListItem id={req.id} key={req.id}>
                            <ListItemText>{req.nickName}</ListItemText>
                            <ListItemSecondaryAction>
                                <Button color='secondary' variant='contained' onClick={() => {
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
        </Wrapper>

    </Popover>
}

export default RequestsPortal;