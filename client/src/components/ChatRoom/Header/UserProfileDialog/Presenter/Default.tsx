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
        
    }
    > .footer{
        display : flex;
        align-items : center;
        justify-content : center;
    }
`;

const Description = styled.div`
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
    width : 150px;
    height : 150px;
    border-radius : 50%;
    overflow:hidden;
    display:flex;
    align-items:center;
    margin-right : ${({ theme }) => `${theme.spacing(4)}px`};
`;
const ProfileImage = styled.img`
    width : 150px;
    height: 150px;
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