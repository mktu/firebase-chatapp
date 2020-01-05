import firebase from './firebase';
import { Transfer, Profile } from '../types/profile';
import { User } from '../types/user';
import { consoleError, ErrorHandler } from '../utils';

const db = firebase.firestore();

export function addProfile(
    nickName: string,
    user: User,
    onSucceeded : ()=>void | undefined,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('profiles').add({
        uid: user.uid,
        nickName,
        lastUpdate: Date.now()
    })
        .then(onSucceeded)
        .catch(onFailed);
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
export function modifyProfile(
    profile: Profile,
    onSucceeded : ()=>void | undefined,
    onFailed : ErrorHandler = consoleError
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
    onFailed : ErrorHandler = consoleError
) {
    db.collection('profiles')
        .doc(profile.id)
        .delete()
        .catch(onFailed);
}