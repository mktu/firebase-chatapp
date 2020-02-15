import firebase from './firebase';

function setup(){
    const messaging = firebase.messaging();
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // ...
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
    messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
          console.log('Token refreshed.');
          // Indicate that the new Instance ID token has not yet been sent to the
          // app server.
          console.log(refreshedToken)
        }).catch((err) => {
          console.log('Unable to retrieve refreshed token ', err);
        });
      });


      messaging.onMessage((payload) => {
        console.log('Message received. ', payload);
        // [START_EXCLUDE]
        // Update the UI to include the received message.
        // [END_EXCLUDE]
      });

      messaging.getToken().then((currentToken) => {
        if (currentToken) {
            console.log(currentToken)
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.');
          // Show permission UI.
          
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
}

if (!firebase.messaging.isSupported()) {
    console.log('FCM not supported')
    // FCMサポート対象ブラウザでなければ何もしない ex) Safari
    // firebase-messaging.js broken on iOS Safari 11.1.2 · Issue #1260 · firebase/firebase-js-sdk
    // https://github.com/firebase/firebase-js-sdk/issues/1260
} else {
    setup();
}

function dummy(){

}

export {
    dummy
};