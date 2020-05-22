import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Presenter from './Presenter';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';
import { Message } from '../../../../../types/message';

type Props = {
    className?: string,
    messages: Message[],
    readMore: (forward?: boolean) => void,
    backwardListenable: boolean,
    forwardListenable: boolean,
    focusMessageId?: string,
    children : (messages:Message) => React.ReactElement
}

const Container: React.FC<Props> = ({
    className,
    messages,
    readMore,
    backwardListenable,
    forwardListenable,
    focusMessageId,
    children
}) => {

    return <Presenter className={className}>
        {
            ( {classes} ) => (
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
                    {children}
                </InfiniteScrollable>
            )
        }
        </Presenter>

}

export default Container;