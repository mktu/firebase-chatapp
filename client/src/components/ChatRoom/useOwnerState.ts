import { useContext } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { modifyRoom } from '../../services/room';
import { updateRequest } from '../../services/request';
import { Room, JoinRequest } from '../../../../types/room';
import { RequestStatus } from '../../constants';

export default function (room:Room) {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const isOwner = profile?.id === room.ownerId;

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
        isOwner,
        handleAcceptRequest,
        handleRejectRequest
    };
}