import React, { useCallback, useContext } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import { modifyRoom } from '../../services/room';
import { addReaction, createMessage, editMessage, registMessagesListener, getMessage, getMessages, disableMessage } from '../../services/message';
import { updateRequest } from '../../services/request';
import HeaderContainer from './Header';
import Messages from './Messages';
import InputContainer from './Input';
import { RequestsLoader } from '../Loaders';
import Presenter from './Presenter';

const Container: React.FC<{
    room: Room,
    profiles: Profile[],
    className?: string,
    messageId?: string
}> = ({
    className,
    profiles,
    room,
    messageId
}) => {
        const { profileState } = useContext(ProfileContext);
        const { profile } = profileState;
        const owenr = profile?.id === room.ownerId;

        const renderHeader = useCallback((style) => {
            return (
                <RequestsLoader roomId={room.id}>
                    {(requests) => (
                        <HeaderContainer
                            className={style}
                            owenr={owenr}
                            requests={requests}
                            room={room}
                            profiles={profiles}
                            modifyRoom={modifyRoom}
                            updateRequest={updateRequest}
                        />
                    )}
                </RequestsLoader>
            );
        }, [room, profiles, owenr]);

        const renderMessages = useCallback((style) => {
            return profile ? (
                <Messages
                    className={style}
                    focusMessageId={messageId}
                    profile={profile}
                    profiles={profiles}
                    addReaction={(messageId, reactionId, profileId)=>{
                        addReaction({
                            roomId:room.id,
                            messageId,
                            reactionId,
                            profileId
                        });
                    }}
                    messageListenerRegister={(args)=>{
                        return registMessagesListener({
                            roomId: room.id,
                            ...args
                        });
                    }}
                    getMessage={(args)=>{
                        getMessage({
                            roomId: room.id,
                            ...args
                        })
                    }}
                    getMessages={(args)=>{
                        getMessages({
                            roomId: room.id,
                            ...args
                        })
                    }}
                    editMessage={(messageId,message,mentions) => {
                        editMessage({
                            roomId: room.id,
                            messageId,
                            message,
                            mentions
                        })
                    }}
                    disableMessage={(messageId)=>{
                        disableMessage(room.id,messageId);
                    }}
                />
            ) : <div/>
        }, [room.id, profiles, profile, messageId]);

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
            ) : <div/>;
        }, [room, profiles, profile]);

        return (
            <Presenter
                className={className}
                renderHeader={renderHeader}
                renderMessages={renderMessages}
                renderFooter={renderFooter}
            />
        )
    };

export default Container;