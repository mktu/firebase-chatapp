import React from 'react';
import RoomLoader from '../Loaders/RoomLoader';
import Container from './Container';

const Entry: React.FC<{
    roomId: string,
    fallback: () => React.ReactElement,
    accepted: React.ReactElement
}> = ({
    roomId,
    fallback,
    accepted
}) => {
        return (
            <RoomLoader
                roomId={roomId}
                fallback={fallback}
                useDb
            >
                {(room) => (
                    <Container room={room} accepted={accepted} />
                )}
            </RoomLoader>
        )
    }

export default Entry;