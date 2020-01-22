import firebase from './firebase';
import { 
    RequestStatus, 
    JoinRequest, 
    JoinRequestTransfer,
    JoinRequestsTransfer } from '../types/request';
import { consoleError, ErrorHandler, Notifier } from '../utils';
import { getCollectionListener, getDocumentListener } from './db';

const db = firebase.firestore();

export function listenJoinRequests(
    roomId: string,
    onAdded: JoinRequestsTransfer,
    onModified: JoinRequestsTransfer,
    onDeleted: JoinRequestsTransfer
) {
    return db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .onSnapshot(getCollectionListener<JoinRequest>(
            onAdded,
            onModified,
            onDeleted,
        ));
}

export function listenJoinRequestsByUser(
    roomId: string,
    profileId : string,
    onAdded: JoinRequestsTransfer,
    onModified: JoinRequestsTransfer,
    onDeleted: JoinRequestsTransfer
) {
    return db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .where('profileId', '==', profileId)
        .onSnapshot(getCollectionListener<JoinRequest>(
            onAdded,
            onModified,
            onDeleted,
        ));
}

export function listenJoinRequest(
    roomId: string,
    requestId : string,
    onModified: JoinRequestTransfer,
) {
    return db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .doc(requestId)
        .onSnapshot(getDocumentListener<JoinRequest>(onModified));
}

export function createRequest(
    roomId: string,
    nickName: string,
    profileId: string,
    onSucceeded: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .add({
            nickName,
            profileId,
            status: RequestStatus.Requesting,
            date: Date.now()
        })
        .then(onSucceeded)
        .catch(onFailed);
}

export function deleteRequest(
    roomId: string,
    requestId: string,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .doc(requestId)
        .delete()
        .catch(onFailed);
}

export function getRequests(
    roomId: string,
    profileId: string,
    onSucceeded: JoinRequestsTransfer,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .where('profileId', '==', profileId)
        .get()
        .then(function (querySnapshot) {
            let dataset : JoinRequest[] = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                const data = {
                    id : doc.id,
                    ...doc.data()
                } as JoinRequest; 
                dataset.push(data);
            });
            dataset.length > 0 && onSucceeded(dataset);
        })
        .catch(onFailed);
}

export function updateRequest(
    roomId: string,
    request: JoinRequest,
    onSucceeded ?: Notifier,
    onFailed : ErrorHandler = consoleError
) {
    const { id, ...data } = request;
    db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .doc(id)
        .set({
            ...data,
            lastUpdate: Date.now()
        }, { merge: true })
        .then(onSucceeded)
        .catch(onFailed);
}