import firebase from './firebase';
import {
    Message,
    MessageImage,
    MessagesTransfer,
    MessageTransfer
} from '../../../types/message';
import { Notifier, ErrorHandler, consoleError } from '../utils';
import { getCollectionListener, UnsubscribeNotifier } from './db';

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

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
        startAt?: any,
        endAt?: any,
        onAdded: MessagesTransfer,
        onModified: MessagesTransfer,
        onDeleted: MessagesTransfer,
    }
): Notifier {
    let query:
        firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | firebase.firestore.Query<firebase.firestore.DocumentData>
        = db.collection('rooms')
            .doc(roomId)
            .collection('messages')

    if (order) {
        query = query.orderBy(order.key, order.order);
    }
    if (startAfter) {
        query = query.startAfter(startAfter);
    }
    if (startAt) {
        query = query.startAt(startAt);
    }
    if (limit) {
        query = query.limit(limit);
    }
    if (endAt) {
        query = query.endAt(endAt);
    }
    const notifier: UnsubscribeNotifier = {
        unsubscribe: false
    }
    const unsubscribe = query
        .onSnapshot(getCollectionListener<Message>(
            onAdded,
            onModified,
            onDeleted,
            notifier
        ))
    return () => {
        notifier.unsubscribe = true;
        unsubscribe();
    }
}
export function getMessage({
    roomId,
    messageId,
    onSucceeded,
    onFailed = consoleError
}: {
    roomId: string,
    messageId: string,
    onSucceeded: MessageTransfer,
    onFailed?: ErrorHandler
}) {
    db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(messageId)
        .get()
        .then((data) => {
            if (data.exists) {
                onSucceeded({
                    id: messageId,
                    ...data.data()
                } as Message);
            }
            else {
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

export function getLatestMessage(
    {
        roomId,
        onAdded,
        onFailed = consoleError

    }: {
        roomId: string,
        onAdded: MessageTransfer,
        onFailed?: ErrorHandler,
    }
) {
    getMessages({
        roomId,
        limit: 1,
        order: { key: 'date', order: 'desc' },
        onAdded: (items) => {
            items.length > 0 && onAdded(items[0])
        },
        onFailed
    });
}

export function getOldestMessage(
    {
        roomId,
        onAdded,
        onFailed = consoleError

    }: {
        roomId: string,
        onAdded: MessageTransfer,
        onFailed?: ErrorHandler,
    }
) {
    getMessages({
        roomId,
        limit: 1,
        order: { key: 'date', order: 'asc' },
        onAdded: (items) => {
            items.length > 0 && onAdded(items[0])
        },
        onFailed
    });
}

export function createMessage(
    {
        roomId,
        message,
        senderId,
        senderName,
        mentions,
        images,
        onSucceeded,
        onFailed = consoleError
    }:
        {
            roomId: string,
            message: string,
            senderId: string,
            senderName: string,
            mentions?: string[],
            images?: MessageImage[],
            onSucceeded?: Notifier,
            onFailed?: ErrorHandler
        }
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .add({
            message,
            roomId,
            senderId,
            senderName,
            mentions : mentions || [],
            images : images || [],
            date: Date.now()
        })
        .then(onSucceeded)
        .catch(onFailed);
}

export function editMessage(
    {
        roomId,
        messageId,
        message,
        mentions,
        images,
        onSucceeded,
        onFailed = consoleError
    }
        : {
            roomId: string,
            messageId: string,
            message: string,
            mentions?: string[],
            images?: MessageImage[],
            onSucceeded?: Notifier,
            onFailed?: ErrorHandler
        }
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(messageId)
        .set({
            message,
            mentions : mentions || [],
            images : images || [],
            update: Date.now()
        }, { merge: true })
        .then(onSucceeded)
        .catch(onFailed)
}

export function disableMessage(
    roomId: string,
    messageId: string,
    onSucceeded?: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(messageId)
        .set({
            disable: true,
            message: '',
            update: Date.now()
        }, { merge: true })
        .then(onSucceeded)
        .catch(onFailed)
}

export function addReaction(
    {
        roomId,
        messageId,
        reactionId,
        profileId,
        onSucceeded,
        onFailed = consoleError
    }
        : {
            roomId: string,
            messageId: string,
            reactionId: string,
            profileId: string,
            onSucceeded?: Notifier,
            onFailed?: ErrorHandler
        }
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
            if (profileIds.includes(profileId)) {
                return;
            }
            const newReactions = {
                ...reactions,
                [reactionId]: [...profileIds, profileId]
            }
            const newData: Message = {
                ...data,
                reactions: newReactions
            }
            transaction.update(docRef, newData);
        });
    })
        .then(onSucceeded)
        .catch(onFailed);
}

export function addReadFlags(
    roomId: string,
    myProfileId: string,
    messages: Message[],
    onSucceeded?: Notifier,
    onFailed: ErrorHandler = consoleError
) {
    const batch = db.batch();
    messages.forEach(message => {
        if (message.senderId === myProfileId) {
            return;
        }
        const readers = message.readers || [];
        if (readers.includes(myProfileId)) {
            return;
        }
        const docRef = db
            .collection('rooms')
            .doc(roomId)
            .collection('messages')
            .doc(message.id);
        batch.update(docRef, {
            readers: [...readers, myProfileId]
        })
    });
    batch.commit()
        .then(onSucceeded)
        .catch(onFailed)
}

export function uploadMessageImage(
    profileId: string,
    image: File,
    onProgress?: (progress: number, status: 'paused' | 'running') => void,
) {
    return new Promise<string>((resolve, reject) => {
        const task = storageRef.child(`messages/${profileId}/${image.name}`).put(image);
        task.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    onProgress && onProgress(progress, 'paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    onProgress && onProgress(progress, 'running');
                    break;
            }
        }, reject, () => {
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                resolve(downloadURL);
            });
        })
    })

}