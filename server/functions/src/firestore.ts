import { firestore } from 'firebase-functions';
import * as algolia from './algolia';
import { sendNotifications } from './notification';
import { updateReadCounter } from './modification';

export const onMessageCreate = firestore.document('rooms/{roomId}/messages/{messageId}').onCreate(async (snap, context) => {
    await Promise.all(
        [
            algolia.createMessage,
            sendNotifications,
            updateReadCounter
        ].map(async f => {
            try {
                await f(snap, context)
            } catch (error) {
                console.error(error)
            }
        })
    )
});

export const onMessageUpdate = firestore.document('rooms/{roomId}/messages/{messageId}').onUpdate(async (change, context) => {
    await algolia.updateMessage(change, context);
});

export const onMessageDelete = firestore.document('rooms/{roomId}/messages/{messageId}').onDelete(async (snap, context) => {
    await algolia.deleteMessage(snap, context);
});
