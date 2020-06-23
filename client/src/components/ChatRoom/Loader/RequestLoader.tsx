import React, { useEffect, useState, useContext } from 'react';
import { Room } from '../../../../../types/room';
import { ServiceContext } from '../../../contexts';
import { JoinRequest } from '../../../../../types/request';

export type Props = {
    room: Room,
    className?: string,
    children : (requests : JoinRequest[])=>React.ReactElement
}

const RequestLoader: React.FC<Props> = ({
    room,
    children
}) => {
    const { listenJoinRequests } = useContext(ServiceContext);
    const [requests, setRequests] = useState<JoinRequest[]>([]);

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequests> = () => { };
        let unsubscribed = false;
        unsubscribe = listenJoinRequests(room.id, (added) => {
            if (added.length > 0) {
                !unsubscribed && setRequests(reqs => [...reqs, ...added.filter(r=>r.status==='requesting')]);
            }
        }, (modified) => {
            !unsubscribed && setRequests(reqs => reqs.map(req => {
                const found = modified.find(r => r.id === req.id);
                if (found) {
                    return found;
                }
                return req;
            }).filter(r=>r.status==='requesting'));
        }, (deleted) => {
            !unsubscribed && setRequests(reqs => reqs.filter(req => {
                return !deleted.find(r => r.id === req.id);
            }))
        })

        return () => {
            unsubscribed = true;
            unsubscribe();
        };
    }, [room.id, setRequests,listenJoinRequests]);

    return children(requests);
}


export default RequestLoader;