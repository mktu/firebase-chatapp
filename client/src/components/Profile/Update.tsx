import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Notification from './Notification';
import { useUpdateProfileState } from './useProfileState';
import { Wrapper, Paper } from './Common';

const UpdateProfilePage : React.FC<{
    className?:string
}> = ({
    className
}) => {
    const {
        onChangeNickname,
        nickname,
        updateProfile,
        updatable,
        notifiable,
        onLoadToken,
        onSwitchNotifiable
    } = useUpdateProfileState();
    return (
        <Wrapper className={className}>
            <Paper>
                <Typography variant='subtitle1'>Update your profile</Typography>
                <div className='content'>
                    <Notification className='notification' notifiable={notifiable} onLoadToken={onLoadToken} onSwitchNotifiable={onSwitchNotifiable}/>
                    <TextField onChange={onChangeNickname} value={nickname} required fullWidth label="Nick Name" />
                </div>
                <div className='submit-actions'>
                    <Button disabled={!updatable} onClick={updateProfile} variant='contained' color='secondary'>SUBMIT</Button>
                </div>
            </Paper>
        </Wrapper>
    )
}

export default UpdateProfilePage;