import React, { useCallback } from 'react';
import Presenter from './Presenter';
import { Room } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import { modifyRoom } from '../../../services/room';

const EditUserContainer: React.FC<{
    room: Room,
    profiles: Profile[],
    className?: string,
    onClose: () => void,
    show: boolean,
    owner : boolean
}> = ({
    room,
    profiles,
    onClose,
    show,
    owner,
    className
}) => {
        const onDelete = useCallback((profileId: string) => {
            modifyRoom({
                ...room,
                users: profiles.filter(p => p.id !== profileId).map(p => p.id)
            })
        }, [profiles,room]);

        return <Presenter
            show={show}
            onClose={onClose}
            className={className}
            profiles={profiles}
            onDelete={onDelete}
            owner={owner}
        />;
    }

    export default EditUserContainer;