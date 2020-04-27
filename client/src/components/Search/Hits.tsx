import React from 'react';
import styled from 'styled-components';
import { InfiniteHitsProvided } from 'react-instantsearch-core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {ScrollDownList} from '../InfiniteScrollable';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Message } from '../../../../types/message';

const Wrapper = styled.div`
    overflow-x : hidden;
    overflow-y : scroll;
`;

type PropsType = {
    onSelect: (roomId: string, messageId: string) => void,
    className?: string
} & InfiniteHitsProvided<Message>;

const Hits: React.FC<PropsType> = ({
    hasMore,
    refineNext,
    hits,
    onSelect,
    className
}) => {
    return (
        <Wrapper className={className}>
            <ScrollDownList
                items={hits}
                hasNewerItems={false}
                hasOlderItems={hasMore}
                loadMore={(toNewer) => {
                    toNewer && hasMore && refineNext()
                }}
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
            </ScrollDownList>
        </Wrapper>
    )
};

export default Hits;