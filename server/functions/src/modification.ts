import { https, Response, firestore, EventContext, } from 'firebase-functions';
import { Message } from '../../../types/message';
import { Room } from '../../../types/room';
import { Profile } from '../../../types/profile';
import admin from './admin';

export const updateReadCounter = async (snap: firestore.DocumentSnapshot, context: EventContext) => {
    const { roomId, messageId } = context.params;
    const message = snap.data() as Message;
    const roomDoc = await admin.firestore()
        .collection('rooms')
        .doc(roomId)
        .get();
    const room = roomDoc.data() as Room;
    const users = room.users.filter(u=>u!==message.senderId);
    const batch = admin.firestore().batch();
    users.forEach(user => {
        const unreadDoc = admin.firestore()
            .collection('rooms')
            .doc(roomId)
            .collection('unreads')
            .doc(user)
        batch.set(unreadDoc, {messageIds:admin.firestore.FieldValue.arrayUnion(messageId)}, {merge : true});
    });
    await batch.commit();
}

export const modifyMessage = async (req: https.Request, res: Response) => {
    const rooms: Room[] = [];
    const profiles: Profile[] = [];
    const roomDocs = await admin.firestore()
        .collection('rooms')
        .get();
    roomDocs.forEach((doc) => {
        const room = doc.data() as Room;
        room.id = doc.id;
        rooms.push(room);
    });
    const profileDocs = await admin.firestore()
        .collection('profiles')
        .get();
    profileDocs.forEach(doc => {
        const profile = doc.data() as Profile;
        profile.id = doc.id;
        profiles.push(profile);
    })
    await Promise.all(rooms.map(async (room) => {
        const batch = admin.firestore().batch();
        const messageDocs = await admin.firestore()
            .collection('rooms')
            .doc(room.id)
            .collection('messages')
            .get();
        messageDocs.forEach((doc) => {
            const mesage = doc.data() as Message;
            mesage.id = doc.id;
            const profile = profiles.find(p => p.id === mesage.senderId);
            const docRef = admin.firestore()
                .collection('rooms')
                .doc(room.id)
                .collection('messages')
                .doc(doc.id);
            batch.update(docRef, {
                roomId: room.id,
                roomName: room.roomName,
                senderName: profile?.nickname,
                senderId: profile?.id,
            })
        });
        await batch.commit();
    }))
    res.status(200).send('succeeded');
}