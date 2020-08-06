import React, { useState, useContext } from 'react';
import { Room } from '../../../../../../types/room';
import { Profile } from '../../../../../../types/profile';
import { UsersContext, MyProfileContext } from '../../ChatroomContext';
import { ContactContext } from '../../../../contexts/ProfileContext';
import { ServiceContext } from '../../../../contexts';
import SettingDialog from '../SettingDialog';
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
    const profiles = useContext(UsersContext);
    const contacts = useContext(ContactContext)
    const {id : myProfileId} = useContext(MyProfileContext);
    const contactId = room.contact?.find(c=>c!==myProfileId);
    const contactProfile = contacts.find(c=>c.id===contactId);
    const { modifyRoom, addContact } = useContext(ServiceContext);
    const [showSetting, setShowSetting] = useState(false);
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
            <SettingDialog
                show={showSetting}
                room={room}
                modifyRoom={modifyRoom}
                owner={true}
                profiles={profiles}
                onClose={() => {
                    setShowSetting(false);
                }}
            />
            <UserProfileDialog
                show={Boolean(userProfile)}
                onClose={() => {
                    setUserProfile(undefined);
                }}
            >
                <UserProfileContainer
                    profile={userProfile}
                    onAddToContact={()=>{
                        userProfile && addContact(myProfileId, userProfile.id, ()=>{
                            console.log('succeeded')
                        });
                    }}
                />
            </UserProfileDialog>
        </React.Fragment>
    )
};

export default HeaderContainer;