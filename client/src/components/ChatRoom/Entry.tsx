import React from 'react';
import * as Loaders from './Loader';
import InactiveRoom, { Props as InactiveRoomProps } from './InactiveRoom';
import { Room } from '../../../../types/room';
import Container from './Container';

export type Props = {
    room: Room,
    show: boolean,
    className?: string,
    focusMessageId?: string,
} & InactiveRoomProps;

const Entry: React.FC<Props> = ({ room, show, onClose, focusMessageId }) => {

    if (room.disabled) {
        return <InactiveRoom room={room} show={show} onClose={onClose} />;
    }
    return (
        <Loaders.ProfileLoader room={room}>
            {(profiles) => (
                <Container
                    profiles={profiles}
                    room={room}
                    show={show}
                    focusMessageId={focusMessageId}
                />
            )}
        </Loaders.ProfileLoader>
    )
}


export default Entry;