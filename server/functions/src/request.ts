import {https, runWith, config } from 'firebase-functions';
const firebase_tools = require('firebase-tools');
import { restoreFirestoreToAlgolia } from './algolia';
import { Room } from '../../../types/room';
//import { modifyMessage } from './modification';


export const restoreMessagesToAlgolia = https.onRequest(async (req, res) => {
    await restoreFirestoreToAlgolia(req,res);
});

const hasOwnership = (data : any, callerUid ?: string)=>{
    if(!data || !data.room || !data.profileId || !data.uid) return false;
    const room = data.room as Room;
    const profileId = data.profileId as string;
    const uid = data.uid as string;
    return room.ownerId === profileId && callerUid === uid;
}

const hasAdminPrivilege = (context : https.CallableContext)=>{
    return Boolean(context.auth?.token.admin);
}

export const recursiveDelete = runWith({
    timeoutSeconds: 540,
    memory: '2GB'
}).https.onCall((data, context) => {
    console.log(context.auth)
    console.log(data)
    const ownership = hasOwnership(data, context.auth?.uid);
    const admin = hasAdminPrivilege(context);
    // Only allow admin users to execute this function.
    if (!(ownership || admin)) {
      throw new https.HttpsError(
        'permission-denied',
        'Must be an administrative user to initiate delete.',
        `uid is ${context.auth?.uid}.`
      );
    }

    const path = data.path;
    context.auth && console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    return firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: config().fb.token
      })
      .then(() => {
        return {
          path: path
        };
      });
  });

/* const upgradeFirestore = https.onRequest(async (req, res) => {
    await modifyMessage(req,res);
});

export {
    upgradeFirestore
} */