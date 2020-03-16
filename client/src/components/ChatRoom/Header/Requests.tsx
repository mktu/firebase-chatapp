import React from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { JoinRequest } from '../../../../../types/request';
import { RequestsLoader } from '../../Loaders';

type Props = {
    className?: string,
    roomId: string,
    handleAcceptRequest: (req: JoinRequest) => void,
    handleRejectRequest: (req: JoinRequest) => void
};

const Request : React.FC<Props> = ({
    className,
    handleAcceptRequest,
    handleRejectRequest,
    roomId
}: Props) => {
    return (
        <div className={className}>
            <RequestsLoader
                roomId={roomId}
                fallback={() => (<div>no request</div>)}
                loading={() => (<div>loading requests...</div>)}
            >
                {
                    (requests) => {
                        return <List>
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
                    }
                }
            </RequestsLoader>
        </div>
    )
};

export default Request;