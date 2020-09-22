import { config } from 'dotenv';
config();
import * as firebase from '@firebase/testing';
import * as fs from 'fs';

describe('permissionTest', ()=>{
    const projectId = process.env.FIREBASE_PROJECT_ID || 'error';
    
    beforeAll(
        async () => {
            const rules = fs.readFileSync('../firestore.rules', 'utf8');
            await firebase.loadFirestoreRules({
                projectId,
                rules,
            });
        }
    );

    afterAll(
        async () => {
            await firebase.clearFirestoreData({
                projectId
               });
            await Promise.all(
                firebase.apps().map((app) => app.delete()) 
            );
        }
    );

    function authedApp(auth:object) {
        return firebase.initializeTestApp({
            projectId,
            auth,
        }).firestore();
    }

    function unAuthedApp() {
        return firebase.initializeTestApp({
            projectId,
        }).firestore();
    }
    
    describe('roomPermission', ()=>{
        test('testValidRoom', async ()=>{
            const db = authedApp({ uid: 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3' });
            const doc = db.collection('rooms').doc('valid');
            await firebase.assertSucceeds(doc.set({roomName: 'reds'}))
        })
        test('testNullUid', async ()=>{
            const db = unAuthedApp();
            const doc = db.collection('rooms').doc('nullUid');
            await firebase.assertFails(doc.set({roomName: 'reds'}))
        })
    })

    describe('messagesPermission', ()=>{
        test('testValidMessage', async ()=>{
            const db = authedApp({ uid: 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3' });
            const doc = db.collection('rooms').doc('valid').collection('messages').doc('valid');
            await firebase.assertSucceeds(doc.set({messages: 'this is test'}))
        })
        test('testNullUid', async ()=>{
            const db = unAuthedApp();
            const doc = db.collection('rooms').doc('nullUid');
            await firebase.assertFails(doc.set({roomName: 'reds'}))
        })
    })

    describe('requestsPermission', ()=>{
        test('testValidRequest', async ()=>{
            const db = authedApp({ uid: 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3' });
            const doc = db.collection('rooms').doc('valid').collection('requests').doc('valid');
            await firebase.assertSucceeds(doc.set({status: 'accepted'}))
        })
        test('testNullUid', async ()=>{
            const db = unAuthedApp();
            const doc = db.collection('rooms').doc('nullUid').collection('requests').doc('invalid');
            await firebase.assertFails(doc.set({status: 'rejected'}))
        })
    })

    describe('profilePermission', ()=>{
        test('testValidUid', async ()=>{
            const db = authedApp({ uid: 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3' });
            const doc = db.collection('profiles').doc('valid');
            await firebase.assertSucceeds(doc.set({nickname: 'Nick', uid : 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3'}))
            await firebase.assertSucceeds(doc.update({nickname: 'Nick2', uid : 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3'}))
        })
        test('testNullUid', async ()=>{
            const db = unAuthedApp();
            const doc = db.collection('profiles').doc('nullUid');
            await firebase.assertFails(doc.set({nickname: 'Nick'}))
        })
        test('testInvalidUid', async ()=>{
            const db = authedApp({ uid: 'invalid' });
            const doc = db.collection('profiles').doc('invalidUid');
            await doc.set({nickname: 'Nick'})
            await firebase.assertFails(doc.update({nickname: 'Nick2'}))
        })
    })

    describe('contactPermission', ()=>{
        test('testValidUid', async ()=>{
            const db = authedApp({ uid: 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3' });
            const doc = db.collection('profiles').doc('validContact').collection('contacts').doc('valid');
            await firebase.assertSucceeds(doc.set({enable: true}))
        })
        test('testNullUid', async ()=>{
            const db = unAuthedApp();
            const doc = db.collection('profiles').doc('invalidContact').collection('contacts').doc('invalid');
            await firebase.assertFails(doc.set({enable: false}))
        })
    })

    describe('tokenPermission', ()=>{
        test('testValidToken', async ()=>{
            const db = authedApp({ uid: 'tAFWJ8p1jQXFWG4p5GAa5nrwxgG3' });
            const doc = db.collection('tokens').doc('valid');
            await firebase.assertSucceeds(doc.set({profileId: 'Nick'}))
        })
        test('testNullUid', async ()=>{
            const db = unAuthedApp();
            const doc = db.collection('tokens').doc('nullUid');
            await firebase.assertFails(doc.set({profileId: 'Nick'}))
        })
    })
    
})

