import { firestore, https, EventContext, Change, Response } from 'firebase-functions';
import algoliasearch from 'algoliasearch';
import { Message } from '../../../types/message';
import { Room } from '../../../types/room';
import firebaseAdmin from './admin';

type MessageIndex = Message & {
    objectID: string,
    roomId: string,
};

const client = process.env.ALGOLIA_APP_ID
    && process.env.ALGOLIA_API_KEY
    && algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const index = client && client.initIndex("messages");

export const createMessage = async (snap: firestore.DocumentSnapshot, context: EventContext) => {
    if (!index) {
        console.error('index not defined');
        return;
    }
    const message = snap.data() as MessageIndex;
    message.roomId = context.params.roomId;
    message.objectID = context.params.messageId;
    message.id = context.params.messageId;

    index.saveObject(message);
};

export const updateMessage = async (change: Change<firestore.DocumentSnapshot>, context: EventContext) => {
    if (!index) {
        console.error('index not defined');
        return;
    }
    const message = change.after.data() as MessageIndex;
    const messagesBefore = change.before.data() as MessageIndex;
    
    // update algolia index only when "message" and "disable" field changes
    if (message.message === messagesBefore.message &&
        message.disable === messagesBefore.disable) {
        return;
    }

    message.roomId = context.params.roomId;
    message.id = context.params.messageId;
    message.objectID = change.after.id;

    index.saveObject(message);
};

export const deleteMessage = async (snap: firestore.DocumentSnapshot, context: EventContext) => {
    if (!index) {
        console.error('index not defined');
        return;
    }
    const objectId = snap.id;
    index.deleteObject(objectId);
};

export const restoreFirestoreToAlgolia = async (req: https.Request, res: Response) => {
    if (!index) {
        console.error('index not defined');
        return;
    }
    const rooms: Room[] = [];
    try {
        await index.clearObjects();

        const roomDocs = await firebaseAdmin.firestore()
            .collection('rooms')
            .get();
        roomDocs.forEach((doc) => {
            const room = doc.data() as Room;
            room.id = doc.id;
            rooms.push(room);
        });
        await Promise.all(rooms.map(async (room) => {
            const mesages: MessageIndex[] = [];
            const messageDocs = await firebaseAdmin.firestore()
                .collection('rooms')
                .doc(room.id)
                .collection('messages')
                .get();
            messageDocs.forEach((doc) => {
                const mesage = doc.data() as MessageIndex;
                mesage.id = doc.id;
                mesage.roomId = room.id;
                mesage.objectID = doc.id;
                mesages.push(mesage);
            });
            index.saveObjects(mesages);
        }))
        res.status(200).send('succeeded');
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
};