import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Room } from '../../types/room';
import { ProfilesLoader } from '../Loaders/ProfileLoader';
import useOwnerState from './useOwnerState';
import useChatState from './useChatState';
import Requests from './Requests';
import UsersBase from './Users';
import MessagesBase from './Messages';
import Input from './Input';

type Props = {
    room: Room,
    className?: string,
};

const RoomHeader = styled.div`
    display : flex;
    align-items : center;
    justify-content : space-between;
`;

const Users = styled(UsersBase)`
    margin-bottom : ${({ theme }) => `${theme.spacing(1)}px`};
`

const Messages = styled(MessagesBase)`
    border : ${({ theme }) => `1px solid ${theme.palette.divider}`};
    height : 60vh;
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    margin-top : ${({ theme }) => `${theme.spacing(2)}px`};
    overflow : auto;
`;

export default ({ className, room }: Props) => {
    const {
        handleAcceptRequest,
        handleRejectRequest,
        isOwner
    } = useOwnerState(room);
    const {
        inputMessage,
        handleChangeInput,
        handleSubmitMessage,
        handleKeyPress,
        onSelectEmoji,
        multiline,
        onSwitchMultiline,
        onEditorMounted
    } = useChatState(room.id);

    return (
        <div className={className} >
            <ProfilesLoader uids={room.users}>
                {(profiles) => (
                    <React.Fragment>
                        <RoomHeader>
                            <Typography>{room.roomName}</Typography>
                            <Users profiles={profiles} />
                        </RoomHeader>
                        {isOwner && (
                            <Requests
                                roomId={room.id}
                                handleAcceptRequest={handleAcceptRequest}
                                handleRejectRequest={handleRejectRequest}
                            />
                        )}
                        <Input
                            inputMessage={inputMessage}
                            handleChangeInput={handleChangeInput}
                            handleSubmitMessage={handleSubmitMessage}
                            handleKeyPress={handleKeyPress}
                            onSelectEmoji={onSelectEmoji}
                            multiline={multiline}
                            onSwitchMultiline={onSwitchMultiline}
                            onEditorMounted={onEditorMounted}
                        />
                        <Messages roomId={room.id} profiles={profiles} />
                    </React.Fragment>
                )}
            </ProfilesLoader>
        </div>
    )
};