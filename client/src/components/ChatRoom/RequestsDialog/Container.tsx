import React from 'react';
import { modifyRoom } from '../../../services/room';
import { RequestStatus } from '../../../constants';
import { Room, JoinRequest } from '../../../../../types/room';
import { updateRequest } from '../../../services/request';
import Presenter from './Presenter';

const Container: React.FC<{
    className?: string,
    room: Room,
    show: boolean,
    requests : JoinRequest[],
    onClose: () => void
}> = ({
    className,
    room,
    show,
    requests,
    onClose
}) => {
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
        
        return <Presenter
            show={show}
            requests={requests}
            className={className}
            handleAcceptRequest={handleAcceptRequest}
            handleRejectRequest={handleRejectRequest}
            onClose={onClose}
        />;
    };

export default Container;