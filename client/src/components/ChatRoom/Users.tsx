import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { Room } from '../../types/room';
import { ProfilesLoader } from '../Loaders/ProfileLoader';

type Props = {
    room: Room,
    className?: string,
};

const UsersWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
    justify-content : flex-end;
`;

const UserIcon = styled(IconButton)`
    margin : 0;
    padding : 1px;
`;

const Users : React.FC<Props> =({ className, room }) => {
    return (
        <div className={className} >
            <ProfilesLoader
                uids={room.users}
                fallback={() => {
                    return <div>Failed to retrieve users</div>
                }}
                loading={() => {
                    return <div>Loading users...</div>
                }}
            >
                {(profiles) => {
                    return <UsersWrapper>
                        {profiles.map(p => (
                            <Tooltip title={p.nickname} aria-label="chat-users">
                                <UserIcon key={p.id}>
                                    <Avatar>{p.nickname[0]}</Avatar>
                                </UserIcon>
                            </Tooltip>

                        ))}
                    </UsersWrapper>
                }}
            </ProfilesLoader>
        </div>
    )
};

export default Users;