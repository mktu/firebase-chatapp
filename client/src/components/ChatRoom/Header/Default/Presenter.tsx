import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Tooltip from '@material-ui/core/Tooltip';

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
        > .menu-share{
            border-right : 1.5px solid ${({ theme }) => `${theme.palette.divider}`};
            margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
            padding-right : ${({ theme }) => `${theme.spacing(0.5)}px`};
        }
        > .menu-users{
            border-right : 1.5px solid ${({ theme }) => `${theme.palette.divider}`};
            margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
            padding-right : ${({ theme }) => `${theme.spacing(1)}px`};
        }
    }
`;

const MenuIconButton = styled(IconButton)`
    margin : 0;
    padding : 1px;
`;

type Props = {
    roomName: string,
    className?: string,
    requestCount: number,
    owner: boolean,
    avatars: React.ReactElement,
    onClickShare: (e: React.MouseEvent<HTMLButtonElement>) => void,
    onClickRequest: (e: React.MouseEvent<HTMLButtonElement>) => void,
    onClickSetting: () => void
}

function HeaderPresenter({
    roomName,
    className,
    requestCount,
    owner,
    avatars,
    onClickShare,
    onClickRequest,
    onClickSetting
}: Props) {
    return (
        <Wrapper className={className} >
            <div className='room-name'>
                <Typography variant='h6' >{roomName}</Typography>
            </div>
            <div className='menu-icons'>
                <div className='menu-share'>
                    <Tooltip title={`Invite user`}>
                        <MenuIconButton onClick={onClickShare}>
                            <PersonAddIcon />
                        </MenuIconButton>
                    </Tooltip>
                </div>
                {owner && requestCount > 0 && (
                    <Tooltip title={`${requestCount} join requests`} aria-label="join-requests">
                        <IconButton className='join-request-icon' onClick={onClickRequest}>
                            <RecordVoiceOverIcon color='secondary' />
                            <span>
                                {requestCount}
                            </span>
                        </IconButton>
                    </Tooltip>
                )}
                <div className="menu-users">{avatars}</div>
                {owner && (
                    <div>
                        <MenuIconButton onClick={onClickSetting}>
                            <SettingsIcon />
                        </MenuIconButton>
                    </div>
                )}
            </div>
        </Wrapper >
    )
};

export default HeaderPresenter;