import React, { useState, useContext } from 'react';
import { Room } from '../../../../../../types/room';
import { Profile } from '../../../../../../types/profile';
import { MyProfileContext } from '../../ChatroomContext';
import { ContactContext } from '../../../../contexts/ProfileContext';
import HeaderPresenter from './Presenter';
import { UserProfileContainer, UserProfileDialog } from '../UserProfileDialog';
import Avatars from '../Avatars';

type Props = {
    room: Room,
    className?: string,
}

const HeaderContainer: React.FC<Props> = ({
    className,
    room,
}) => {
    const contacts = useContext(ContactContext)
    const myProfile = useContext(MyProfileContext);
    const {id : myProfileId} = myProfile;
    const contactId = room.contact?.find(c=>c!==myProfileId);
    const selfContact = room.contact?.every(c=>c===myProfileId) || false;
    const contactProfile = selfContact ? myProfile : contacts.find(c=>c.id===contactId);
    const [userProfile, setUserProfile] = useState<Profile>();
    return (
        <React.Fragment>
            <HeaderPresenter
                roomName={contactProfile? contactProfile.nickname : ''}
                className={className}
                avatar={<Avatars
                    profiles={contactProfile ? [contactProfile] : []}
                    onClick={(user) => {
                        setUserProfile(user)
                    }}
                />}
            />
            <UserProfileDialog
                show={Boolean(userProfile)}
                onClose={() => {
                    setUserProfile(undefined);
                }}
            >
                <UserProfileContainer
                    profile={userProfile}
                    onClose={() => {
                        setUserProfile(undefined);
                    }}
                />
            </UserProfileDialog>
        </React.Fragment>
    )
};

export default HeaderContainer;