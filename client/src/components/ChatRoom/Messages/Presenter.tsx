import React, { useCallback } from 'react';
import styled, {keyframes} from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InfiniteScrollable from '../../InfiniteScrollable';
import NewItemNotification from '../../InfiniteScrollable/NewItemNotification';

const focusAnimation = keyframes`
    0% {
        background-color : rgba(0,0,0,0);
    }
    50% {
        background-color : rgba(0,0,0,0.04);
    }
    100% {
        background-color : rgba(0,0,0,0);
    }
`;

const Wrapper = styled.div`
    position : relative;
    & > .messages-scrollable{
        overflow : auto;
        height : 100%;
        > .messages-items{
            > .focus-message{
                animation: ${focusAnimation} 3s 0s both;
            }
        }
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
    hasMore: boolean,
    forwardScrollable?: boolean
) => React.ReactElement;

export type OnLoading = () => React.ReactElement;

function Presenter<T extends{
    id: string
}>({
    className,
    loader,
    renderMessage,
    focusMessageId
}: {
    className?: string,
    focusMessageId?:string
    loader: (
        onLoadCompleted: OnLoadCompleted<T>,
        onLoading: OnLoading
    ) => React.ReactElement,
    renderMessage: (message: T) => React.ReactElement
}) {
    const loading: OnLoading = useCallback(() => {
        return (<div>loading messages...</div>);
    }, [])
    const onLoadCompleted: OnLoadCompleted<T> = useCallback((messages, readMore, hasMore, forwardScrollable) => {
        return (
            <InfiniteScrollable
                loadMore={readMore}
                hasMore={hasMore}
                items={messages}
                classes={{
                    'root' : 'messages-items',
                    'list-item' : 'messages-item',
                    'focus-item' : 'focus-message'
                }}
                focusItemId={focusMessageId}
                listComponent={List}
                listItemComponent={ListItem}
                forwardScrollable={forwardScrollable}
                renderNewItemNotification={(show, onClick) => (
                    <NewItemNotification className='messages-notification' show={show} onClick={onClick} />)}
                renderItem={renderMessage}
            />
        )
    }, [renderMessage, focusMessageId]);
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