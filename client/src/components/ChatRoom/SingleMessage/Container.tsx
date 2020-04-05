import React, { useMemo, useState, useCallback } from 'react';
import * as Presenters from './Presenter';
import { Profile } from '../../../../../types/profile';
import { Message } from '../../../../../types/message';

export type AddReaction = (
    roomId: string,
    messageId: string,
    reactionId: string,
    profileId: string,
) => void;

const Container: React.FC<{
    roomId: string,
    profiles: Profile[],
    profile: Profile,
    message: Message,
    addReaction: AddReaction
}> = ({
    profiles,
    profile,
    message,
    roomId,
    addReaction
}) => {
        const sender = profiles.find(p => p.id === message.profileId);
        const amISender = sender?.id === profile!.id;
        const date = new Date(message.date);
        const time = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        const [showEmoAction, setShowEmoAction] = useState(false);

        const onHoverReceivedMessage = useCallback(() => {
            setShowEmoAction(true);
        }, []);
        const onLeaveReceivedMessage = useCallback(() => {
            setShowEmoAction(false);
        }, []);

        const handleAddReaction = useCallback((reactionId: string) => {
            addReaction(
                roomId,
                message.id,
                reactionId,
                profile!.id,
            )
        }, [roomId, message.id, profile,addReaction]);

        const reactions: { [s: string]: string[] } = useMemo(() => {
            const reactionsBase = message.reactions || {};
            const keys = Object.keys(reactionsBase);
            return keys.reduce<{ [s: string]: string[] }>((acc, cur) => {
                const profileIds = reactionsBase[cur];
                const profilesNames = profileIds.map(id => {
                    const profile = profiles.find(p => p.id === id);
                    return profile?.nickname || 'Unknown';
                });
                acc[cur] = profilesNames;
                return acc;
            }, {});
        }, [message.reactions, profiles]);

        return useMemo(() =>
            (
                <React.Fragment >
                    {amISender ? (
                        <Presenters.SentMessage
                            time={time}
                            handleAddReaction={handleAddReaction}
                            sender={sender!.nickname}
                            message={message.message}
                            reactions={reactions}
                        />
                    ) : (
                            <Presenters.ReceivedMessage
                                time={time}
                                onHoverReceivedMessage={onHoverReceivedMessage}
                                onLeaveReceivedMessage={onLeaveReceivedMessage}
                                handleAddReaction={handleAddReaction}
                                sender={sender?.nickname || 'Unknown'}
                                message={message.message}
                                reactions={reactions}
                                showEmoAction={showEmoAction}
                            />
                        )}
                </React.Fragment >
            ), [
            message,
            amISender,
            reactions,
            onHoverReceivedMessage,
            onLeaveReceivedMessage,
            showEmoAction,
            handleAddReaction,
            time,
            sender,
        ])
    };

export default Container;