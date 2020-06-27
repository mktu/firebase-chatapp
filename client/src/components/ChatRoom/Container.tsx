import React, { useCallback, useContext } from 'react';
import { ProfileContext, ServiceContext } from '../../contexts';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import Header from './Header';
import Messages from './Messages';
import InputContainer from './Input';
import Presenter from './Presenter';

export type Props = {
    className?: string,
    room: Room,
    focusMessageId?: string,
    profiles: Profile[],
    show: boolean
}

const Container: React.FC<Props> = ({
    className,
    profiles,
    room,
    focusMessageId,
    show
}) => {
    const { profileState } = useContext(ProfileContext);
    const {
        modifyRoom,
        createMessage,
        updateRequest,
    } = useContext(ServiceContext);
    const { profile } = profileState;
    const owenr = profile?.id === room.ownerId;

    const renderHeader = useCallback((style) => {
        return (
            <Header
                className={style}
                owner={owenr}
                room={room}
                profiles={profiles}
                modifyRoom={modifyRoom}
                updateRequest={updateRequest}
            />
        );
    }, [room, profiles, owenr, modifyRoom, updateRequest]);

    const renderMessages = useCallback((style) => {
        return (
            <Messages
                className={style}
                roomId={room.id}
                focusMessageId={focusMessageId}
                profile={profile}
                profiles={profiles}
                show={show}
            />)
    }, [
        room.id,
        show,
        profiles,
        profile,
        focusMessageId,
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