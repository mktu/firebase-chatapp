import firebase from './firebase';
import {
    Message,
    MessagesTransfer,
    MessageTransfer
} from '../types/message';
import { Notifier, ErrorHandler, consoleError } from '../utils';
import { getCollectionListener } from './db';

const db = firebase.firestore();

export function registMessagesListener(
    roomId: string,
    limit: number,
    onAdded: MessagesTransfer,
    onModified: MessagesTransfer,
    onDeleted: MessagesTransfer,
): Notifier {
    return db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('date', 'desc')
        .limit(limit)
        .onSnapshot(getCollectionListener<Message>(
            onAdded,
            onModified,
            onDeleted,
        ))
}

export function getMessages({
    roomId,
    limit,
    order,
    cursor,
    onAdded,
    onFailed = consoleError
}:{
    roomId: string,
    limit: number,
    order: firebase.firestore.OrderByDirection,
    cursor?: Message,
    onAdded: MessagesTransfer,
    onFailed?: ErrorHandler,
}){
    let query = db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('date', order);
    if (cursor) {
        query = query.startAfter(cursor.date);
    }
    query.limit(limit)
        .get()
        .then((querySnapshot) => {
            let results: Message[] = [];
            querySnapshot.forEach((data) => {
                if (data.exists) {
                    results.push({
                        id: data.id,
                        ...data.data()
                    } as Message);
                }
            });
            results.length > 0 && onAdded(results);
        })
        .catch(onFailed)
}

export function createMessage(
    roomId: string,
    message: string,
    profileId: string,
    onSucceeded?: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .add({
            message,
            profileId,
            date: Date.now()
        })
        .then(onSucceeded)
        .catch(onFailed);
}