import firebase from './firebase';
import { Transfer, ProfilesTransfer, Profile , Contact, ContactsTransfer} from '../../../types/profile';
import { User } from '../../../types/user';
import { getCollectionListener } from './db';
import { consoleError, ErrorHandler } from '../utils';

const db = firebase.firestore();
const storageRef = firebase.storage().ref();
const ff = firebase.functions();

export function addProfile(
    nickname: string,
    user: User,
    onSucceeded: Transfer | undefined,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('profiles').add({
        uid: user.uid,
        nickname,
        lastUpdate: Date.now()
    })
        .then((docRef) => {
            if (onSucceeded) {
                docRef.get().then(doc => {
                    if (doc.exists) {
                        onSucceeded({
                            ...doc.data() as Profile,
                            id: doc.id
                        })
                    }
                }).catch(onFailed)
            }
        })
        .catch(onFailed);
}

export function listenProfile(
    uid: string,
    onAdded: ProfilesTransfer,
    onModified: ProfilesTransfer,
    onDeleted: ProfilesTransfer
) {
    return db.collection('profiles')
        .where('uid', '==', uid)
        .onSnapshot(getCollectionListener<Profile>(
            onAdded,
            onModified,
            onDeleted,
        ));
}

export function listenProfiles(
    profileIds: string[],
    onAdded: ProfilesTransfer,
    onModified: ProfilesTransfer,
    onDeleted: ProfilesTransfer
) {
    return db.collection('profiles')
        .where(firebase.firestore.FieldPath.documentId(), 'in', profileIds)
        .onSnapshot(getCollectionListener<Profile>(
            onAdded,
            onModified,
            onDeleted,
        ));
}

export function searchProfileById(
    profileId : string,
    onSucceeded: Transfer,
    onFailed: ErrorHandler = consoleError
){
    db.collection('profiles')
    .doc(profileId)
    .get()
    .then((doc)=>{
        if(doc.exists){
            const data = {
                id : doc.id,
                ...doc.data()
            } as Profile;
            onSucceeded(data);
        }else{
            onFailed(Error('User not found.'))
        }
    })
    .catch(onFailed)
}

export function getProfile(
    user: User,
    onSucceeded: Transfer,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('profiles')
        .where('uid', '==', user.uid)
        .get()
        .then(function (querySnapshot) {
            if (querySnapshot.size === 0) {
                onFailed(Error('Not found a profile of the selected user'))
                return;
            }
            const data = {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data()
            } as Profile;
            onSucceeded(data);
        })
        .catch(onFailed);
}

export function getProfiles(
    profileIds: string[],
    onSucceeded: ProfilesTransfer,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('profiles')
        .where(firebase.firestore.FieldPath.documentId(), 'in', profileIds)
        .get()
        .then(function (querySnapshot) {
            if (querySnapshot.size === 0) {
                onFailed(Error('Not found a profile of the selected user'))
                return;
            }
            const dataset = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Profile));
            onSucceeded(dataset);
        })
        .catch(onFailed);
}

export function modifyProfile(
    profile: Profile,
    onSucceeded: () => void | undefined,
    onFailed: ErrorHandler = consoleError
) {
    const { id, ...data } = profile;
    db.collection('profiles').doc(id).set({
        ...data,
        lastUpdate: Date.now()
    }, { merge: true })
        .then(onSucceeded)
        .catch(onFailed);
}
export function deleteProfile(
    profile: Profile,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('profiles')
        .doc(profile.id)
        .delete()
        .catch(onFailed);
}

export function uploadProfileImage(
    profileId: string,
    image: File,
    onSucceeded: (url: string) => void,
    onProgress?: (progress: number, status: 'paused' | 'running') => void,
    onFailed?: ErrorHandler
) {
    const task = storageRef.child(`profiles/${profileId}`).put(image);
    task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                onProgress && onProgress(progress, 'paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                onProgress && onProgress(progress, 'running');
                break;
        }
    }, onFailed, () => {
        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            onSucceeded(downloadURL);
        });
    })
}

export function addContact(
    profileId: string,
    targetProfileId: string,
    onSucceeded?: () => void,
    onFailed?: ErrorHandler
){
    db.collection('profiles')
        .doc(profileId)
        .collection('contacts')
        .doc(targetProfileId)
        .set({
            enable : true
        }, { merge: true })
        .then(onSucceeded)
        .catch(onFailed);
}

export function blockContact(
    callerProfileId: string,
    blockProfileId: string,
    roomId:string,
    onSucceeded?: () => void,
    onFailed?: ErrorHandler
){
    const createFn = ff.httpsCallable('blockContact');
    createFn({ callerProfileId, blockProfileId, roomId })
        .then(function() {
            onSucceeded && onSucceeded();
        })
        .catch(onFailed);
}

export function unblockContact(
    callerProfileId: string,
    blockProfileId: string,
    roomId:string,
    onSucceeded?: () => void,
    onFailed?: ErrorHandler
){
    const createFn = ff.httpsCallable('unblockContact');
    createFn({ callerProfileId, blockProfileId, roomId })
        .then(function() {
            onSucceeded && onSucceeded();
        })
        .catch(onFailed);
}

export function listenContacts(
    profileId: string,
    onAdded:ContactsTransfer,
    onModified: ContactsTransfer,
    onDeleted: ContactsTransfer
){
    return db.collection('profiles')
    .doc(profileId)
    .collection('contacts')
    .onSnapshot(getCollectionListener<Contact>(
        onAdded,
        onModified,
        onDeleted,
    ));
}