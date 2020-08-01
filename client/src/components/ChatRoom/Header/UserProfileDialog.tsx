import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import { Profile } from '../../../../../types/profile';

const ContentWrapper = styled(DialogContent)`
    box-sizing: border-box;
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content : space-between;
    width : 100%;
    & >.profile-image{
        width : 100%;
        padding : 1em;
        background-color : ${({ theme }) => `${theme.palette.grey[200]}`};
        border-radius : 5px;
    }
    & >.profile-main{
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
        display : flex;
        align-items : center;
        width : 100%;
        >.actions{
            margin-left : auto;
        }
    }
`;

const ProfileImage = styled.img`
    width : 150px;
    height : 150px;
    border-radius : 50%;
    background-color : white;
`;

type Props = {
    profile?: Profile
    className?: string,
    onAddToContact : ()=>void
}

function UserProfileContainer({
    profile,
    className,
    onAddToContact
}: Props) {
    return profile ? (
        <div className={className} >
            <DialogTitle>{profile.nickname}</DialogTitle>
            <ContentWrapper>
                <div className='profile-image'>
                    <ProfileImage src={profile.imageUrl || `https://via.placeholder.com/200?text=${profile.nickname}`} width='150' height='150' />
                </div>
                <div className='profile-main'>
                    <div>
                        <Typography variant='h5'>
                            {profile.nickname}
                        </Typography>
                    </div>
                    <div className='actions'>
                        <Tooltip title='Add to Contact'>
                            <Fab color='primary' onClick={()=>{
                                onAddToContact();
                            }}><AddIcon /></Fab>
                        </Tooltip>
                    </div>
                </div>
                <div className='description'>

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