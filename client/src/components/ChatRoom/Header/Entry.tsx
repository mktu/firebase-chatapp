import React, { useContext } from 'react';
import { RequestsLoader } from '../Loader';
import { ChatroomContext } from '../ChatroomContext';
import Default from './Default';
import Contact from './Contact';

type Props = {
    owner: boolean,
    className?: string,
}

const Entry: React.FC<Props> = (props) => {
    const room = useContext(ChatroomContext);
    if (room.contact) {
        return (
            <Contact
                className={props.className}
                room={room}
            />
        )
    }
    return (
        <RequestsLoader room={room}>
            {(requests) => (
                <Default
                    room={room}
                    requests={requests}
                    {...props}
                />
            )}
        </RequestsLoader>
    )
};

export default Entry;