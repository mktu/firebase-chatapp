import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

const Divider = styled.div`
    border-bottom : ${({ theme }) => `1px solid ${theme.palette.divider}`};
`;

const Paper = styled(PaperBase)`
    width : 60%;
    & > .title{
        padding : ${({ theme }) => `${theme.spacing(0.5)}px ${theme.spacing(1)}px`};
    }
    & > .content{
        margin-bottom : 1rem;
        margin-top : 1rem;
        padding : 1rem;
    }
    & > .content > .notification {
        margin-top : 1rem;
    }
    & > .content > .text{
        margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    & > .submit-actions{
        display : flex;
        justify-content : flex-end;
        padding : 1rem;
    }
`

type Props = {
    onChangeNickname: (e: React.ChangeEvent<HTMLInputElement>) => void,
    nickname: string,
    registrable: boolean,
    notification: React.ReactElement,
    avatar: React.ReactElement,
    onSubmit: () => void,
    title: string,
    id?: string
    className?: string,
}

const Presenter: React.FC<Props> = ({
    notification,
    avatar,
    registrable,
    onSubmit,
    onChangeNickname,
    nickname,
    className,
    id,
    title
}) => {
    return (
        <Wrapper className={className}>
            <Paper>
                <div className='title'>
                    <Typography variant='subtitle1'>{title}</Typography>
                </div>
                <Divider />
                {avatar}
                <Divider />
                <div className='content'>
                    <TextField className='text' disabled value={id} fullWidth label="ID" />
                    <TextField className='text' onChange={onChangeNickname} value={nickname} required fullWidth label="Nick Name" />
                    {notification}
                </div>
                <div className='submit-actions'>
                    <Button disabled={!registrable} onClick={onSubmit} variant='contained' color='secondary'>SUBMIT</Button>
                </div>
            </Paper>
        </Wrapper>
    )
}

export default Presenter;