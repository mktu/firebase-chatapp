import firebase from './firebase';
import {
    Message,
    MessagesTransfer,
} from '../types/message';
import { Notifier, ErrorHandler, consoleError } from '../utils';
import { getCollectionListener } from './db';

const db = firebase.firestore();

export function registMessagesListener(
    {
        roomId,
        limit,
        order,
        start,
        onAdded,
        onModified,
        onDeleted
    }: {
        roomId: string,
        limit?: number,
        order?: {
            key: string,
            direction: firebase.firestore.OrderByDirection
        }
        start?: any,
        onAdded: MessagesTransfer,
        onModified: MessagesTransfer,
        onDeleted: MessagesTransfer,
    }
): Notifier {
    let query:
        firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | firebase.firestore.Query<firebase.firestore.DocumentData>
        = db.collection('rooms')
            .doc(roomId)
            .collection('messages');
    if (order) {
        query = query.orderBy(order.key, order.direction);
    }
    if (start) {
        query = query.startAfter(start);
    }
    if (limit) {
        query = query.limit(limit);
    }
    return query
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
}: {
    roomId: string,
    limit: number,
    order: firebase.firestore.OrderByDirection,
    cursor?: Message,
    onAdded: MessagesTransfer,
    onFailed?: ErrorHandler,
}) {
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

export function addReaction(
    roomId: string,
    messageId: string,
    reactionId: string,
    profileId: string,
    onSucceeded?: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    const docRef = db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(messageId);
    db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (!doc.exists) {
                onFailed(Error(`Document ${roomId} : ${messageId} does not exist!`));
                return;
            }
            const data = doc.data() as Message;
            const reactions = data.reactions ? data.reactions : {};
            const profileIds = reactions[reactionId] || [];
            if(profileIds.includes(profileId)){
                return;
            }
            const newReactions = {
                ...reactions,
                [reactionId] : [...profileIds,profileId]
            }
            const newData : Message = {
                ...data,
                reactions:newReactions
            }
            transaction.update(docRef, newData);
        });
    })
    .then(onSucceeded)
    .catch(onFailed);
}
