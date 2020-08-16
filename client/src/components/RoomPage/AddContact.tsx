import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import ServiceContext from '../../contexts/ServiceContext';
import { Spin1s200pxIcon } from '../Icons';
import ProfileContext, { ContactContext } from '../../contexts/ProfileContext';
import { Profile } from '../../../../types/profile';
import SearchBox from './SearchBox';

type ContainerProps = {
    onClose: () => void,
}

const SearchError = styled.div`
    color : ${({ theme }) => `${theme.palette.error.main}`};
`;

const CustomAvatar = styled(Avatar)`
    width: ${({ theme }) => `${theme.spacing(3)}px`};
    height: ${({ theme }) => `${theme.spacing(3)}px`};
    font-size : 15px;
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
`;

const ContentWrapper = styled(DialogContent)`
    padding : ${({ theme }) => `${theme.spacing(2)}px`};

    > .search-box{
        display : flex;
        justify-content : center;
        margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
        
    }
    > .users {
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
        display : flex;
        align-items : center;
        > .last-item{
            margin-left : auto;
        }
    }
    > .footer{
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
        display : flex;
        align-items : center;
        justify-content : center;
    }
    
`;

const AddContactContainer: React.FC<ContainerProps> = ({
    onClose
}) => {
    const [id, setId] = useState('');
    const [user, setUser] = useState<Profile>();
    const [error, setError] = useState<Error>();
    const [searchingUser, setSearchingUser] = useState(false);
    const contacts = useContext(ContactContext);
    const { searchProfileById, addContact } = useContext(ServiceContext);
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    return (
        <ContentWrapper>
            <Typography variant='subtitle1'>Search Contact by ID</Typography>
            <div>
                <SearchBox variant='contact' value={id}  onChange={setId} onSearch={() => {
                    if (!id) {
                        return;
                    }
                    setSearchingUser(true);
                    searchProfileById(id, (profile) => {
                        setUser(profile);
                        setSearchingUser(false);
                    }, (error) => {
                        setError(error);
                        setSearchingUser(false);
                    })
                }} />
            </div>
            <div className='users'>
                {searchingUser ? (
                    <Spin1s200pxIcon width='50' />
                ) : Boolean(error) ? (
                    <SearchError>{error?.message}</SearchError>
                ) : user ? (
                    <React.Fragment>
                        <CustomAvatar src={user?.imageUrl}>
                            {user.nickname[0]}
                        </CustomAvatar>
                        <div>{user.nickname}</div>
                        <div className='last-item'>
                            <Button color='secondary' variant='outlined'
                                onClick={() => {
                                    profile &&  addContact(profile.id, user.id, ()=>{
                                        onClose();
                                    }, setError)
                                }}
                                disabled={contacts.map(c=>c.id).includes(user.id)}
                            >
                                ADD
                            </Button>
                        </div>
                    </React.Fragment>
                ) : <div />}
            </div>
            <div className='footer'>
                    <Button variant='outlined' onClick={onClose}>CLOSE</Button>
            </div>

        </ContentWrapper>
    )
}

type DialogProps = {
    show: boolean,
    onClose: () => void,
    children: React.ReactElement
}

const AddContactDialog: React.FC<DialogProps> = ({
    show,
    onClose,
    children
}) => {
    return (
        <Dialog
            open={show}
            onClose={onClose}
            fullWidth
        >
            {children}
        </Dialog>
    )
}
export {
    AddContactDialog,
    AddContactContainer
}