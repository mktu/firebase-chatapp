import firebase from './firebase';
import { Notifier, ErrorHandler, consoleError } from '../utils';
import { RawTokenTransfer,TokenTransfer,Token } from '../../../types/notification';

const db = firebase.firestore();

let requestPermission : (onSucceeded: Notifier, onFailed: ErrorHandler) =>void = ()=>{};
let onTokenRefresh: (onRefresh: RawTokenTransfer) => void = () => { };
let getToken: (onSucceeded: RawTokenTransfer, onFailed?: ErrorHandler) => void = () => { };
let getPermission: () => NotificationPermission = ()=>'default';
const isMessagingSupported = ()=> firebase.messaging.isSupported();

if (!firebase.messaging.isSupported()) {
  console.log('FCM not supported')
  // FCMサポート対象ブラウザでなければ何もしない ex) Safari
  // firebase-messaging.js broken on iOS Safari 11.1.2 · Issue #1260 · firebase/firebase-js-sdk
  // https://github.com/firebase/firebase-js-sdk/issues/1260
} else {
  requestPermission = (onSucceeded: Notifier, onFailed: ErrorHandler)=>{
    Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        onSucceeded();
      } else {
        onFailed(Error('Unable to get permission to notify.'));
      }
    })
    .catch(onFailed);
  };
  getPermission = ()=>Notification.permission;

  const messaging = firebase.messaging();
  onTokenRefresh = (onRefresh: RawTokenTransfer) => {
    messaging.onTokenRefresh(() => {
      messaging.getToken().then((refreshedToken) => {
        onRefresh(refreshedToken)
      }).catch((err) => {
        console.error('Unable to retrieve refreshed token ', err);
      });
    });
  }
  getToken = (onSucceeded: RawTokenTransfer, onFailed: ErrorHandler = consoleError) => {
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        onSucceeded(currentToken)
      } else {
        onFailed(Error('No Instance ID token available. Request permission to generate one.'))
      }
    }).catch(onFailed);
  }
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    // [END_EXCLUDE]
  });
}

const saveToken = (
  profileId : string,
  token : string,
  onSucceeded ?: () => void,
  onFailed: ErrorHandler = consoleError
)=>{
  db.collection('tokens')
  .doc(token)
  .set({
    profileId
  })
  .then(onSucceeded)
  .catch(onFailed);
}

const getSavedToken = (
  token : string,
  onSucceeded : TokenTransfer,
  onFailed: ErrorHandler = consoleError
)=>{
  db.collection('tokens')
  .doc(token)
  .get()
  .then((doc)=>{
    if(doc.exists){
      onSucceeded({
        ...doc.data() as Token,
        id : doc.id
      });
    }
    else{
      onFailed(Error(`token ${token} does not exist.`))
    }
  })
  .catch(onFailed);
}

const deleteToken = (
  token : string,
  onSucceeded ?: () => void,
  onFailed: ErrorHandler = consoleError
)=>{
  db.collection('tokens')
  .doc(token)
  .delete()
  .then(onSucceeded)
  .catch(onFailed)
}

export {
  onTokenRefresh,
  getToken,
  getPermission,
  requestPermission,
  saveToken,
  deleteToken,
  getSavedToken,
  isMessagingSupported
}
