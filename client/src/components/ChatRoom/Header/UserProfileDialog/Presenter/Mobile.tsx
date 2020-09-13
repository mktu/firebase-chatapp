import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { Spin1s200pxIcon } from '../../../../Icons';

import { Profile } from '../../../../../../../types/profile';

const ContentWrapper = styled(DialogContent)`
    padding : ${({ theme }) => `${theme.spacing(2)}px`};
    > .main {
        display : flex;
        justify-content : center;
        flex-direction : column;
        align-items : center;
        
    }
    > .footer{
        display : flex;
        align-items : center;
        justify-content : center;
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const Description = styled.div`
    display : flex;
    align-items: center;
    justify-content : center;
    flex-direction : column;
    > .actions{
        display : flex;
        align-items : center;
        > .button{
            margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
        }
        > .loading{
            margin-left : ${({ theme }) => `${theme.spacing(1)}px`};
        }
        
    }
    > .error{
        color:${({ theme }) => `${theme.palette.error.main}`};
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;


const ProfileWrapper = styled.div`
    width : 100px;
    height : 100px;
    border-radius : 50%;
    overflow:hidden;
    display:flex;
    align-items:center;
`;
const ProfileImage = styled.img`
    width : 100px;
    height: 100px;
    object-fit: cover;
`;

export type Props = {
    profile: Profile,
    className?: string,
    onClose: () => void,
    button: React.ReactElement,
    error?: string,
    loading: boolean
}

function Presenter({
    profile,
    className,
    onClose,
    button,
    error,
    loading
}: Props) {

    return (
        <div className={className} >
            <ContentWrapper>
                <div className='main'>
                    <ProfileWrapper>
                        <ProfileImage src={profile.imageUrl || `https://via.placeholder.com/200?text=${profile.nickname}`} />
                    </ProfileWrapper>
                    <Description>
                        <Typography variant='h5'> {profile.nickname} </Typography>
                        <Typography variant='subtitle1'> ID : {profile.id} </Typography>
                        <div className='actions'>
                            <div className='button'>
                                {button}
                            </div>
                            {loading && (
                                <div className='loading'>
                                    <Spin1s200pxIcon width='50' />
                                </div>
                            )}

                        </div>
                        {error && (
                            <div className='error'>
                                {error}
                            </div>
                        )}

                    </Description>
                </div>
                <div className='comment'>

                </div>
                <div className='footer'>
                    <Button variant='contained' onClick={onClose}>
                        CLOSE
                    </Button>
                </div>
            </ContentWrapper>

        </div >)
};



export default Presenter;