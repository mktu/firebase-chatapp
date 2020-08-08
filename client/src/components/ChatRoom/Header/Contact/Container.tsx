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
    const {id : myProfileId} = useContext(MyProfileContext);
    const contactId = room.contact?.find(c=>c!==myProfileId);
    const contactProfile = contacts.find(c=>c.id===contactId);
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
                    state={'removable'}
                    onAddToContact={()=>{
                        
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