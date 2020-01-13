import firebase from './firebase';
import { 
    Room, 
    RequestStatus, 
    JoinRequest, 
    RoomsTransfer, 
    RoomTransfer, 
    JoinRequestTransfer } from '../types/room';
import { consoleError, ErrorHandler, Notifier } from '../utils';
import { getCollectionListener } from './db';

const db = firebase.firestore();

export function registListener(
    onAdded: RoomsTransfer,
    onModified: RoomsTransfer,
    onDeleted: RoomsTransfer,
    profileId: string
): Notifier {
    return db.collection('rooms')
        .where('users', 'array-contains', profileId)
        .onSnapshot(getCollectionListener<Room>(
            onAdded,
            onModified,
            onDeleted,
        ))
}

export function listenJoinRequests(
    roomId: string,
    onAdded: JoinRequestTransfer,
    onModified: JoinRequestTransfer,
    onDeleted: JoinRequestTransfer
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

export function createRoom(
    roomName: string,
    profileId: string,
    onSucceeded: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms').add({
        ownerId: profileId,
        roomName,
        users: [profileId],
        lastUpdate: Date.now()
    })
        .then(onSucceeded)
        .catch(onFailed);
}

export function getRoom(
    roomId : string,
    onSucceeded: RoomTransfer,
    onFailed: ErrorHandler = consoleError
){
    db.collection('rooms')
    .doc(roomId)
    .get()
    .then((doc)=>{
        if(doc.exists){
            const data = {
                id : doc.id,
                ...doc.data()
            } as Room;
            onSucceeded(data);
        }
    })
    .catch(onFailed)
}

export function createRequest(
    roomId: string,
    userName: string,
    profileId: string,
    onSucceeded: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('requests')
        .add({
            userName,
            profileId,
            status: RequestStatus.Requesting,
            date: Date.now()
        })
        .then(onSucceeded)
        .catch(onFailed);
}

export function getRequests(
    roomId: string,
    profileId: string,
    onSucceeded: JoinRequestTransfer,
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

export function modifyProfile(
    room: Room,
    onSucceeded: () => void | undefined,
    onFailed: ErrorHandler = consoleError
) {
    const { id, ...data } = room;
    db.collection('rooms').doc(id).set({
        ...data,
        lastUpdate: Date.now()
    }, { merge: true })
        .then(onSucceeded)
        .catch(onFailed);
}
export function deleteProfile(
    room: Room,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(room.id)
        .delete()
        .catch(onFailed);
}