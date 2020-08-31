import firebase from './firebase';
import { 
    Room, 
    RoomsTransfer, 
    RoomTransfer
} from '../../../types/room';
import { consoleError, ErrorHandler, Notifier } from '../utils';
import { getCollectionListener, getDocumentListener } from './db';

const db = firebase.firestore();
const ff = firebase.functions();

export function registRoomsListener(
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

export function registRoomListener(
    roomId: string,
    onModified: RoomTransfer
): Notifier {
    return db.collection('rooms')
        .doc(roomId)
        .onSnapshot(getDocumentListener<Room>(onModified))
}

export function createRoom(
    roomName: string,
    profileId: string,
    onSucceeded: RoomTransfer,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms').add({
        ownerId: profileId,
        roomName,
        users: [profileId],
        lastUpdate: Date.now()
    })
        .then((docRef) => {
            if (onSucceeded) {
                docRef.get().then(doc => {
                    if (doc.exists) {
                        onSucceeded({
                            ...doc.data() as Room,
                            id: doc.id
                        })
                    }
                }).catch(onFailed)
            }
        })
        .catch(onFailed);
}

export function createContact(
    senderProfileId: string,
    receiverProfileId: string,
    onSucceeded: (roomId:string)=>void,
    onFailed: ErrorHandler = consoleError
){
    const createFn = ff.httpsCallable('createContact');
    createFn({ senderProfileId, receiverProfileId })
        .then(function(result) {
            console.log('create success: ' + JSON.stringify(result));
            const roomId = result.data as string;
            onSucceeded && onSucceeded(roomId);
        })
        .catch(function(err) {
            onFailed(err)
        });

}

export function getRoomsBelongs(
    profileId: string,
    onSucceeded: RoomsTransfer,
    onFailed: ErrorHandler = consoleError
){
    db.collection('rooms')
    .where('users', 'array-contains', profileId)
    .get()
    .then((querySnapshot)=>{
        let results: Room[] = [];
            querySnapshot.forEach((data) => {
                if (data.exists) {
                    results.push({
                        id: data.id,
                        ...data.data()
                    } as Room);
                }
            });
            results.length > 0 && onSucceeded(results);
    })
    .catch(onFailed)
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

export function modifyRoom(
    room: Room,
    onSucceeded ?: () => void,
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

export function deleteRoomPermanently(
    room: Room,
    profileId: string,
    uid: string,
    onSucceeded ?: () => void,
    onFailed: ErrorHandler = consoleError
){
    const deleteFn = ff.httpsCallable('recursiveDelete');
    deleteFn({ path: `/rooms/${room.id}`, room, profileId, uid })
        .then(function(result) {
            console.log('Delete success: ' + JSON.stringify(result));
            onSucceeded && onSucceeded();
        })
        .catch(function(err) {
            onFailed(err)
        });
}

