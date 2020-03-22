import React, { useCallback, useState } from 'react';
import { Room } from '../../../../types/room';
import { JoinRequest } from '../../../../types/request';
import { modifyRoom } from '../../services/room';
import HeaderContainer from '../../components/ChatRoom/Header';
import Messages from '../../components/ChatRoom/Messages';
import SingleMessageContainer from '../../components/ChatRoom/SingleMessage';
import InputContainer from '../../components/ChatRoom/Input';
import { Presenter } from '../../components/ChatRoom/';
import { action } from '@storybook/addon-actions';

type ItemType = {id:string,date:number};

const MAX_PAGE_SIZE = 10;
const ITEM_MAX_IN_PAGE = 20;
const FULL_ITEMS = [...Array(ITEM_MAX_IN_PAGE * MAX_PAGE_SIZE).keys()].map(i => ({ id: i.toString(), date:Date.now()+i }));

const DummyLoader: React.FC<{
    children: (
        items: ItemType[],
        readMore: () => void,
        hasMore: boolean
    ) => React.ReactElement,
    latest ?: ItemType[]
}> = ({
    children,
    latest = []
}) => {
        const [page, setPage] = useState(0);
        const hasMore = page < MAX_PAGE_SIZE;
        const loadMore = () => {
            if (hasMore) {
                setTimeout(() => {
                    setPage(i => i + 1);
                }, 500);
            }
        }
        const items = [...latest,...FULL_ITEMS.slice(0, MAX_PAGE_SIZE * page)];
        return children(
            items,
            loadMore,
            hasMore,
        );
    }


export default {
    title: 'ChatRoom/Layout',
};


const Container: React.FC<{
    className?: string,
    requests : JoinRequest[]
}> = ({
    className,
    requests 
}) => {

        const owenr = true;
        const profiles=[
            { id: 'test1', nickname: 'First User', uid: 'test1' },
            { id: 'test2', nickname: 'Second User', uid: 'test2' },
            { id: 'test3', nickname: 'Third User', uid: 'test3' },
            { id: 'test4', nickname: 'Fourth User', uid: 'test4' },
            { id: 'test5', nickname: 'Fifth User', uid: 'test5' },
            { id: 'test6', nickname: 'Sixth User', uid: 'test6' },
        ];
        const profile = {id: 'test3', nickname: 'Third User', uid: 'test3'};
        const room : Room = {
            roomName : 'testroom',
            ownerId : 'test3',
            users : profiles.map(p=>p.id),
            id : '1'
        }
        const renderHeader = useCallback((style) => {
            return (
                <HeaderContainer
                    className={style}
                    owenr={owenr}
                    requests={requests}
                    room={room}
                    profiles={profiles}
                    modifyRoom={modifyRoom}
                    updateRequest={action('updateRequest')}
                />
            )
        }, [room, profiles, owenr, requests]);

        const renderMessages = useCallback((style) => {
            return (
                <Messages
                    className={style}
                    loader={(onComplete) => (
                        <DummyLoader >
                            {onComplete}
                        </DummyLoader>)}
                    renderMessage={(message:ItemType) => (<SingleMessageContainer
                        roomId={room.id}
                        profile={profile!}
                        message={{
                            id:message.id,
                            message:message.id,
                            profileId:message.id,
                            date:message.date
                        }}
                        profiles={profiles}
                        addReaction={action('add reaction')}
                    />)}
                />
            )
        }, [room, profiles, profile]);

        const renderFooter = useCallback((style) => {
            return (
                <InputContainer
                    className={style}
                    profiles={profiles}
                    profile={profile!}
                    roomId={room.id}
                    createMessage={action('createMessage')}
                />
            )
        }, [room, profiles, profile]);

        return (
            <Presenter
                className={className}
                renderHeader={renderHeader}
                renderMessages={renderMessages}
                renderFooter={renderFooter}
            />
        )
    };


export const Default = () => <Container requests={[]}/>;
export const Requests = () => <Container requests={[
    { id:'test1', nickName:'First User', date:Date.now(), status:'requesting', profileId : 'test1p'},
    { id:'test2', nickName:'Second User', date:Date.now(), status:'requesting', profileId : 'test2p'},
]}/>;

