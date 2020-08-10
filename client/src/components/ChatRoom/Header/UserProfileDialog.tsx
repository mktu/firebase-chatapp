import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { MyProfileContext } from '../ChatroomContext';
import { ContactContext } from '../../../contexts/ProfileContext';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { ServiceContext } from '../../../contexts';
import Button from '@material-ui/core/Button';
import { Spin1s200pxIcon } from '../../Icons';

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
    height : auto;
`;

type Props = {
    profile?: Profile,
    className?: string,
    onClose: () => void,
}

function UserProfileContainer({
    profile,
    className,
    onClose,
}: Props) {
    const { id: myProfileId } = useContext(MyProfileContext);
    const contacts = useContext(ContactContext);
    const contact = contacts.find(c => c.id === profile?.id);
    const { addContact, blockContact, unblockContact } = useContext(ServiceContext);
    const state: 'addable' | 'disabled' | 'removable' | 'reactivatable' =
        contact ?
            contact.enable ?
                'removable' : 'reactivatable' :
            myProfileId !== profile?.id ? 'addable' : 'disabled';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();
    const unmountRef = useRef<{unmounted:boolean}>({unmounted:false});
    
    useEffect(()=>{
        unmountRef.current = {unmounted : false};
        return ()=>{
            unmountRef.current = {unmounted : true};
        }
    },[unmountRef])

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
                        <div className='actions'>
                            <div className='button'>
                                {
                                    state === 'removable' ? (
                                        <Button color='secondary' variant='outlined' onClick={() => {
                                            contact?.roomId && blockContact(myProfileId, profile.id, contact.roomId, () => {
                                                if(unmountRef.current.unmounted) return;
                                                setLoading(false);
                                                setError(undefined);
                                            }, (e) => {
                                                setError(e);
                                                setLoading(false);
                                            })
                                            setLoading(true);
                                        }}>
                                            BLOCK CONTACT
                                        </Button>
                                    ) : state === 'addable' ? (
                                        <Button color='secondary' variant='contained' onClick={() => {
                                            addContact(myProfileId, profile.id, () => {
                                                setLoading(false);
                                                setError(undefined);
                                            }, (e) => {
                                                setError(e);
                                                setLoading(false);
                                            });
                                            setLoading(true);
                                        }}>
                                            ADD TO CONTACT
                                        </Button>
                                    ) : state === 'reactivatable' ? (
                                        <Button color='secondary' variant='outlined' onClick={() => {
                                            contact?.roomId && unblockContact(myProfileId, profile.id, contact.roomId, () => {
                                                setLoading(false);
                                                setError(undefined);
                                            }, (e) => {
                                                setError(e);
                                                setLoading(false);
                                            })
                                            setLoading(true);
                                        }}>
                                            UNBLOCK
                                        </Button>
                                    ) : (
                                                    <Button disabled color='secondary' variant='contained' >
                                                        ADD TO CONTACT
                                                    </Button>
                                                )
                                }
                            </div>
                            {loading && (
                                <div className='loading'>
                                    <Spin1s200pxIcon width='50' />
                                </div>
                            )}

                        </div>
                        {error && (
                            <div className='error'>
                                {error.message}
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