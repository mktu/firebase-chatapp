import React, { useCallback, useContext } from 'react';
import Header from './Header';
import Messages from './Messages';
import InputContainer from './Input';
import Presenter from './Presenter';
import * as ChatroomContexts from './ChatroomContext';

export type Props = {
    className?: string,
    focusMessageId?: string,
    show: boolean
}

const Container: React.FC<Props> = ({
    className,
    focusMessageId,
    show
}) => {
    const room = useContext(ChatroomContexts.ChatroomContext);
    const profile = useContext(ChatroomContexts.MyProfileContext);
    const owenr = profile.id === room.ownerId;

    const renderHeader = useCallback((style) => {
        return (
            <Header
                className={style}
                owner={owenr}
            />
        );
    }, [owenr]);

    const renderMessages = useCallback((style) => {
        return (
            <Messages
                className={style}
                focusMessageId={focusMessageId}
                show={show}
            />)
    }, [
        show,
        focusMessageId,
    ]);

    const renderFooter = useCallback((style) => {
        return <InputContainer className={style} />
    }, []);

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