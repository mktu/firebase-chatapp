import React from 'react';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import { SingleMessageProps } from '../../types';

const Container: React.FC<SingleMessageProps> = ({
    profiles,
    profile,
    message,
    addReaction,
    editMessage,
    disableMessage
}) => {
    const sender = profiles.find(p => p.id === message.senderId);
    const amISender = sender?.id === profile.id;

    if (message.disable) {
        return null;
    }

    return (
        <React.Fragment >
            {amISender ? (
                <SentMessage
                    message={message}
                    sender={profile}
                    profiles={profiles}
                    editMessage={editMessage}
                    disableMessage={disableMessage}
                />
            ) : (
                    <ReceivedMessage
                        message={message}
                        sender={sender}
                        me={profile}
                        profiles={profiles}
                        addReaction={addReaction}
                    />
                )}
        </React.Fragment >
    )
};

export default Container;