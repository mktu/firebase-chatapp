import React, { useCallback } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';

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

export type OnLoadCompleted<T> = (
    messages: T[],
    readMore: () => void,
    hasMore: boolean
) => React.ReactElement;

export type OnLoading = () => React.ReactElement;

function Presenter<T extends{
    id: string
}>({
    className,
    loader,
    renderMessage
}: {
    className?: string,
    loader: (
        onLoadCompleted: OnLoadCompleted<T>,
        onLoading: OnLoading
    ) => React.ReactElement,
    renderMessage: (message: T) => React.ReactElement
}) {
    const loading: OnLoading = useCallback(() => {
        return (<div>loading messages...</div>);
    }, [])
    const onLoadCompleted: OnLoadCompleted<T> = useCallback((messages, readMore, hasMore) => {
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