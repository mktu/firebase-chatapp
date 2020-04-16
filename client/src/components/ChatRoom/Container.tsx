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
            )
        }, [room, profiles, owenr]);

        const renderMessages = useCallback((style) => {
            return (
                <Messages
                    className={style}
                    roomId={room.id}
                    focusMessageId={messageId}
                    profile={profile!}
                    profiles={profiles}
                    addReaction={addReaction}
                    messageListenerRegister={registMessagesListener}
                    getMessage={getMessage}
                    getMessages={getMessages}
                    editMessage={editMessage}
                    disableMessage={disableMessage}
                />
            )
        }, [room.id, profiles, profile, messageId]);

        const renderFooter = useCallback((style) => {
            return (
                <InputContainer
                    className={style}
                    profiles={profiles}
                    profile={profile!}
                    roomId={room.id}
                    submitMessage={createMessage}
                />
            )
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