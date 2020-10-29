# firebase-chatapp
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Demo
https://chatapp-f73df.firebaseapp.com/

## Requirement
### Firebase
This project uses firebase's Authentication and Cloud Fire Store. Please sign up for firebase and enable these services.  
https://firebase.google.com/docs/auth  
https://firebase.google.com/docs/firestore  
### Algolia
This project uses algolia' search api. Please sign up for enable the service.
https://www.algolia.com/

## Usage

1.Set following environment variables in the .env
```
  (.env)
REACT_APP_FIREBASE_DATABASE_URL='*****'
REACT_APP_FIREBASE_API_KEY='*****'
REACT_APP_FIREBASE_AUTH_DOMAIN='*****'
REACT_APP_FIREBASE_PROJECT_ID='*****'
REACT_APP_FIREBASE_MESSAGING_SENDER_ID='*****'
REACT_APP_FIRESTORE_STORAGE_BUCKET='*****'
REACT_APP_FIREBASE_APP_ID='*****'
REACT_APP_ALGOLIA_APP_ID='*****'
REACT_APP_ALGOLIA_API_KEY='*****'
```

2.Installation
```
npm install
npm start
```
