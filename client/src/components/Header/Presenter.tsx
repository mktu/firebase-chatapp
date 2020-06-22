import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import ToolbarBase from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Person } from '@material-ui/icons';

const Toolbar = styled(ToolbarBase)`
    & > :last-child{
        margin-left : auto;
    }
`;

const LoginMenu = styled.div`
    display : flex;
    align-items : center;
    & >.login-button{
        display : flex;
        align-items : center;
        > .login-button-icon{
            margin-right : ${({ theme }) => `${theme.spacing(0.5)}px`};
        }
    }
`;

const AppButton = styled(ButtonBase)`
    font-size : ${({ theme }) => `${theme.typography.h6.fontSize}`};
    font-weight : ${({ theme }) => `${theme.typography.h6.fontWeight}`};
    font-family : ${({ theme }) => `${theme.typography.h6.fontFamily}`};
    display : block;
    padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    border-radius : 5px;
`;

function Presenter<T extends {
    nickname: string
}>({
    profile,
    handleLogout,
    jumpToProfile,
    onClickApp,
    searchBox
}: {
    profile: T | null,
    handleLogout: () => void,
    jumpToProfile: () => void,
    onClickApp : ()=>void,
    searchBox : React.ReactElement
}) {
    return (
        <AppBar position="static">
            <Toolbar>
                <AppButton onClick={onClickApp}>
                    Chat App
                </AppButton>
                {searchBox}
                <div>
                    {profile && (
                        <LoginMenu>
                            <Button color='inherit' onClick={jumpToProfile} className='login-button'>
                                <Person className='login-button-icon' />
                                {profile.nickname}
                            </Button>
                            <Button color='inherit' onClick={handleLogout}>LOG OUT</Button>
                        </LoginMenu>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    )
}


export default Presenter;