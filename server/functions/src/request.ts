import { https, runWith, config } from 'firebase-functions';
const firebase_tools = require('firebase-tools');
import { restoreFirestoreToAlgolia } from './algolia';
import { Room } from '../../../types/room';
import firebaseAdmin from './admin';


export const restoreMessagesToAlgolia = https.onRequest(async (req, res) => {
  await restoreFirestoreToAlgolia(req, res);
});

const hasOwnership = (data: any, callerUid?: string) => {
  if (!data || !data.room || !data.profileId || !data.uid) return false;
  const room = data.room as Room;
  const profileId = data.profileId as string;
  const uid = data.uid as string;
  return room.ownerId === profileId && callerUid === uid;
}

const hasAdminPrivilege = (context: https.CallableContext) => {
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

export const createContact = https.onCall(async (data, context) => {
  const { senderProfileId, receiverProfileId } = data as { senderProfileId: string, receiverProfileId: string };
  const contacts = await firebaseAdmin.firestore()
    .collection('rooms')
    .where('contact', 'array-contains-any', [senderProfileId, receiverProfileId])
    .get();

  const found = contacts.docs.some(doc => {
    if (!doc.exists) {
      return false;
    }
    const val = doc.data() as Room;

    if (!val.contact) {
      return false;
    }
    return val.contact.every(c => {
      return [senderProfileId, receiverProfileId].includes(c);
    })
  })
  if (found) {
    throw new https.HttpsError(
      'failed-precondition',
      'The contact already exists',
      `uid is ${context.auth?.uid}.`
    );
  }
  const batch = firebaseAdmin.firestore().batch();

  const newRoomDoc = firebaseAdmin.firestore().collection('rooms').doc();
  const contactDoc = firebaseAdmin.firestore().collection('profiles').doc(senderProfileId).collection('contacts').doc(receiverProfileId)

  batch.create(newRoomDoc, {
    roomName: 'contact',
    contact: [senderProfileId, receiverProfileId],
    users: [senderProfileId],
    lastUpdate: Date.now()
  });
  batch.update(contactDoc, {
    roomId: newRoomDoc.id
  });

  await batch.commit();

  return newRoomDoc.id
})

export const activateContact = https.onCall(async (data, context) => {
  const {
    roomId,
  } = data as {
    roomId: string,
  }

  const roomDoc = firebaseAdmin.firestore().collection('rooms').doc(roomId);
  const room = (await roomDoc.get()).data() as Room;
  if (!room.contact) {
    throw new https.HttpsError(
      'failed-precondition',
      'The selected room isn not contact room',
      `room id is ${roomId}.`
    );
  }
  const batch = firebaseAdmin.firestore().batch();

  for (const c of room.contact.filter(v=>!room.users.includes(v))) {
    for (const c2 of room.contact.filter(v=>v!==c)) {
      const profileDoc = firebaseAdmin.firestore().collection('profiles').doc(c).collection('contacts').doc(c2);
      batch.set(profileDoc, {
        roomId,
        enable : true
      })
    }
  }
  batch.update(roomDoc, {users: room.contact, initContact : true})
  await batch.commit();
})

export const blockContact = https.onCall(async (data, context) => {
  const {
    roomId,
    callerProfileId,
    blockProfileId
  } = data as {
    roomId: string,
    callerProfileId: string,
    blockProfileId: string
  }

  const roomDoc = firebaseAdmin.firestore().collection('rooms').doc(roomId);
  const contactDoc = firebaseAdmin.firestore().collection('profiles').doc(callerProfileId).collection('contacts').doc(blockProfileId);

  const room = (await roomDoc.get()).data() as Room;
  if (!room.contact) {
    throw new https.HttpsError(
      'failed-precondition',
      'The selected room isn not contact room',
      `room id is ${roomId}.`
    );
  }
  const batch = firebaseAdmin.firestore().batch();
  batch.update(contactDoc, {
    enable : false
  })
  batch.update(roomDoc, {
    users : room.users.filter(pId=>pId!==callerProfileId)
  })
  await batch.commit();
})

/* const upgradeFirestore = https.onRequest(async (req, res) => {
    await modifyMessage(req,res);
});

export {
    upgradeFirestore
} */