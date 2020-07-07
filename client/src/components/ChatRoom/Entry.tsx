import React from 'react';
import InactiveRoom, { Props as InactiveRoomProps } from './InactiveRoom';
import { Room } from '../../../../types/room';
import Container from './Container';
import Provider from './Provider';

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
        <Provider room={room}>
            <Container
                show={show}
                focusMessageId={focusMessageId}
            />
        </Provider>
    )
}


export default Entry;