import React, { useCallback } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';
import { Message } from '../../../../../types/message';

const Wrapper = styled.div`
    position : relative;
    & > .messages-scrollable{
        overflow : auto;
        height : 100%;

        > .messages-notification{
            position : absolute;
            left: 0;
            right: 0;
            margin: auto;
        }
    }
`;

export type OnLoadCompleted = (
    messages: Message[],
    readMore: () => void,
    hasMore: boolean
) => React.ReactElement;

export type OnLoading = () => React.ReactElement;


const Presenter: React.FC<{
    className?: string,
    loader: (
        onLoadCompleted: OnLoadCompleted,
        onLoading: OnLoading
    ) => React.ReactElement,
    renderMessage: (message: Message) => React.ReactElement
}> = ({
    className,
    loader,
    renderMessage
}) => {
        const loading: OnLoading = useCallback(() => {
            return (<div>loading messages...</div>);
        }, [])
        const onLoadCompleted: OnLoadCompleted = useCallback((messages, readMore, hasMore) => {
            return (
                <InfiniteScrollable
                    loadMore={readMore}
                    hasMore={hasMore}
                    items={messages}
                    listComponent={List}
                    renderNewItemNotification={(show, onClick) => (
                        <NewItemNotification className='messages-notification' show={show} onClick={onClick} />)}
                    renderItem={(message) => (
                        <ListItem key={message.id} className='messages-item'>
                            {renderMessage(message)}
                        </ListItem>
                    )}
                />
            )
        }, [renderMessage]);
        return (
            <Wrapper className={className} >
                <div className='messages-scrollable'>
                    {loader(
                        onLoadCompleted,
                        loading
                    )}
                </div>
            </Wrapper >
        )
    }

export default Presenter;