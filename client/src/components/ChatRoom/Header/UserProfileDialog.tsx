import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { Profile } from '../../../../../types/profile';

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
    > .add-to-contact{
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
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
    height : auto;
`;

type Props = {
    profile?: Profile
    className?: string,
    onAddToContact: () => void,
    onClose: () => void,
    state: 'addable' | 'disabled' | 'removable'
}

function UserProfileContainer({
    profile,
    className,
    onAddToContact,
    onClose,
    state
}: Props) {
    return profile ? (
        <div className={className} >
            <ContentWrapper>
                <div className='main'>
                    <ProfileWrapper>
                        <ProfileImage src={profile.imageUrl || `https://via.placeholder.com/200?text=${profile.nickname}`} />
                    </ProfileWrapper>
                    <Description>
                        <Typography variant='h5'> {profile.nickname} </Typography>
                        <Typography variant='subtitle1'> ID : {profile.id} </Typography>
                        {
                            state === 'removable' ? (
                                <Button className='add-to-contact' color='secondary' variant='outlined' onClick={onAddToContact}>
                                    REMOVE FROM CONTACT
                                </Button>
                            ) : state === 'addable' ? (
                                <Button className='add-to-contact' color='secondary' variant='contained' onClick={onAddToContact}>
                                    ADD TO CONTACT
                                </Button>
                            ) : (
                                <Button disabled className='add-to-contact' color='secondary' variant='contained' onClick={onAddToContact}>
                                    ADD TO CONTACT
                                </Button>
                            )
                        }

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

        </div >) : <div />
};

type DialogProps = {
    children: React.ReactElement,
    show: boolean,
    onClose: () => void
}

const UserProfileDialog: React.FC<DialogProps> = ({
    children,
    onClose,
    show
}) => (
        <Dialog fullWidth maxWidth='sm' open={show} onClose={onClose}>
            {children}
        </Dialog>
    );

export { UserProfileContainer, UserProfileDialog };