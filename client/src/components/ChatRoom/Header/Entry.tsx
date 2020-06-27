import React from 'react';
import { Room, JoinRequest } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import { RequestsLoader } from '../Loader';
import Container from './Container';

type Props = {
    room: Room,
    profiles: Profile[],
    owner: boolean,
    modifyRoom: (room: Room) => void,
    updateRequest: (roomId: string, request: JoinRequest) => void
    className?: string,
}

const Entry: React.FC<Props> = ({
    room,
    ...other
}) => {

    return (
        <RequestsLoader room={room}>
            {(requests) => (
                <Container
                    room={room}
                    requests={requests}
                    {...other}
                />
            )}
        </RequestsLoader>
    )
};

export default Entry;