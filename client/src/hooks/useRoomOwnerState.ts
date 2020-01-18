import { useContext, useState, useEffect } from 'react';
import ProfileContext from '../contexts/ProfileContext';
import { modifyRoom, listenJoinRequests, updateRequest } from '../services/room';
import { Room, JoinRequest, RequestStatus } from '../types/room';

type Props = {
    room: Room
}

export default function ({ room }: Props) {
    const [requests, setRequests] = useState<JoinRequest[]>([])
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequests> = () => { };
        let requests_: JoinRequest[] = [];
        if (profile?.id === room.ownerId) {
            unsubscribe = listenJoinRequests(room.id, (added) => {
                requests_ = [...requests_, ...added];
                setRequests(requests_.filter(req=>req.status===RequestStatus.Requesting));
            }, (modified) => {
                requests_ = requests_.map(req => {
                    const found = modified.find(r => r.id === req.id);
                    if (found) {
                        return found;
                    }
                    return req;
                });
                setRequests(requests_.filter(req=>req.status===RequestStatus.Requesting));
            }, (deleted) => {
                requests_ = requests_.filter(req => {
                    return !deleted.find(r => r.id === req.id);
                });
                setRequests(requests_.filter(req=>req.status===RequestStatus.Requesting));
            })
        }
        return () => {
            unsubscribe();
        };
    }, [profile, room, setRequests]);

    const handleAcceptRequest = (request: JoinRequest) => {
        updateRequest(room.id,
            {
                ...request,
                status: RequestStatus.Accepted
            });
        modifyRoom({
            ...room,
            users: [...room.users, request.profileId]
        });
    }
    const handleRejectRequest = (request: JoinRequest) => {
        updateRequest(room.id,
            {
                ...request,
                status: RequestStatus.Rejected
            });
    }

    return {
        requests,
        handleAcceptRequest,
        handleRejectRequest
    };
}