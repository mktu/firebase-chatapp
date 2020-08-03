import { useContext } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import ServiceContext from '../../contexts/ServiceContext';
import { Room } from '../../../../types/room';

export default (room: Room) => {
    const { profileState } = useContext(ProfileContext);
    const { createRequest, deleteRequest } = useContext(ServiceContext);
    const { profile } = profileState;
    const {id:roomId} = room;

    const makeJoinRequest = () => {
        if (profile) {
            createRequest(roomId, profile.nickname, profile.id, () => {
                console.log(`create request for room : ${roomId}`)
            })
        }
    }

    const closeJoinRequest = (requestId:string) =>{
        deleteRequest(roomId,requestId);
    }
    return {
        makeJoinRequest,
        closeJoinRequest
    }
}
