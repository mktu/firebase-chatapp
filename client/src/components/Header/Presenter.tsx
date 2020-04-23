import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import ToolbarBase from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Person } from '@material-ui/icons';
import SearchBox from './SearchBox';

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

function Presenter<T extends {
    nickname: string
}>({
    profile,
    handleLogout,
    jumpToProfile,
    handleSubmit
}: {
    profile: T | null,
    handleLogout: () => void,
    jumpToProfile: () => void,
    handleSubmit:(text:string)=>void
}) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant='h6'>Chat App</Typography>
                <SearchBox className='search-box' handleSubmit={handleSubmit}/>
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