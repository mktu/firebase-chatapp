import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import ToolbarBase from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Person } from '@material-ui/icons';
import useHeaderState from '../../hooks/useHeaderState';

const Toolbar = styled(ToolbarBase)`
    & > :last-child{
        margin-left : auto;
    }
`;

const LoginMenu = styled.div`
    display : flex;
    align-items : center;
`;

const ProfileButton = styled(Button)`
    display : flex;
    align-items : center;
`;

const PersonIcon = styled(Person)`
    margin-right : ${({ theme }) => `${theme.spacing(0.5)}px`};
`;

export default () => {
    const { profile, handleLogout, jumpToProfile } = useHeaderState();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant='h6'>Chat App</Typography>
                <div>
                    {profile && (
                        <LoginMenu>
                            <ProfileButton color='inherit' onClick={jumpToProfile}>
                                <PersonIcon />
                                {profile.nickname}
                            </ProfileButton>
                            <Button color='inherit' onClick={handleLogout}>LOG OUT</Button>
                        </LoginMenu>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    )
};