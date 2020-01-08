import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import ToolbarBase from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Person } from '@material-ui/icons';
import useHeaderState from '../../hooks/useHeaderState';

const Wrapper = styled.div`
`;

const Toolbar = styled(ToolbarBase)`
    & > :last-child{
        margin-left : auto;
    }
`;

const LoginMenu = styled.div`
    display : flex;
    align-items : center;
`;

const Nickname = styled(Typography)`
    display : flex;
    align-items : center;
    margin-right : ${({ theme }) => `${theme.spacing(2)}px`};
`;

const PersonIcon = styled(Person)`
    margin-right : ${({ theme }) => `${theme.spacing(0.5)}px`};
`;

export default () => {
    const { profile, handleLogout } = useHeaderState();
    return (
        <Wrapper>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant='h6'>Chat App</Typography>
                    <div>
                        {profile && (
                            <LoginMenu>
                                <Nickname>
                                    <PersonIcon />
                                    {profile.nickname}</Nickname>
                                <Button color='inherit' onClick={handleLogout}>LOG OUT</Button>
                            </LoginMenu>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
        </Wrapper>
    )
};