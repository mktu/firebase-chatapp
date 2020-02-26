import firebase from './firebase';
import { Notifier, ErrorHandler, consoleError } from '../utils';
import { TokenTransfer } from '../../../types/notification';

const db = firebase.firestore();

let requestPermission : (onSucceeded: Notifier, onFailed: ErrorHandler) =>void = ()=>{};
let onTokenRefresh: (onRefresh: TokenTransfer) => void = () => { };
let getToken: (onSucceeded: TokenTransfer, onFailed: ErrorHandler) => void = () => { };

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

  const messaging = firebase.messaging();
  onTokenRefresh = (onRefresh: TokenTransfer) => {
    messaging.onTokenRefresh(() => {
      messaging.getToken().then((refreshedToken) => {
        onRefresh(refreshedToken)
      }).catch((err) => {
        console.error('Unable to retrieve refreshed token ', err);
      });
    });
  }
  getToken = (onSucceeded: TokenTransfer, onFailed: ErrorHandler) => {
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
  db.collection('tokens').doc(token).set({
    profileId
  })
  .then(onSucceeded)
  .catch(onFailed);
}

export {
  onTokenRefresh,
  getToken,
  requestPermission,
  saveToken
}
