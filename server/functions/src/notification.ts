import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Message } from '../../../types/message';
import { Profile } from '../../../types/profile';
import admin from './admin';

export const sendNotifications = async (snapshot: DocumentSnapshot, context: functions.EventContext) => {
    const { roomId, messageId } = context.params;
    // Notification details.
    if (!snapshot.exists) {
        console.error('document not exists')
        return;
    }
    const message = snapshot.data() as Message;
    if (!message.mentions || message.mentions.length === 0) {
        return;
    }
    if (!message.profileId) {
        console.error('profileId is not defined')
        return;
    }

    const profile = await admin
        .firestore()
        .collection('profiles')
        .doc(message.profileId)
        .get();

    if (!profile.exists) {
        console.error(`profile ${message.profileId} is not exists.`)
        return;
    }

    const nickname = (profile.data() as Profile).nickname;

    // Get the list of device tokens.
    const allTokens = await admin
        .firestore()
        .collection('tokens')
        .where('profileId', 'in', message.mentions)
        .get();

    const tokens: string[] = [];
    allTokens.forEach((tokenDoc) => {
        tokens.push(tokenDoc.id);
    });

    if (tokens.length > 0) {

        const payload: admin.messaging.MulticastMessage = {
            notification: {
                title: `Message from ${nickname}`,
                body: message.message,
            },
            webpush: {
                fcmOptions: {
                    link: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com/rooms/${roomId}`
                }
            },
            tokens,
            data: {
                messageId
            }
        };
        // Send notifications to all tokens.
        const response = await admin.messaging().sendMulticast(payload)
        console.log(response);
        //await cleanupTokens(response, tokens);
        console.log('Notifications have been sent and tokens cleaned up.');
    }
};

    // Cleans up the tokens that are no longer valid.
// function cleanupTokens(response, tokens) {
//     // For each notification we check if there was an error.
//     const tokensDelete = [];
//     response.results.forEach((result, index) => {
//       const error = result.error;
//       if (error) {
//         console.error('Failure sending notification to', tokens[index], error);
//         // Cleanup the tokens who are not registered anymore.
//         if (error.code === 'messaging/invalid-registration-token' ||
//             error.code === 'messaging/registration-token-not-registered') {
//           const deleteTask = admin.firestore().collection('fcmTokens').doc(tokens[index]).delete();
//           tokensDelete.push(deleteTask);
//         }
//       }
//     });
//     return Promise.all(tokensDelete); 
//   }