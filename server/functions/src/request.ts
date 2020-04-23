import {https} from 'firebase-functions';
import { restoreFirestoreToAlgolia } from './algolia';
//import { modifyMessage } from './modification';


export const restoreMessagesToAlgolia = https.onRequest(async (req, res) => {
    await restoreFirestoreToAlgolia(req,res);
});

/* const upgradeFirestore = https.onRequest(async (req, res) => {
    await modifyMessage(req,res);
});

export {
    upgradeFirestore
} */