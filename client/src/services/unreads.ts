import firebase from './firebase';
import { 
    Unread, 
    UnreadTransfer, 
} from '../../../types/unread';
import { Notifier } from '../utils';
import { getDocumentListener } from './db';

const db = firebase.firestore();

export function registUnreadsListener(
    roomId: string,
    profileId: string,
    onModified: UnreadTransfer,
): Notifier {
    return db.collection('rooms')
        .doc(roomId)
        .collection('unreads')
        .doc(profileId)
        .onSnapshot(getDocumentListener<Unread>(
            onModified
        ))
}

export function clearUnread(
    roomId: string,
    profileId: string,
    ){
        db.collection('rooms')
        .doc(roomId)
        .collection('unreads')
        .doc(profileId)
        .update({
            messageIds : []
        })
}