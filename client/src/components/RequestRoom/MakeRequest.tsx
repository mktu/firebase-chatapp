import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Room } from '../../../../types/room';

type Props = {
    room: Room,
    makeJoinRequest: () => void,
    className?: string,
};

const RightAlignWrapper = styled.div`
    display : flex;
    justify-content : flex-end;
`;

const MakeRequest: React.FC<Props> = ({
    room,
    makeJoinRequest
}) => {

    return (
        <React.Fragment>
            <Typography>{`Request to join the "${room.roomName}" room ?`}</Typography>
            <RightAlignWrapper>
                <Button color='secondary' onClick={makeJoinRequest}>YES</Button>
            </RightAlignWrapper>
        </React.Fragment>
    )
}

export default MakeRequest;