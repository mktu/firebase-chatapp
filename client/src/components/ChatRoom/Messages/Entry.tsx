import React, { useContext, useMemo } from 'react';
import { MessageLoader } from '../Loader';
import Container from './Container';
import { ChatroomContext } from '../ChatroomContext';

export type Props = {
    className?: string,
    show: boolean,
    focusMessageId?: string,
};

const Entry: React.FC<Props> = ({
    className,
    show,
    focusMessageId
}) => {

    const { id } = useContext(ChatroomContext);
    const component = useMemo(() => (
        <MessageLoader
            roomId={id}
            messageId={show ? focusMessageId : undefined}
        >
            {(args) => (
                <Container
                    className={className}
                    roomId={id}
                    focusMessageId={focusMessageId}
                    show={show}
                    {...args}
                />
            )}
        </MessageLoader>
    ),[id,show,focusMessageId,className])
    return component;
}


export default Entry;