import React, { useContext, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Presenter from './Presenter';
import { ServiceContext, MessagesContext } from '../../../contexts';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';
import SingleMessage from './SingleMessage';
import { Message } from '../../../../../types/message';
import { MyProfileContext } from '../ChatroomContext';

type Props = {
    className?: string,
    messages: Message[],
    roomId: string,
    show : boolean,
    readMore: (forward?: boolean) => void,
    backwardListenable: boolean,
    forwardListenable: boolean,
    focusMessageId?: string,
}

const Container: React.FC<Props> = ({
    className,
    messages,
    roomId,
    show,
    readMore,
    backwardListenable,
    forwardListenable,
    focusMessageId,
}) => {
    const {id:profileId} = useContext(MyProfileContext);
    const { actions: messageActions } = useContext(MessagesContext);
    const { addReadFlags, addReaction, disableMessage } = useContext(ServiceContext);
    const unreads = messages.filter(m => {
        if (m.senderId === profileId) return false;
        if (!m.readers) return true;
        return !m.readers.includes(profileId);
    }).length;
    console.log(roomId)

    useEffect(() => {
        messageActions.update(roomId, unreads);
    }, [unreads, messageActions, roomId,])

    useEffect(() => {
        if(show) {
            addReadFlags(roomId, profileId, messages);
        }
    }, [show, messages, addReadFlags, profileId, roomId])

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
                                addReaction={(messageId, reactionId, profileId) => {
                                    addReaction({
                                        roomId,
                                        messageId,
                                        reactionId,
                                        profileId
                                    });
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