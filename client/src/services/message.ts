import firebase from './firebase';
import {
    Message,
    MessagesTransfer,
    MessageTransfer
} from '../../../types/message';
import { Notifier, ErrorHandler, consoleError } from '../utils';
import { getCollectionListener } from './db';

const db = firebase.firestore();

export type Order = {
    key: string,
    order: firebase.firestore.OrderByDirection
};

export function registMessagesListener(
    {
        roomId,
        limit,
        order,
        startAfter,
        startAt,
        endAt,
        onAdded,
        onModified,
        onDeleted
    }: {
        roomId: string,
        limit?: number,
        order?: Order,
        startAfter?: any,
        startAt?:any,
        endAt?:any,
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
        query = query.orderBy(order.key, order.order);
    }
    if (startAfter) {
        query = query.startAfter(startAfter);
    }
    if(startAt){
        query = query.startAt(startAt);
    }
    if (limit) {
        query = query.limit(limit);
    }
    if(endAt){
        query = query.endAt(endAt);
    }
    return query
        .onSnapshot(getCollectionListener<Message>(
            onAdded,
            onModified,
            onDeleted,
        ))
}
export function getMessage({
    roomId,
    messageId,
    onSucceeded,
    onFailed = consoleError
}:{
    roomId : string,
    messageId : string,
    onSucceeded : MessageTransfer,
    onFailed? : ErrorHandler
}){
    db.collection('rooms')
    .doc(roomId)
    .collection('messages')
    .doc(messageId)
    .get()
    .then((data)=>{
        if(data.exists){
            onSucceeded({
                id : messageId,
                ...data.data()
            } as Message );
        }
        else{
            onFailed(Error(`room:${roomId},message:${messageId} does not exist`));
        }
    })
    .catch(onFailed);
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
    order: Order,
    cursor?: Message,
    onAdded: MessagesTransfer,
    onFailed?: ErrorHandler,
}) {
    let query = db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy(order.key, order.order);
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
    mentions?: string[],
    onSucceeded?: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .add({
            message,
            profileId,
            mentions,
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
