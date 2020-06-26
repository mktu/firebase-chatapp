import React from 'react';
import { MessageLoader } from '../Loader';
import { Profile } from '../../../../../types/profile';
import Container from './Container';

export type Props = {
    className?: string,
    roomId: string,
    show: boolean,
    profile: Profile | null,
    profiles: Profile[],
    focusMessageId?: string,
};

const Entry: React.FC<Props> = ({
    className,
    roomId,
    show,
    profile,
    profiles,
    focusMessageId
}) => {

    if(!profile){
        return <div />
    }

    return (
        <MessageLoader
            roomId={roomId}
            messageId={focusMessageId}
        >
            {(args) => (
                <Container
                    className={className}
                    roomId={roomId}
                    focusMessageId={focusMessageId}
                    profile={profile}
                    profiles={profiles}
                    show={show}
                    {...args}
                />
            )}
        </MessageLoader>
    )
}


export default Entry;