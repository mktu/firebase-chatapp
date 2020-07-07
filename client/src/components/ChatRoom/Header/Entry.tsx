import React, {useContext} from 'react';
import { RequestsLoader } from '../Loader';
import { ChatroomContext } from '../ChatroomContext';
import Container from './Container';

type Props = {
    owner: boolean,
    className?: string,
}

const Entry: React.FC<Props> = (props) => {
    const room = useContext(ChatroomContext);
    return (
        <RequestsLoader room={room}>
            {(requests) => (
                <Container
                    room={room}
                    requests={requests}
                    {...props}
                />
            )}
        </RequestsLoader>
    )
};

export default Entry;