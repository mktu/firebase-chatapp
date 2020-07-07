import React, {useContext} from 'react';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import { SingleMessageProps } from '../../types';
import { MyProfileContext, UsersContext } from '../../ChatroomContext';

const Container: React.FC<SingleMessageProps> = ({
    message,
    addReaction,
    disableMessage
}) => {
    const profile = useContext(MyProfileContext);
    const profiles = useContext(UsersContext);
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