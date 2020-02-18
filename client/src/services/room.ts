import firebase from './firebase';
import { 
    Room, 
    RoomsTransfer, 
    RoomTransfer
} from '../../../types/room';
import { consoleError, ErrorHandler, Notifier } from '../utils';
import { getCollectionListener, getDocumentListener } from './db';

const db = firebase.firestore();

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
