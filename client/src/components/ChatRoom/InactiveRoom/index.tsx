import React, {useContext} from 'react';
import { ProfileContext, ServiceContext } from '../../../contexts';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { Room } from '../../../../../types/room';

export type Props = {
    room : Room,
    show : boolean,
    onClose : ()=>void
}

const Wrapper = styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    align-items : center;
    justify-content : center;
`;

const OwnerContent = styled.div`
    > .actions{
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
        display : flex;
        align-items : center;
        justify-content : center;
    }
`

const InactiveRoom : React.FC<Props> = ({
    room,
    show,
    onClose
})=>{
    const { profileState } = useContext(ProfileContext);
    const { 
        modifyRoom,
        deleteRoomPermanently
     } = useContext(ServiceContext);
    const { profile } = profileState;
    const owenr = profile?.id === room.ownerId; 
    const { enqueueSnackbar } = useSnackbar();
    if(!show){
        return <div />;
    }
    return (
        <Wrapper>
            <div>
                {owenr ? (
                <OwnerContent>
                    <Typography variant='subtitle1'>"{`${room.roomName}`}" is inactive. Do you want to activate again ? Or, you can delete this room permanently.</Typography>
                    <div className='actions'>
                        <Button color='primary' variant='contained' onClick={()=>{
                            modifyRoom({
                                ...room,
                                disabled : false
                            })
                        }}>Activate this room</Button>
                        <Button color='secondary' onClick={()=>{
                            if(profile){
                                onClose();
                                deleteRoomPermanently(room, profile.id, profile.uid,()=>{
                                    enqueueSnackbar(`${room.roomName} is successfully deleted.`, {variant : 'success'})
                                });
                            }
                        }}>Delete Permanently</Button>
                    </div>
                </OwnerContent>
                ) : (
                    <Typography variant='subtitle1'>This room is inactive. Please contact to room's owner</Typography>
                )}
                
            </div>
        </Wrapper>
    )
}

export default InactiveRoom;