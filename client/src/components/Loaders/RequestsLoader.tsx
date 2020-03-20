import React, { useState, useContext, useEffect } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { listenJoinRequests } from '../../services/request';
import { JoinRequest } from '../../../../types/request';
import { RequestStatus } from '../../constants';

type Props = {
    children: (requests: JoinRequest[]) => React.ReactElement,
    roomId: string
}

const RequestLoader: React.FC<Props> = ({
    children,
    roomId
}) => {
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const requestingRequests = requests.filter(req => req.status === RequestStatus.Requesting);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequests> = () => { };

        unsubscribe = listenJoinRequests(roomId, (added) => {
            if (added.length > 0) {
                setRequests(reqs => [...reqs, ...added]);
            }
        }, (modified) => {
            setRequests(reqs => reqs.map(req => {
                const found = modified.find(r => r.id === req.id);
                if (found) {
                    return found;
                }
                return req;
            }));
        }, (deleted) => {
            setRequests(reqs => reqs.filter(req => {
                return !deleted.find(r => r.id === req.id);
            }))
        })

        return () => {
            unsubscribe();
        };
    }, [profile, roomId, setRequests]);

    return children(requestingRequests);
};

export default RequestLoader;