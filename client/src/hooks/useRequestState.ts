import { useContext, useState, useEffect } from 'react';
import ProfileContext from '../contexts/ProfileContext';
import { useHistory } from "react-router-dom";
import { createRequest, deleteRequest, listenJoinRequestsByUser } from '../services/room';
import { Room, JoinRequest, RequestStatus } from '../types/room';

export default (room: Room) => {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const history = useHistory();
    const [request, setRequest] = useState<JoinRequest>();
    const {id:roomId,users} = room;

    useEffect(() => {
        if (request) {
            if (request.status === RequestStatus.Accepted && users.includes(profile!.id)) {
                history.replace(`/rooms/${roomId}`);
            }
        }

    }, [request,room,profile,history,roomId,users])

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequestsByUser> = () => { };
        let request_ : JoinRequest | undefined = undefined;
        if (profile) {
            unsubscribe = listenJoinRequestsByUser(roomId, profile.id, (requests) => {
                if (requests.length > 0) {
                    const sorted = requests.sort((a, b) => a.date - b.date);
                    request_ = sorted[0];
                    setRequest(request_);
                }
            }, (requests) => {
                const sorted = requests.sort((a, b) => a.date - b.date);
                request_ = sorted[0];
                setRequest(request_);
            }, (requests) => {
                if (requests.find(req => req.id === request_?.id)) {
                    request_ = undefined;
                    setRequest(request_);
                }
            })
        }
        return () => {
            unsubscribe();
        }
    }, [profile, roomId]);

    const makeJoinRequest = () => {
        if (profile) {
            createRequest(roomId, profile.nickname, profile.id, () => {
                console.log(`create request for room : ${roomId}`)
            })
        }
    }

    const closeJoinRequest = () =>{
        request && deleteRequest(roomId,request.id)
    }
    return {
        request,
        makeJoinRequest,
        closeJoinRequest
    }
}
