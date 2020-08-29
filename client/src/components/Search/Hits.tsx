import React from 'react';
import styled from 'styled-components';
import { InfiniteHitsProvided, Hit } from 'react-instantsearch-core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { ScrollDownList } from '../InfiniteScrollable';
import { Message } from '../../../../types/message';

const Wrapper = styled.div`
    overflow-x : hidden;
    overflow-y : scroll;
`;

type PropsType = {
    className?: string
    highlight: (hit: Hit<Message>, attribute: keyof Message) => React.ReactElement,
    onSelect: (roomId: string, messageId: string) => void
} & InfiniteHitsProvided<Hit<Message>>;

const PrimaryText = styled.span`
    display : flex;
    align-items : center;
    > span {
        display : block;
    }
    > :last-child{
        margin-left : auto;
    }
`;

function Hits({
    hasMore,
    refineNext,
    hits,
    highlight,
    onSelect,
    className
}: PropsType) {
    return (
        <Wrapper className={className}>
            <ScrollDownList
                items={hits}
                uniqueKey='id'
                hasNewerItems={false}
                hasOlderItems={hasMore}
                loadMore={(toNewer) => {
                    toNewer && hasMore && refineNext()
                }}
                listComponent={List}
            >
                {hit => (
                    <ListItem button key={hit.id} onClick={() => {
                        onSelect(hit.roomId, hit.id);
                    }}>
                        <ListItemAvatar>
                            <Avatar>{hit.senderName[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText secondary={<PrimaryText>
                            <span>{hit.senderName}</span>
                            <span>{hit.roomName}</span>
                        </PrimaryText>}>
                            {highlight(hit, 'message')}
                        </ListItemText>
                    </ListItem>
                )}
            </ScrollDownList>
        </Wrapper>
    )
};

export default Hits;