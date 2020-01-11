import firebase from './firebase';
import { Transfer, Room } from '../types/room';
import { consoleError, consoleLogger, ErrorHandler, Notifier } from '../utils';

const db = firebase.firestore();

export function registListener(
    onAdded : Transfer, 
    onModified : Transfer,
    onDeleted : Transfer, 
    profileId : string
    ) : Notifier {
    return db.collection('rooms').where('users', 'array-contains', profileId)
        .onSnapshot(function (querySnapshot) {
            let added : Room[] = [];
            let modified : Room[] = [];
            let deleted : Room[] = [];
            for (let change of querySnapshot.docChanges()) {
                const data = change.doc.data() as Room;
                const room = {
                    ...data,
                    id: change.doc.id
                };
                if (change.type === 'added') {
                    added.push(room);
                }
                else if (change.type === 'modified') {
                    modified.push(room);
                }
                else if (change.type === 'removed') {
                    deleted.push(room)
                }
            }
            if(added.length > 0){
                onAdded(added);
            }
            if(modified.length > 0){
                onModified(modified);
            }
            if(deleted.length > 0){
                onDeleted(deleted);
            }
        })
}

export function createRoom(
    roomName: string,
    profileId: string,
    onSucceeded : Notifier,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms').add({
        ownerId: profileId,
        roomName,
        users : [profileId],
        lastUpdate: Date.now()
    })
        .then(onSucceeded)
        .catch(onFailed);
}

// export function getRooms(
//     profileId: string,
//     onSucceeded: Transfer,
//     onFailed: ErrorHandler = consoleError
// ) {
//     db.collection('rooms')
//         .where('users', 'array-contains', profileId)
//         .get()
//         .then(function (querySnapshot) {
//             if (querySnapshot.size === 0) {
//                 onFailed(Error('Not found a profile of the selected user'))
//                 return;
//             }
//             const data = {
//                 id: querySnapshot.docs[0].id,
//                 ...querySnapshot.docs[0].data()
//             } as Room;
//             onSucceeded(data);
//         })
//         .catch(onFailed);
// }
export function modifyProfile(
    room: Room,
    onSucceeded : ()=>void | undefined,
    onFailed : ErrorHandler = consoleError
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
    onFailed : ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(room.id)
        .delete()
        .catch(onFailed);
}