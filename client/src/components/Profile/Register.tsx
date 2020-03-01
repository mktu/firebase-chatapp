import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Notification from './Notification';
import {useRegisterProfileState} from './useProfileState';
import {Wrapper, Paper} from './Common';


const RegisterProfile : React.FC<{
    onSucceeded : ()=> JSX.Element
}> = ({
    onSucceeded
}) =>{
    const { 
        onChangeNickname, 
        nickname, 
        registerProfile,
        registrable, 
        succeeded ,
        notifiable,
        onLoadToken,
        onSwitchNotifiable
    } = useRegisterProfileState();
    if(succeeded){
        return onSucceeded();
    }
    return (
        <Wrapper>
            <Paper>
                <Typography variant='subtitle1'>Register your profile</Typography>
                <div className='content'>
                    <Notification className='notification' notifiable={notifiable} onLoadToken={onLoadToken} onSwitchNotifiable={onSwitchNotifiable}/>
                    <TextField onChange={onChangeNickname} value={nickname} required fullWidth label="Nick Name" />
                </div>
                <div className='submit-actions'>
                    <Button disabled={!registrable} onClick={registerProfile} variant='contained' color='secondary'>SUBMIT</Button>
                </div>
            </Paper>
        </Wrapper>
    )
}

export default RegisterProfile;