import React, { useState, useContext } from 'react';
import { Room, JoinRequest } from '../../../../../types/room';
import { UsersContext } from '../ChatroomContext';
import { ServiceContext } from '../../../contexts';
import SettingDialog from './SettingDialog';
import HeaderPresenter from './Presenter';
import ShareLinkPortal from './ShareLinkPortal';
import RequestsPortal from './RequestsPortal';

type Props = {
    room: Room,
    requests: JoinRequest[],
    owner: boolean,
    className?: string,
}

const HeaderContainer: React.FC<Props> = ({
    className,
    room,
    owner,
    requests,
}) => {
    const profiles = useContext(UsersContext);
    const { modifyRoom, updateRequest } = useContext(ServiceContext);
    const [sharePortalAnchor, setSharePortalAnchor] = useState<HTMLButtonElement | null>(null);
    const [requestsPortalAnchor, setRequestsPortalAnchor] = useState<HTMLButtonElement | null>(null);
    const [showSetting, setShowSetting] = useState(false);
    const loc = window.location.href;
    const handleAcceptRequest = (request: JoinRequest) => {
        updateRequest(room.id,
            {
                ...request,
                status: 'accepted'
            });
        modifyRoom({
            ...room,
            users: [...room.users, request.profileId]
        });
    }
    const handleRejectRequest = (request: JoinRequest) => {
        updateRequest(room.id,
            {
                ...request,
                status: 'rejected'
            });
    }
    return (
        <React.Fragment>
            <HeaderPresenter
                roomName={room.roomName}
                profiles={profiles}
                className={className}
                owner={owner}
                requestCount={requests.length}
                onClickSetting={() => {
                    setShowSetting(true);
                }}
                onClickRequest={(e) => {
                    setRequestsPortalAnchor(e.currentTarget);
                }}
                onClickShare={(e) => {
                    setSharePortalAnchor(e.currentTarget);
                }}
            />
            {owner && (
                <RequestsPortal
                    anchor={requestsPortalAnchor}
                    requests={requests}
                    handleAcceptRequest={handleAcceptRequest}
                    handleRejectRequest={handleRejectRequest}
                    onClose={() => {
                        setRequestsPortalAnchor(null);
                    }}
                />
            )}
            <SettingDialog
                show={showSetting}
                room={room}
                modifyRoom={modifyRoom}
                owner={owner}
                profiles={profiles}
                onClose={() => {
                    setShowSetting(false);
                }}
            />
            <ShareLinkPortal
                link={loc}
                anchor={sharePortalAnchor}
                onClose={() => {
                    setSharePortalAnchor(null);
                }}
            />
        </React.Fragment>
    )
};

export default HeaderContainer;