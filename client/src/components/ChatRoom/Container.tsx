import React, { useCallback, useContext } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import { Message } from '../../../../types/message';
import { modifyRoom } from '../../services/room';
import { addReaction, createMessage } from '../../services/message';
import { updateRequest } from '../../services/request';
import HeaderContainer from './Header';
import Messages from './Messages';
import SingleMessageContainer from './SingleMessage';
import InputContainer from './Input';
import { RequestsLoader, MessagesLoader } from '../Loaders';
import Presenter from './Presenter';

const Container: React.FC<{
    room: Room,
    profiles: Profile[],
    className?: string,
}> = ({
    className,
    profiles,
    room
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
                    loader={(onComplete, loading) => (
                        <MessagesLoader
                            roomId={room.id}
                            loading={loading}
                        >
                            {onComplete}
                        </MessagesLoader>)}
                    renderMessage={(message:Message) => (<SingleMessageContainer
                        roomId={room.id}
                        profile={profile!}
                        message={message}
                        profiles={profiles}
                        addReaction={addReaction}
                    />)}
                />
            )
        }, [room, profiles, profile]);

        const renderFooter = useCallback((style) => {
            return (
                <InputContainer
                    className={style}
                    profiles={profiles}
                    profile={profile!}
                    roomId={room.id}
                    createMessage={createMessage}
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