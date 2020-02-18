import React from 'react';
import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';
import LoadingPage from '../LoadingPage';
import { RequestLoader } from '../Loaders';
import Typography from '@material-ui/core/Typography';
import useRequestState from './useRequestState';
import MakeRequest from './MakeRequest';
import Refused from './Refused';
import { Room } from '../../../../types/room';
import {RequestStatus} from '../../constants';

type Props = {
    room: Room,
    className?: string,
    accepted:()=>JSX.Element
};

const Paper = styled(PaperBase)`
    width : 50%;
    padding : 1rem;
`;

const Request: React.FC<Props> = ({ className, room, accepted }) => {
    const {
        makeJoinRequest,
        closeJoinRequest
    } = useRequestState(room);
    return (
        <Paper className={className} >
            <RequestLoader
                room={room}
                loading={() => (<LoadingPage message={'Loading join request'} />)}
                fallback={() => (<MakeRequest
                    makeJoinRequest={makeJoinRequest}
                    room={room}
                />)}
            >
                {
                    (request) => {
                        if (!request) {
                            return (<Typography>Request is deleted.</Typography>);
                        }
                        if(request.status===RequestStatus.Accepted){
                            return accepted();
                        }
                        return (
                            <div>
                                <Typography>{`You are requesting to join "${room!.roomName}" room`}</Typography>
                                <Refused request={request} onOk={()=>{
                                    closeJoinRequest(request.id)
                                }} />
                            </div>
                        )
                    }
                }
            </RequestLoader>
        </Paper >
    )
};

export default Request;