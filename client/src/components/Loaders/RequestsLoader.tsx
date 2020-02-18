import React, { useState, useContext, useEffect } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { listenJoinRequests } from '../../services/request';
import { JoinRequest } from '../../../../types/request';
import { LoadingStatus, RequestStatus } from '../../constants';

type Props = {
    children: (requests: JoinRequest[]) => JSX.Element,
    loading: () => JSX.Element,
    fallback: () => JSX.Element,
    roomId: string
}

const RequestLoader: React.FC<Props> = ({
    children,
    loading,
    fallback,
    roomId
}) => {
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const [requests, setRequests] = useState<JoinRequest[]>([])
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequests> = () => { };
        let requests_: JoinRequest[] = [];

        unsubscribe = listenJoinRequests(roomId, (added) => {
            if (added.length > 0) {
                requests_ = [...requests_, ...added];
                setRequests(requests_.filter(req => req.status === RequestStatus.Requesting));
                setStatus(LoadingStatus.Succeeded);
            } else {
                setStatus(LoadingStatus.Failed);
            }
        }, (modified) => {
            requests_ = requests_.map(req => {
                const found = modified.find(r => r.id === req.id);
                if (found) {
                    return found;
                }
                return req;
            });
            setRequests(requests_.filter(req => req.status === RequestStatus.Requesting));
        }, (deleted) => {
            requests_ = requests_.filter(req => {
                return !deleted.find(r => r.id === req.id);
            });
            setStatus(LoadingStatus.Failed);
            setRequests(requests_.filter(req => req.status === RequestStatus.Requesting));
        })

        return () => {
            unsubscribe();
        };
    }, [profile, roomId, setRequests]);

    if (status === LoadingStatus.Loading) {
        return loading();
    }
    if (status === LoadingStatus.Failed) {
        return fallback();
    }
    return children(requests);
};

export default RequestLoader;