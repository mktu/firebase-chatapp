import React from 'react';
import LoadingPage from '../LoadingPage';
import { RequestLoader } from '../Loaders';
import Typography from '@material-ui/core/Typography';
import useRequestState from './useRequestState';
import MakeRequest from './MakeRequest';
import Refused from './Refused';
import { Room } from '../../../../types/room';
import {RequestStatus} from '../../constants';
import Presenter from './Presenter';

type Props = {
    room: Room,
    accepted:React.ReactElement
};

const Container: React.FC<Props> = ({ room, accepted }) => {
    const {
        makeJoinRequest,
        closeJoinRequest
    } = useRequestState(room);
    return (
        <Presenter >
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
                            return accepted;
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
        </Presenter >
    )
};

export default Container;