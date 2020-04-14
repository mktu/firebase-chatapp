import React, { useMemo, useState, useCallback } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as Presenters from './Presenters';
import { Profile } from '../../../../../types/profile';
import { Message } from '../../../../../types/message';
import Input, { EditMessagePresenter } from '../Input';
import { EditMessage, AddReaction } from '../types';

const Container: React.FC<{
    roomId: string,
    profiles: Profile[],
    profile: Profile,
    message: Message,
    addReaction: AddReaction,
    editMessage: EditMessage
}> = ({
    profiles,
    profile,
    message,
    roomId,
    addReaction,
    editMessage
}) => {
        const sender = profiles.find(p => p.id === message.profileId);
        const amISender = sender?.id === profile!.id;
        const date = new Date(message.date);
        const time = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        const [showEmoAction, setShowEmoAction] = useState(false);
        const [editable, setEditable] = useState(false);

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
        }, [roomId, message.id, profile, addReaction]);

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

        if (editable) {
            return (
                <ClickAwayListener onClickAway={() => {
                    setEditable(false);
                }}>
                    <Presenters.EditMessage>
                        <Input
                            roomId={roomId}
                            profiles={profiles}
                            profile={profile}
                            submitMessage={(roomId, messageText, profileId, mentions) => {
                                editMessage(roomId, message.id, messageText, profileId, mentions);
                                setEditable(false);
                            }}
                            onCancel={() => { setEditable(false) }}
                            presenter={EditMessagePresenter}
                            initText={message.message}
                            initMentions={message.mentions}
                            suggestionPlacement='below'
                        />
                    </Presenters.EditMessage>
                </ClickAwayListener>
            )
        }

        return (
            <React.Fragment >
                {amISender ? (
                    <Presenters.SentMessage
                        time={time}
                        handleAddReaction={handleAddReaction}
                        sender={sender!.nickname}
                        message={message.message}
                        reactions={reactions}
                        onClickEdit={() => { setEditable(true) }}
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
        )
    };

export default Container;