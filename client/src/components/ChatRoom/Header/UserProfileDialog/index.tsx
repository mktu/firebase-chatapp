import React, { useContext, useState, useRef, useEffect } from 'react';
import { MyProfileContext } from '../../ChatroomContext';
import { ContactContext } from '../../../../contexts/ProfileContext';
import Dialog from '@material-ui/core/Dialog';
import { ServiceContext } from '../../../../contexts';
import Button from '@material-ui/core/Button';
import { Profile } from '../../../../../../types/profile';
import Presenter from './Presenter';

type Props = {
    profile?: Profile,
    className?: string,
    onClose: () => void,
}

function UserProfileContainer({
    profile,
    className,
    onClose,
}: Props) {
    const { id: myProfileId } = useContext(MyProfileContext);
    const contacts = useContext(ContactContext);
    const contact = contacts.find(c => c.id === profile?.id);
    const { addContact, blockContact, unblockContact } = useContext(ServiceContext);
    let state: 'addable' | 'disabled' | 'removable' | 'reactivatable' = 'disabled';
    if (contact) {
        if (contact.enable) {
            if (contact.id !== myProfileId) {
                state = 'removable';
            }
        } else {
            state = 'reactivatable';
        }
    } else {
        state = 'addable';
    }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();
    const unmountRef = useRef<{ unmounted: boolean }>({ unmounted: false });

    useEffect(() => {
        unmountRef.current = { unmounted: false };
        return () => {
            unmountRef.current = { unmounted: true };
        }
    }, [unmountRef])

    if (!profile) return <div />

    return <Presenter
        className={className}
        profile={profile}
        onClose={onClose}
        loading={loading}
        error={error && error.message}
        button={<React.Fragment>{
            state === 'removable' ? (
                <Button color='secondary' variant='outlined' onClick={() => {
                    contact?.roomId && blockContact(myProfileId, profile.id, contact.roomId, () => {
                        if (unmountRef.current.unmounted) return;
                        setLoading(false);
                        setError(undefined);
                    }, (e) => {
                        setError(e);
                        setLoading(false);
                    })
                    setLoading(true);
                }}>
                    BLOCK CONTACT
                </Button>
            ) : state === 'addable' ? (
                <Button color='secondary' variant='contained' onClick={() => {
                    addContact(myProfileId, profile.id, () => {
                        setLoading(false);
                        setError(undefined);
                    }, (e) => {
                        setError(e);
                        setLoading(false);
                    });
                    setLoading(true);
                }}>
                    ADD TO CONTACT
                </Button>
            ) : state === 'reactivatable' ? (
                <Button color='secondary' variant='outlined' onClick={() => {
                    contact?.roomId && unblockContact(myProfileId, profile.id, contact.roomId, () => {
                        setLoading(false);
                        setError(undefined);
                    }, (e) => {
                        setError(e);
                        setLoading(false);
                    })
                    setLoading(true);
                }}>
                    UNBLOCK
                </Button>
            ) : (
                            <Button disabled color='secondary' variant='contained' >
                                ADD TO CONTACT
                            </Button>
                        )
        }</React.Fragment>}
    />
};

type DialogProps = {
    children: React.ReactElement,
    show: boolean,
    onClose: () => void
}

const UserProfileDialog: React.FC<DialogProps> = ({
    children,
    onClose,
    show
}) => (
        <Dialog fullWidth maxWidth='sm' open={show} onClose={onClose}>
            {children}
        </Dialog>
    );

export { UserProfileContainer, UserProfileDialog };