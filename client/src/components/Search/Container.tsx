import React, { useState, useEffect, useContext, useCallback } from 'react';
import algoliasearch from 'algoliasearch';
import { connectInfiniteHits, connectSearchBox, connectHighlight, connectMenu } from 'react-instantsearch-dom';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import ProfileContext from '../../contexts/ProfileContext';
import SearchBoxComponent from './SearchBox';
import HitsComponent from './Hits';
import HighlightComponent from './Highlight';
import MenuComponent from './Menu';
import Presenter from './Presenter';
import Refinements from './Refinements';
import { Room } from '../../../../types/room'
import { Profile } from '../../../../types/profile'
import { getRoomsBelongs } from '../../services/room';
import { getProfiles } from '../../services/profile';

const searchClient = process.env.REACT_APP_ALGOLIA_APP_ID && process.env.REACT_APP_ALGOLIA_API_KEY &&
    algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);

const SearchBox = connectSearchBox(SearchBoxComponent);
const Hits = connectInfiniteHits(HitsComponent);
const HighlightHit = connectHighlight(HighlightComponent);
const Menu = connectMenu(MenuComponent);

type Item = { count: number; isRefined: boolean; label: string; value: string };

const Container: React.FC<{
    onSelecRoom : (roomId:string, messageId:string, isContact: boolean)=>void
    keyword?: string,
    className?: string
}> = ({
    keyword,
    className,
    onSelecRoom
}) => {
        const { profileState } = useContext(ProfileContext);
        const { profile } = profileState;
        const [rooms, setRooms] = useState<Room[]>([]);
        const [profiles, setProfiles] = useState<Profile[]>([]);

        useEffect(() => {
            if (profile) {
                getRoomsBelongs(profile.id, (rooms) => {
                    setRooms(rooms);
                })
            }
        }, [profile]);

        useEffect(() => {
            if (rooms.length > 0) {
                const uids = Array.from(
                    new Set(
                        rooms.reduce((users, cur) => {
                            return [...users, ...cur.users];
                        }, [] as string[])));
                getProfiles(uids, (items) => {
                    setProfiles(items);
                })
            }
        }, [rooms])

        const renderRoomMenu = useCallback((style?: string) => rooms.length > 0 ? (
            <Menu
                className={style}
                attribute='roomId'
                label='SELECT ROOM'
                transformItems={(items: Item[]) => {
                    return items.map(item => {
                        const room = rooms.find(room => room.id === item.label);
                        if (room) {
                            return {
                                ...item,
                                label: room.roomName,
                                value: room.id
                            }
                        }
                        return item;
                    })
                }}
            />
        ) : (<div>...</div>), [rooms]);

        const renderSenderMenu = useCallback((style?: string) => (
            <Menu
                className={style}
                attribute='senderId'
                label='SELECT SENDER'
                transformItems={(items: Item[]) => {
                    return items.map(item => {
                        const pro = profiles.find(p => p.id === item.label);
                        if (pro) {
                            return {
                                ...item,
                                label: pro.nickname,
                                value: pro.id
                            }
                        }
                        return null;
                    }).filter(Boolean)
                }}
            />
        ), [profiles]);
        if(rooms.length === 0){
            return <div/>
        }
        return (<InstantSearch searchClient={searchClient} indexName='messages'>
            <Configure
                filters={rooms.map(r => {
                    return `roomId:${r.id}`;
                }).join(' OR ')}
            />
            <Presenter
                className={className}
                renderRefinements={(style) => (
                    <Refinements
                        className={style}
                        renderSearchBox={(style) => (
                            <SearchBox className={style} keyword={keyword} />
                        )}
                        renderRoomMenu={renderRoomMenu}
                        renderSenderMenu={renderSenderMenu}
                    />
                )}
                renderHits={(style) => (
                    <Hits
                        className={style}
                        highlight={(hit, attribute) => (
                            <HighlightHit
                                hit={hit}
                                attribute={attribute}
                            />
                        )}
                        onSelect={(roomId, messageId) => {
                            const isContact = Boolean(rooms.find(r=>r.id===roomId && Boolean(r.contact)))
                            onSelecRoom(roomId, messageId,isContact)
                        }}
                    />
                )}
            />
        </InstantSearch>)
    }

export default Container;