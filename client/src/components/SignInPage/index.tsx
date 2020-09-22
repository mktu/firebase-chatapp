import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import useSignInState from './useSignInState';
import { DefaultSize, MobileSize } from '../../utils/responsive';
import { ChatApp } from '../Gif';

type Props = {
    onSucceeded: () => JSX.Element
};

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    max-width : 100%;
    >div{
        display : flex;
        flex-direction : column;
        justify-content : center;
    }
`;

const TitleWrapper = styled.div`
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
`;

const ButtonWrapper = styled.div`
    margin-top : 1rem;
    display : flex;
    justify-content : center;
`;

const List = styled.ul`
    list-style: none;
    padding : 0;
    margin-bottom : ${({ theme }) => `${theme.spacing(3)}px`};
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    max-width : 100%;
   

`

const SignInPage: React.FC<Props> = ({
    onSucceeded
}) => {
    const { handleGoogoleLogin, succeeded } = useSignInState();
    if (succeeded) {
        localStorage.setItem('lastContact', '');
        localStorage.setItem('lastRoom', '');
        return onSucceeded();
    }
    return (
        <Wrapper>
            <div>
                <TitleWrapper>
                    <Typography variant='h6'>A simple chat app</Typography>
                </TitleWrapper>
                <List>
                    <li>You can chat directly with your friends.</li>
                    <li>If you create a <b>Chat Room</b>, you can discuss with members in the room.</li>
                </List>
                <DefaultSize>
                    <ChatApp width='500' />
                </DefaultSize>
                <MobileSize>
                    <ChatApp width='400' />
                </MobileSize>
                <ButtonWrapper>
                    {/* {
                        <Button onClick={handleAnonymousLogin} variant='contained' color='secondary'>SIGNUP WITH ANONYMOUS</Button>
                    } */}
                    <Button onClick={handleGoogoleLogin} variant='contained' color='secondary'>SIGNUP WITH GOOGLE</Button>
                </ButtonWrapper>
            </div>
        </Wrapper>
    )
};

export default SignInPage;