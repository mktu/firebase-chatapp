import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { Profile } from '../../types/profile';

type Props = {
    profiles: Profile[],
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

const Users: React.FC<Props> = ({ className, profiles }) => {
    return (
        <div className={className} >
            <UsersWrapper>
                {profiles.map(p => (
                    <Tooltip key={p.id} title={p.nickname} aria-label="chat-users">
                        <UserIcon >
                            <Avatar>{p.nickname[0]}</Avatar>
                        </UserIcon>
                    </Tooltip>

                ))}
            </UsersWrapper>
        </div>
    )
};

export default Users;