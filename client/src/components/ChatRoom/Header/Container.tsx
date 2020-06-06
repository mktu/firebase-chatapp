import React, { useState } from 'react';
import { Room, JoinRequest } from '../../../../../types/room';
import { Profile } from '../../../../../types/profile';
import SettingDialog from './SettingDialog';
import RequestsDialog from './RequestsDialog';
import HeaderPresenter from './Presenter';
import ShareLinkPortal from './ShareLinkPortal';

const HeaderContainer: React.FC<{
    room: Room,
    profiles: Profile[],
    requests: JoinRequest[],
    owenr: boolean,
    modifyRoom: (room: Room) => void,
    updateRequest: (roomId: string, request: JoinRequest) => void
    className?: string,
}> = ({
    className,
    profiles,
    room,
    owenr,
    requests,
    modifyRoom,
    updateRequest
}) => {
        const [sharePortalAnchor, setSharePortalAnchor] = useState<HTMLButtonElement|null>(null);
        const [showRequests, setShowRequests] = useState(false);
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
                    owner={owenr}
                    requestCount={requests.length}
                    onClickSetting={() => {
                        setShowSetting(true);
                    }}
                    onClickRequest={() => {
                        setShowRequests(true);
                    }}
                    onClickShare={(e) => {
                        setSharePortalAnchor(e.currentTarget);
                    }}
                />
                {owenr && (
                    <RequestsDialog
                        show={showRequests && owenr}
                        requests={requests}
                        handleAcceptRequest={handleAcceptRequest}
                        handleRejectRequest={handleRejectRequest}
                        onClose={() => {
                            setShowRequests(false);
                        }}
                    />
                )}
                <SettingDialog
                    show={showSetting}
                    room={room}
                    modifyRoom={modifyRoom}
                    owner={owenr}
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