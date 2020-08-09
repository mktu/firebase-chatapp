import React, { useState, useContext } from 'react';
import { Room, JoinRequest } from '../../../../../../types/room';
import { Profile } from '../../../../../../types/profile';
import { UsersContext, MyProfileContext } from '../../ChatroomContext';
import { ServiceContext } from '../../../../contexts';
import { ContactContext } from '../../../../contexts/ProfileContext';
import SettingDialog from '../SettingDialog';
import HeaderPresenter from './Presenter';
import { ShareLinkContainer, ShareLinkPortalPopover } from '../ShareLinkPortal';
import RequestsPortal from '../RequestsPortal';
import { UserProfileContainer, UserProfileDialog } from '../UserProfileDialog';
import Avatars from '../Avatars';

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
    const { id: myProfileId } = useContext(MyProfileContext);
    const contacts = useContext(ContactContext);
    const { modifyRoom, updateRequest, addContact } = useContext(ServiceContext);
    const [sharePortalAnchor, setSharePortalAnchor] = useState<HTMLButtonElement | null>(null);
    const [requestsPortalAnchor, setRequestsPortalAnchor] = useState<HTMLButtonElement | null>(null);
    const [showSetting, setShowSetting] = useState(false);
    const [userProfile, setUserProfile] = useState<Profile>();
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
                className={className}
                avatars={<Avatars
                    profiles={profiles}
                    onClick={(user) => {
                        setUserProfile(user)
                    }}
                />}
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
            <ShareLinkPortalPopover
                anchor={sharePortalAnchor}
                onClose={() => {
                    setSharePortalAnchor(null);
                }}
            >
                <ShareLinkContainer
                    link={loc}
                    onClose={() => {
                        setSharePortalAnchor(null);
                    }}
                />
            </ShareLinkPortalPopover>
            <UserProfileDialog
                show={Boolean(userProfile)}
                onClose={() => {
                    setUserProfile(undefined);
                }}
            >
                <UserProfileContainer
                    profile={userProfile}
                    state={
                        Boolean(contacts.find(c => c.id === userProfile?.id)) ? 'removable' :
                            myProfileId !== userProfile?.id ? 'addable' : 'disabled'
                    }
                    onAddToContact={() => {
                        userProfile && addContact(myProfileId, userProfile.id, () => {
                            console.log('succeeded')
                        });
                    }}
                    onClose={() => {
                        setUserProfile(undefined);
                    }}
                />
            </UserProfileDialog>
        </React.Fragment>
    )
};

export default HeaderContainer;