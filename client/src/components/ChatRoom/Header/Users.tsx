import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const MAX_PROFILE_COUNT = 5;

const UsersWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
    justify-content : flex-end;
    & > .user-icon{
        margin : 0;
        padding : 1px;
    }
`;

const CustomAvatar = styled(Avatar)`
    width: ${({ theme }) => `${theme.spacing(3)}px`};
    height: ${({ theme }) => `${theme.spacing(3)}px`};
    font-size : 15px;
`;

function Users<T extends { id: string, nickname: string }>({
    className,
    profiles,
    onClickMore
}: {
    profiles: T[],
    onClickMore: () => void,
    className?: string,
}) {
    return (
        <div className={className} >
            <UsersWrapper>
                {profiles.slice(0, MAX_PROFILE_COUNT).map(p => (
                    <Tooltip key={p.id} title={p.nickname} aria-label="chat-users">
                        <IconButton className='user-icon'>
                            <CustomAvatar className='user-avatar'>{p.nickname[0]}</CustomAvatar>
                        </IconButton>
                    </Tooltip>
                ))}
                <IconButton className='user-icon' onClick={onClickMore}>
                    <KeyboardArrowRightIcon className='user-avatar' />
                </IconButton>
            </UsersWrapper>
        </div>
    )
}

export default Users;