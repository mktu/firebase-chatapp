import React, { useContext, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Presenter from './Presenter';
import { ServiceContext, MessagesContext } from '../../../contexts';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';
import SingleMessage from './SingleMessage';
import { Message } from '../../../../../types/message';
import { Profile } from '../../../../../types/profile';

type Props = {
    className?: string,
    messages: Message[],
    roomId: string,
    show : boolean,
    profile: Profile,
    profiles : Profile[],
    readMore: (forward?: boolean) => void,
    backwardListenable: boolean,
    forwardListenable: boolean,
    focusMessageId?: string,
}

const Container: React.FC<Props> = ({
    className,
    messages,
    roomId,
    profile,
    profiles,
    show,
    readMore,
    backwardListenable,
    forwardListenable,
    focusMessageId,
}) => {

    const { actions: messageActions } = useContext(MessagesContext);
    const { addReadFlags, addReaction, editMessage, disableMessage } = useContext(ServiceContext);
    const unreads = messages.filter(m => {
        if (m.senderId === profile.id) return false;
        if (!m.readers) return true;
        return !m.readers.includes(profile.id);
    }).length;

    useEffect(() => {
        messageActions.update(roomId, unreads);
    }, [unreads, messageActions, roomId,])

    useEffect(() => {
        if(show) {
            addReadFlags(roomId, profile.id, messages);
        }
    }, [show, messages, addReadFlags, profile, roomId])

    return <Presenter className={className}>
        {
            ({ classes }) => (
                <InfiniteScrollable
                    classes={classes}
                    loadMore={readMore}
                    uniqueKey='id'
                    hasOlderItems={backwardListenable}
                    hasNewerItems={forwardListenable}
                    items={messages}
                    focusItemId={focusMessageId}
                    listComponent={List}
                    listItemComponent={ListItem}
                    notificationComponent={NewItemNotification}
                >
                    {(message) => (
                            <SingleMessage
                                message={message}
                                profile={profile}
                                profiles={profiles}
                                addReaction={(messageId, reactionId, profileId) => {
                                    addReaction({
                                        roomId,
                                        messageId,
                                        reactionId,
                                        profileId
                                    });
                                }}
                                editMessage={(messageId, message, mentions) => {
                                    editMessage({
                                        roomId,
                                        messageId,
                                        message,
                                        mentions
                                    })
                                }}
                                disableMessage={(messageId) => {
                                    disableMessage(roomId, messageId);
                                }}
                            />
                        )}
                </InfiniteScrollable>
            )
        }
    </Presenter>

}

export default Container;