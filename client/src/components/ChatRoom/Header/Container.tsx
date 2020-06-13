import React, { useState } from 'react';
import { Room, JoinRequest } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import SettingDialog from './SettingDialog';
import HeaderPresenter from './Presenter';
import ShareLinkPortal from './ShareLinkPortal';
import RequestsPortal from './RequestsPortal';

const HeaderContainer: React.FC<{
    room: Room,
    profiles: Profile[],
    requests: JoinRequest[],
    owner: boolean,
    modifyRoom: (room: Room) => void,
    updateRequest: (roomId: string, request: JoinRequest) => void
    className?: string,
}> = ({
    className,
    profiles,
    room,
    owner,
    requests,
    modifyRoom,
    updateRequest
}) => {
        const [sharePortalAnchor, setSharePortalAnchor] = useState<HTMLButtonElement|null>(null);
        const [requestsPortalAnchor, setRequestsPortalAnchor] = useState<HTMLButtonElement|null>(null);
        const [showSetting, setShowSetting] = useState(false);
        const loc = window.location.href;
console.log(requestsPortalAnchor)
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
                    onClose={()=>{
                        setSharePortalAnchor(null);
                    }}
                />
            </React.Fragment>
        )
    };

export default HeaderContainer;