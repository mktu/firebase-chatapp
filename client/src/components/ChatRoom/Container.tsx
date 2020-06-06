import React, { useCallback, useContext, useEffect } from 'react';
import { ProfileContext, ServiceContext, MessagesContext } from '../../contexts';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import { Message } from '../../../../types/message';
import { JoinRequest } from '../../../../types/request';
import HeaderContainer from './Header';
import Messages from './Messages';
import SingleMessage from './Messages/SingleMessage';
import InputContainer from './Input';
import Presenter from './Presenter';

export type Props = {
    className?: string,
    room: Room,
    messages: Message[],
    readMore: (forward?: boolean) => void,
    backwardListenable: boolean,
    forwardListenable: boolean,
    focusMessageId?: string,
    profiles: Profile[],
    requests: JoinRequest[],
    show: boolean
}

const Container: React.FC<Props> = ({
    className,
    profiles,
    room,
    requests,
    focusMessageId,
    messages,
    readMore,
    backwardListenable,
    forwardListenable,
    show
}) => {
    const { profileState } = useContext(ProfileContext);
    const { actions: messageActions } = useContext(MessagesContext);
    const {
        modifyRoom,
        addReaction,
        createMessage,
        editMessage,
        disableMessage,
        updateRequest,
        addReadFlags
    } = useContext(ServiceContext);
    const { profile } = profileState;
    const owenr = profile?.id === room.ownerId;
    const unreads = messages.filter(m => {
        if (!profile || m.senderId === profile?.id) return false;
        if (!m.readers) return true;
        return !m.readers.includes(profile.id);
    }).length;

    useEffect(()=>{
        messageActions.update(room.id, unreads);
    },[unreads,messageActions,room.id, ])
    
    useEffect(() => {
        if (profile && show) {
            addReadFlags(room.id, profile.id, messages);
        }
    }, [show, messages, addReadFlags, profile, room.id])

    const renderHeader = useCallback((style) => {
        return (
            <HeaderContainer
                className={style}
                owner={owenr}
                requests={requests}
                room={room}
                profiles={profiles}
                modifyRoom={modifyRoom}
                updateRequest={updateRequest}
            />
        );
    }, [room, profiles, owenr, modifyRoom, requests, updateRequest]);

    const renderMessages = useCallback((style) => {
        return profile ? (
            <Messages
                className={style}
                focusMessageId={focusMessageId}
                messages={messages}
                backwardListenable={backwardListenable}
                forwardListenable={forwardListenable}
                readMore={readMore}
            >
                {(message) => (
                    <SingleMessage
                        message={message}
                        profile={profile}
                        profiles={profiles}
                        addReaction={(messageId, reactionId, profileId) => {
                            addReaction({
                                roomId: room.id,
                                messageId,
                                reactionId,
                                profileId
                            });
                        }}
                        editMessage={(messageId, message, mentions) => {
                            editMessage({
                                roomId: room.id,
                                messageId,
                                message,
                                mentions
                            })
                        }}
                        disableMessage={(messageId) => {
                            disableMessage(room.id, messageId);
                        }}
                    />
                )}
            </Messages>
        ) : <div />
    }, [
        room.id,
        profiles,
        profile,
        focusMessageId,
        addReaction,
        backwardListenable,
        disableMessage,
        editMessage,
        forwardListenable,
        messages,
        readMore,
    ]);

    const renderFooter = useCallback((style) => {
        return profile ? (<InputContainer
            className={style}
            profiles={profiles}
            submitMessage={(message, mentions) => {
                createMessage({
                    roomId: room.id,
                    roomName: room.roomName,
                    senderId: profile.id,
                    senderName: profile.nickname,
                    message,
                    mentions
                })
            }}
        />
        ) : <div />;
    }, [room, profiles, profile, createMessage]);

    return (
        <Presenter
            className={className}
            renderHeader={renderHeader}
            renderMessages={renderMessages}
            renderFooter={renderFooter}
            show={show}
        />
    )
};

export default Container;