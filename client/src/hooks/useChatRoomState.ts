import { useContext, useState, useEffect } from 'react';
import ProfileContext from '../contexts/ProfileContext';
import { createRequest, getRequests, getRoom, listenJoinRequests, updateRequest } from '../services/room';
import { Room, JoinRequest, RequestStatus } from '../types/room';

type Props = {
    room: Room
}

export const useJoinChatRoomState = (roomId: string) => {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;

    const [room, setRoom] = useState<Room>();
    const [request, setRequest] = useState<JoinRequest>();

    useEffect(() => {
        getRoom(roomId, (room) => {
            profile && getRequests(roomId, profile.id, (requests)=>{
                const sorted = requests.sort((a,b)=>a.date - b.date);
                console.log(sorted[0])
                setRequest(sorted[0]);
            })
            setRoom(room);
        })
    }, [profile,roomId]);

    const handleRequestJoinRoom = () => {
        if (profile) {
            createRequest(roomId, profile.nickname, profile.id, () => {
                console.log(`create request for room : ${roomId}`)
            })
        }
    }
    return {
        room,
        request,
        handleRequestJoinRoom
    }
}

export default function ({ room }: Props) {
    const [ requests, setRequests ] = useState<JoinRequest[]>([])
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequests> = () => { };
        if (profile?.id === room.ownerId) {
            unsubscribe = listenJoinRequests(room.id, (added) => {
                setRequests([...requests, ...added])
            }, (modified) => {
                setRequests(requests.map(req => {
                    const found = modified.find(r => r.id === req.id);
                    if (found) {
                        return found;
                    }
                    return req;
                }))
            }, (deleted) => {
                setRequests(requests.filter(req => {
                    return !deleted.find(r => r.id === req.id);
                }))
            })
        }
        return ()=>{
            unsubscribe();
        };
    }, [profile, room, setRequests, requests]);

    const handleAcceptRequest = (request: JoinRequest) => {
        updateRequest(room.id,
            {
                ...request,
                status: RequestStatus.Accepted
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