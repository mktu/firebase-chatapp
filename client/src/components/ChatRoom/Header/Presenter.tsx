import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import TextField from '@material-ui/core/TextField';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

const MAX_PROFILE_COUNT = 5;

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : space-between;

    > .room-name{
    display : flex;
    align-items : start;
    align-items : center;
        > .edit-roomname-button{
            margin : 0 0 5px 5px;
            padding : 1px;
            > .edit-roomname-icon{
                font-size : 15px;
            }
        }
    }

    > .menu-icons {
        display : flex;
        justify-content : flex-end;
        > .join-request-icon {
            margin :  0 ${({ theme }) => `${theme.spacing(1)}px`} 0 0;
            padding : 1px;
            border-radius : 5px;
            > span {
                font-size : 15px;
                display : inline-block;
                padding-left : ${({ theme }) => `${theme.spacing(1)}px`};
                color : ${({ theme }) => `${theme.palette.secondary.main}`};
            }
        }
        > .user-icon {
            margin : 0;
            padding : 1px;
        }
    }
`;

const CustomAvatar = styled(Avatar)`
    width: ${({ theme }) => `${theme.spacing(3)}px`};
    height: ${({ theme }) => `${theme.spacing(3)}px`};
    font-size : 15px;
`;

function HeaderPresenter<T extends {
    nickname: string,
    id: string
}>({
    roomName,
    profiles,
    className,
    requestCount,
    nameEditable,
    owner,
    onClickShowMoreUser,
    onClickEditName,
    onChangeRoomName
}: {
    roomName: string,
    profiles: T[],
    className?: string,
    nameEditable: boolean,
    requestCount: number,
    owner: boolean,
    onClickEditName: (editable: boolean) => void,
    onClickShowMoreUser: () => void,
    onChangeRoomName : (roomName:string) => void
}) {
    return (
        <Wrapper className={className} >
            <div className='room-name'>
                {owner && nameEditable ? (
                    <TextField value={roomName} onChange={(e)=>{
                        onChangeRoomName(e.target.value);
                    }}/>
                ) : (
                        <Typography variant='h6' >{roomName}</Typography>
                    )}
                {owner && (
                    <React.Fragment>{
                        nameEditable ? (
                            <IconButton className='edit-roomname-button' onClick={() => { onClickEditName(false) }}>
                                <CheckCircleOutlineIcon fontSize='small' className='edit-roomname-icon' />
                            </IconButton>
                        ) : (
                                <IconButton className='edit-roomname-button' onClick={() => { onClickEditName(true) }}>
                                    <EditIcon fontSize='small' className='edit-roomname-icon' />
                                </IconButton>
                            )
                    }</React.Fragment>
                )}
            </div>
            <div className='menu-icons'>
                {owner && requestCount > 0 && (
                    <Tooltip title={`${requestCount} join requests`} aria-label="join-requests">
                        <IconButton className='join-request-icon'>
                            <RecordVoiceOverIcon color='secondary' />
                            <span>
                                {requestCount}
                            </span>
                        </IconButton>
                    </Tooltip>
                )}
                {profiles.slice(0, MAX_PROFILE_COUNT).map(p => (
                    <Tooltip key={p.id} title={p.nickname} aria-label="chat-users">
                        <IconButton className='user-icon'>
                            <CustomAvatar className='user-avatar'>{p.nickname[0]}</CustomAvatar>
                        </IconButton>
                    </Tooltip>
                ))}
                <IconButton className='user-icon' onClick={onClickShowMoreUser}>
                    <KeyboardArrowRightIcon className='user-avatar' />
                </IconButton>
            </div>
        </Wrapper >
    )
};

export default HeaderPresenter;