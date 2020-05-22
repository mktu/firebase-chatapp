import React, { useEffect, useState, useContext } from 'react';
import { Room } from '../../../../types/room';
import { Profile } from '../../../../types/profile';
import { ServiceContext } from '../../contexts';
import { JoinRequest } from '../../../../types/request';
import Container from './Container';
import MessageLoader from './MessageLoader';

type Props = {
    room: Room,
    show: boolean,
    className?: string,
    focusMessageId?: string,
}

const Provider: React.FC<Props> = ({
    room,
    focusMessageId,
    show
}) => {
    const { getProfiles, listenJoinRequests } = useContext(ServiceContext);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [requests, setRequests] = useState<JoinRequest[]>([]);

    useEffect(() => {
        let unsubscribed = false;
        getProfiles(room.users, (results) => {
            !unsubscribed && setProfiles(results);
        }, (cause) => {
            console.error(cause)
        })
        return () => {
            unsubscribed = true;
        }
    }, [room.users,getProfiles]);

    useEffect(() => {
        let unsubscribe: ReturnType<typeof listenJoinRequests> = () => { };
        let unsubscribed = false;
        unsubscribe = listenJoinRequests(room.id, (added) => {
            if (added.length > 0) {
                !unsubscribed && setRequests(reqs => [...reqs, ...added.filter(r=>r.status==='requesting')]);
            }
        }, (modified) => {
            !unsubscribed && setRequests(reqs => reqs.map(req => {
                const found = modified.find(r => r.id === req.id);
                if (found) {
                    return found;
                }
                return req;
            }));
        }, (deleted) => {
            !unsubscribed && setRequests(reqs => reqs.filter(req => {
                return !deleted.find(r => r.id === req.id);
            }))
        })

        return () => {
            unsubscribed = true;
            unsubscribe();
        };
    }, [room.id, setRequests,listenJoinRequests]);

    return (
        <MessageLoader
            messageId={focusMessageId}
            roomId={room.id}
        >
            {(messages, readMore, backwardListenable, forwardListenable) => (
                <Container
                    messages={messages}
                    readMore={readMore}
                    backwardListenable={backwardListenable}
                    forwardListenable={forwardListenable}
                    profiles={profiles}
                    room={room}
                    focusMessageId={focusMessageId}
                    show={show}
                    requests={requests}
                />
            )}
        </MessageLoader>
    )
}


export default Provider;