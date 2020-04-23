import React from 'react';
import styled from 'styled-components';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { InfiniteHitsProvided } from 'react-instantsearch-core';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InfiniteScroll from '../InfiniteScrollable';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Message } from '../../../../types/message';

const Wrapper = styled(Paper)`
    height : 60vh;
    width : 100%;
    overflow-x : hidden;
    overflow-y : scroll;
`;

type PropsType = {
    onSelect: (roomId: string, messageId: string) => void
} & InfiniteHitsProvided<Message>;

const Hits: React.FC<PropsType> = ({
    hasMore,
    refineNext,
    hits,
    onSelect
}) => {
    return (
        <Wrapper>
            <InfiniteScroll
                items={hits}
                hasNewerItems={hasMore}
                loadMore={(toNewer) => {
                    toNewer && hasMore && refineNext()
                }}
                hasOlderItems={false}
                listComponent={List}
            >
                {(hit) => {
                    return (
                        <ListItem button key={hit.id} onClick={() => {
                            onSelect(hit.roomId, hit.id);
                        }}>
                            <ListItemAvatar>
                                <Avatar>{hit.senderName[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary={hit.roomName}>{hit.message}</ListItemText>
                        </ListItem>)
                }}
            </InfiniteScroll>
        </Wrapper>

    )
};

export default connectInfiniteHits(Hits);