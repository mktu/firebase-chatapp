import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import CustomTheme, { ThemeType } from './ThemeContext';
import SmsIcon from '@material-ui/icons/Sms';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import { AddContactDialog, AddContactContainer } from './AddContactDialog';
import { AddRoomDialog, AddRoomContainer } from './AddRoomDialog';

type ThemeProps = {
    customtheme: ThemeType,
    theme: any
}
const Wrapper = styled.div`
    
`;

const SubTitleSection = styled.div`
    display : flex;
    align-items : center;
    >div{
        padding-right : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const Description = styled.div`
    >div{
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const MessageWrapper = styled.div`
    padding : ${({ theme }) => `${theme.spacing(4)}px`};
    background-color : ${({ customtheme }: ThemeProps) => `${customtheme.paper}`};
    color : ${({ customtheme }: ThemeProps) => `${customtheme.paperText}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    > .title{
        margin-bottom :  ${({ theme }) => `${theme.spacing(2)}px`};
    }
`;

export default ({
    handleLoadContact,
    handleLoadRoom
}:{
    handleLoadContact : ()=>void,
    handleLoadRoom : (roomId:string) =>void
}) => {
    const customTheme = useContext(CustomTheme);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    return (
        <React.Fragment>
            <Wrapper>
                <MessageWrapper customtheme={customTheme}>
                    <Typography variant='h5' className='title'>Welcome Chat App. Chat App has two chat features.</Typography>
                    <SubTitleSection>
                        <div>
                            <SmsIcon />
                        </div>
                        <div>
                            <Typography variant='h6'>Chat Room</Typography>
                        </div>
                    </SubTitleSection>
                    <Description>
                        <div>You can create a chat room and chat with multiple people</div>
                        <div><Button variant='outlined' color='secondary' onClick={() => {
                            setShowAddRoom(true);
                        }}>Create Room</Button></div>
                    </Description>
                    <SubTitleSection>
                        <div>
                            <GroupIcon />
                        </div>
                        <div>
                            <Typography variant='h6'>Contact</Typography>
                        </div>
                    </SubTitleSection>
                    <Description>
                        <div>You can chat directly with a friend. To add a friend you need
                        to tell your friend your ID or have your friend give you an ID.
                    ID can be confirmed from the Profile</div>
                        <div><Button variant='outlined' color='secondary' onClick={() => {
                            setShowAddContact(true);
                        }}>Add Contact</Button></div>
                    </Description>
                </MessageWrapper>
            </Wrapper>
            <AddContactDialog show={showAddContact} onClose={()=>{setShowAddContact(false)}}>
                <AddContactContainer onClose={()=>{setShowAddContact(false)}} onSucceed={handleLoadContact}/>
            </AddContactDialog>
            <AddRoomDialog show={showAddRoom} onClose={()=>{setShowAddRoom(false)}}>
                <AddRoomContainer onClose={()=>{setShowAddRoom(false)}} onSucceed={handleLoadRoom}/>
            </AddRoomDialog>
        </React.Fragment>
    )
};