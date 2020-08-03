import React, { useState, useContext, useEffect } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import ServiceContext from '../../contexts/ServiceContext';
import { Room } from '../../../../types/room';
import { JoinRequest } from '../../../../types/request';
import { LoadingStatus } from '../../constants';

type Props = {
    children: (request?:JoinRequest)=>JSX.Element,
    loading: ()=>JSX.Element,
    fallback: ()=>JSX.Element,
    room : Room
}

const RequestLoader: React.FC<Props> = ({
    children,
    loading,
    fallback,
    room
}) => {
    const [status, setStatus] = useState<string>(LoadingStatus.Loading);
    const { profileState } = useContext(ProfileContext);
    const { listenJoinRequestsByUser } = useContext(ServiceContext);
    const { profile } = profileState;
    const [request, setRequest] = useState<JoinRequest>();
    const {id : roomId} = room;

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequestsByUser> = () => { };
        if (profile) {
            unsubscribe = listenJoinRequestsByUser(roomId, profile.id, (requests) => {
                if (requests.length > 0) {
                    const sorted = requests.sort((a, b) => a.date - b.date);
                    setRequest(sorted[0]);
                    setStatus(LoadingStatus.Succeeded);
                }
                else{
                    setStatus(LoadingStatus.Failed);
                }
            }, (requests) => {
                const sorted = requests.sort((a, b) => a.date - b.date);
                setRequest(sorted[0]);
            }, () => {
                setRequest(undefined);
                setStatus(LoadingStatus.Failed);
            })
        }
        return () => {
            unsubscribe();
        }
    }, [profile, roomId, listenJoinRequestsByUser]);

    if (status === LoadingStatus.Loading) {
        return loading();
    }
    if (status === LoadingStatus.Failed) {
        return fallback();
    }
    return children(request);
};

export default RequestLoader;