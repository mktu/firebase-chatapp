import React, {useContext} from 'react';
import { ProfileContext, ServiceContext } from '../../../contexts';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { Room } from '../../../../../types/room';

type Props = {
    room : Room,
    show : boolean
}

const Wrapper = styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    align-items : center;
`;

const InactiveRoom : React.FC<Props> = ({
    room,
    show
})=>{
    const { profileState } = useContext(ProfileContext);
    const { 
        modifyRoom
     } = useContext(ServiceContext);
    const { profile } = profileState;
    const owenr = profile?.id === room.ownerId; 
    if(!show){
        return <div />;
    }
    return (
        <Wrapper>
            <div>
                {owenr ? (
                <div>
                    <Typography variant='subtitle1'>This room is inactive. Do you want to activate again ?</Typography>
                    <Button color='secondary' onClick={()=>{
                        modifyRoom({
                            ...room,
                            disabled : false
                        })
                    }}>Activate this room</Button>
                </div>
                ) : (
                    <Typography variant='subtitle1'>This room is inactive. Please contact to room's owner</Typography>
                )}
                
            </div>
        </Wrapper>
    )
}

export default InactiveRoom;