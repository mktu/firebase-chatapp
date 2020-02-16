import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Message } from '../../../types/message';

admin.initializeApp();

exports.sendNotifications = functions.firestore.document('rooms/{roomId}/messages/{messageId}').onCreate(
    async (snapshot : DocumentSnapshot) => {
      // Notification details.
      if(!snapshot.exists){
        console.error('document not exists')
        return;
      }
      const message = snapshot.data() as Message;
      const payload = {
        notification: {
          title: 'NEW MESSAGE',
          body: message,
          click_action: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
        }
      };
      console.log(payload)
  
    //   // Get the list of device tokens.
    //   const allTokens = await admin.firestore().collection('fcmTokens').get();
    //   const tokens = [];
    //   allTokens.forEach((tokenDoc) => {
    //     tokens.push(tokenDoc.id);
    //   });
  
    //   if (tokens.length > 0) {
    //     // Send notifications to all tokens.
    //     const response = await admin.messaging().sendToDevice(tokens, payload);
    //     await cleanupTokens(response, tokens);
    //     console.log('Notifications have been sent and tokens cleaned up.');
    //   }
});

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