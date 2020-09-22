import firebase from './firebase';
import { User, Transfer } from '../../../types/user';
import { consoleError, consoleLogger, ErrorHandler } from '../utils';

type OnSucceeded = (user: User) => void;
type OnError = ErrorHandler;

const convertUser = (user: firebase.User): User => {
    return {
        uid: user.uid,
        isAnonymous: user.isAnonymous,
        name: user.displayName
    }
}

export const listenAuthState = (onLogin: Transfer, onLogout: () => void) => {
    return firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            onLogin({
                uid: user.uid,
                isAnonymous: user.isAnonymous,
                name: user.displayName
            })
        } else {
            onLogout();
        }
    });
}

export const loginByGoogle = (
    onSucceeded: OnSucceeded = consoleLogger,
    onFailed: OnError = consoleError
) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((usercred) => {
        usercred.user && onSucceeded(convertUser(usercred.user))
    }).catch(onFailed);
}

export const linkWithGoogle = (
    onSucceeded: OnSucceeded,
    onFailed: OnError = consoleError
) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const curUser = firebase.auth().currentUser;
    curUser?.linkWithPopup(provider).then(function (usercred) {
        const user = usercred.user;
        const profile = usercred.additionalUserInfo?.profile;
        user?.updateProfile({
            displayName: (profile as any).name
        }).then(function () {
            onSucceeded(convertUser(user));
        }).catch(onFailed)
    }).catch(onFailed);
}

export const loginWithAnonymous = (
    onSucceeded: OnSucceeded = consoleLogger,
    onFailed: OnError = consoleError
) => {
    firebase.auth().signInAnonymously().then((usercred) => {
        usercred.user && onSucceeded(convertUser(usercred.user))
    }
    ).catch(onFailed);
}

export const logout = (
    onSucceeded = consoleLogger,
    onFailed: OnError = consoleError
) => {
    firebase.auth().signOut().then(onSucceeded).catch(onFailed);
}