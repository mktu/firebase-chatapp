import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useRegisterProfileState, useUpdateProfileState} from '../../hooks/useProfileState';

type Props = {
    isUpdate? : Boolean 
}

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const Paper = styled(PaperBase)`
    width : 60%;
    padding : 1rem;
`

const TextInputWrapper = styled.div`
    margin-bottom : 1rem;
    margin-top : 1rem;
`;

const ButtonWrapper = styled.div`
    display : flex;
    justify-content : flex-end;
`;

export const RegisterProfilePage : React.FC<{
    onSucceeded : ()=> JSX.Element
}> = ({
    onSucceeded
}) =>{
    const { onChangeNickname, nickname, registerProfile,registrable, succeeded } = useRegisterProfileState();
    if(succeeded){
        return onSucceeded();
    }
    return (
        <Wrapper>
            <Paper>
                <Typography variant='subtitle1'>Register your profile</Typography>
                <TextInputWrapper>
                    <TextField onChange={onChangeNickname} value={nickname} required fullWidth label="Nick Name" />
                </TextInputWrapper>
                <ButtonWrapper>
                    <Button disabled={!registrable} onClick={registerProfile} variant='contained' color='secondary'>SUBMIT</Button>
                </ButtonWrapper>
            </Paper>
        </Wrapper>
    )
}

export const UpdateProfilePage = () =>{
    const { onChangeNickname, nickname, updateProfile,updatable } = useUpdateProfileState();
    return (
        <Wrapper>
            <Paper>
                <Typography variant='subtitle1'>Update your profile</Typography>
                <TextInputWrapper>
                    <TextField onChange={onChangeNickname} value={nickname} required fullWidth label="Nick Name" />
                </TextInputWrapper>
                <ButtonWrapper>
                    <Button disabled={!updatable} onClick={updateProfile} variant='contained' color='secondary'>SUBMIT</Button>
                </ButtonWrapper>
            </Paper>
        </Wrapper>
    )
}