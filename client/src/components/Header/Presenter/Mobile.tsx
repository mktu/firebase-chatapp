import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import ToolbarBase from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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

export type Props = {
    profileLoaded: boolean,
    handleLogout: () => void,
    onClickApp: () => void,
    searchBox: React.ReactElement,
    user: React.ReactElement,
    onClickMenu: ()=>void,
}

function Presenter({
    profileLoaded,
    handleLogout,
    searchBox,
    user,
    onClickMenu
}: Props) {
    return (
        <AppBar position="static">
            <Toolbar>
                <div>
                    <IconButton color='inherit' onClick={onClickMenu}><MenuIcon color='inherit'/></IconButton>
                </div>
                {searchBox}
                <div>
                    {profileLoaded && (
                        <LoginMenu>
                            {user}
                            <Button color='inherit' onClick={handleLogout}>LOG OUT</Button>
                        </LoginMenu>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    )
}


export default Presenter;