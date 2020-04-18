import {https} from 'firebase-functions';
import { restoreFirestoreToAlgolia } from './algolia';


export const restoreMessagesToAlgolia = https.onRequest(async (req, res) => {
    await restoreFirestoreToAlgolia(req,res);
});