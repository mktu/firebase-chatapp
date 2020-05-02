import React, { useMemo, useState, useCallback } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as Presenters from './Presenters';
import { Profile } from '../../../../../types/profile';
import { Message } from '../../../../../types/message';
import Input, { EditMessagePresenter } from '../Input';
import { EditMessage, AddReaction, DisableMessage } from '../types';

const Container: React.FC<{
    profiles: Profile[],
    profile: Profile,
    message: Message,
    addReaction: AddReaction,
    editMessage: EditMessage,
    disableMessage: DisableMessage
}> = ({
    profiles,
    profile,
    message,
    addReaction,
    editMessage,
    disableMessage
}) => {
        const sender = profiles.find(p => p.id === message.senderId);
        const amISender = sender?.id === profile!.id;
        const date = new Date(message.update || message.date);
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
                message.id,
                reactionId,
                profile!.id,
            )
        }, [message.id, profile, addReaction]);

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
                            profiles={profiles}
                            submitMessage={(messageText, mentions) => {
                                editMessage(message.id, messageText, mentions);
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

        if(message.disable){
            return null;
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
                        onClickDelete={() => {
                            disableMessage(
                                message.id
                            )
                        }}
                        update={Boolean(message.update)}
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
                            update={Boolean(message.update)}
                        />
                    )}
            </React.Fragment >
        )
    };

export default Container;