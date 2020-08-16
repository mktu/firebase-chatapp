import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Popover from '@material-ui/core/Popover';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import { ServiceContext } from '../../../contexts';
import { Profile } from '../../../../../types/profile';
import { ChatroomContext } from '../ChatroomContext';
import { Spin1s200pxIcon } from '../../Icons';

const Wrapper = styled.div`
    width : 300px;
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    > .actions{
        display : flex;
        align-items : center;
        padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
    > .title{
        padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
    > .search-result{
        display : flex;
        align-items : center;
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
        margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
        padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
    > .result{
        display : flex;
        justify-content : flex-end;
        padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
`;

const SearchIconButton = styled(IconButton)`
    margin : 0;
    padding : 1px;
    color : rgba(255,255,255,0.54); 
`;

const HitUser = styled.div`
    display : flex;
    align-items : center;
    width : 100%;
    > .last-item{
        margin-left : auto;
    }
`;

const InputWrapper = styled.div`
    display : flex;
    align-items : center;
    border-radius : 5px;
    width : 100%;
    background-color : #272C34;
    color : white;
    padding : ${({ theme }) => `${theme.spacing(0.1)}px ${theme.spacing(1)}px`};
`;

const SearchError = styled.div`
    color : ${({ theme }) => `${theme.palette.error.main}`};
`;

const StyledInput = styled(InputBase)`
    color : white;
`;

const CustomAvatar = styled(Avatar)`
    width: ${({ theme }) => `${theme.spacing(3)}px`};
    height: ${({ theme }) => `${theme.spacing(3)}px`};
    font-size : 15px;
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
`;

type Props = {
    onClose: () => void,
    link: string,
};

export function ShareLinkContainer({
    onClose,
    link,
}: Props) {
    const room = useContext(ChatroomContext);
    const [coppied, setCoppied] = useState(false);
    const [profileId, setProfileId] = useState('');
    const [searchUser, setSearchUser] = useState<Profile>();
    const [searchUserError, setSearchUserError] = useState('');
    const [searchingUser, setSearchingUser] = useState(false);
    const { searchProfileById, modifyRoom } = useContext(ServiceContext);
    return (

        <Wrapper>
            <div className='title'>
                <Typography variant='subtitle1'>INVITE FRIENDS</Typography>
                <Typography variant='body1'>Input the your friend ID</Typography>
            </div>
            <div className='actions'>
                <InputWrapper>
                    <StyledInput fullWidth onChange={(e) => {
                        setProfileId(e.target.value);
                    }} />
                    <SearchIconButton onClick={() => {
                        if(!profileId){
                            return;
                        }
                        searchProfileById(profileId, (p) => {
                            setSearchUser(p);
                            setSearchingUser(false);
                            setSearchUserError('');
                        }, (e) => {
                            setSearchUserError(e.message);
                            setSearchingUser(false);
                        })
                        setSearchingUser(true);
                    }}>
                        <SearchIcon />
                    </SearchIconButton>
                </InputWrapper>
            </div>
            <div className='search-result'>
                {searchingUser ? (
                    <Spin1s200pxIcon width='50' />
                ) : Boolean(searchUserError) ? (
                    <SearchError>{searchUserError}</SearchError>
                ) : searchUser ? (
                    <HitUser>
                        <CustomAvatar src={searchUser?.imageUrl}>
                            {searchUser.nickname[0]}
                        </CustomAvatar>
                        <div>{searchUser.nickname}</div>
                        <div className='last-item'>
                            <Button color='secondary' variant='outlined' disabled={room.users.includes(searchUser.id)}
                                onClick={() => {
                                    modifyRoom({
                                        ...room,
                                        users: [...room.users, searchUser.id]
                                    }, () => {
                                        onClose();
                                    })
                                }}
                            >
                                ADD
                            </Button>
                        </div>

                    </HitUser>
                ) : <div />}
            </div>

            <div className='title'>
                <Typography variant='body1'>Or give this link to your friends</Typography>
            </div>
            <div className='actions'>
                <InputWrapper>
                    <StyledInput fullWidth value={link} />
                </InputWrapper>
                <Tooltip title='Copy a link'>
                    <IconButton onClick={() => {
                        if (navigator.clipboard && !coppied) {
                            navigator.clipboard.writeText(link);
                            setCoppied(true);
                            setTimeout(() => {
                                setCoppied(false);
                            }, 5000);
                        }
                    }}><FileCopyIcon /></IconButton>
                </Tooltip>
            </div>
            <div className='result'>
                {coppied && (
                    <Typography color='secondary' variant='caption'>COPPIED!</Typography>
                )}
            </div>
        </Wrapper>
    );
};

type PopperProps = {
    onClose: () => void,
    anchor: HTMLElement | null,
    children: React.ReactElement
};

export function ShareLinkPortalPopover({
    anchor,
    onClose,
    children,
}: PopperProps) {
    return (
        <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            {children}
        </Popover>)
};