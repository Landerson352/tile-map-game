import React from 'react'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import { createStore, combineReducers } from 'redux'
import {
  ReactReduxFirebaseProvider as DefaultReactReduxFirebaseProvider,
  firebaseReducer
} from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB8AOMms6Cra-GVTM4QqFKDbkKNyWwqvoQ',
  authDomain: 'tile-map-game.firebaseapp.com',
  databaseURL: 'https://tile-map-game.firebaseio.com',
  projectId: 'tile-map-game',
  storageBucket: 'tile-map-game.appspot.com',
  messagingSenderId: '436993879207',
  appId: '1:436993879207:web:f29dc386d7694dce62bf82',
};

// Initialize firebase instance and services
firebase.initializeApp(firebaseConfig);
firebase.auth();
firebase.firestore();

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

// Create store with reducers and initial state
const initialState = {};
const store = createStore(rootReducer, initialState);

const reactReduxFirebaseProps = {
  firebase,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
  },
  dispatch: store.dispatch,
  createFirestoreInstance
};

const ReactReduxFirebaseProvider = (props) => (
  <Provider store={store}>
    <DefaultReactReduxFirebaseProvider {...reactReduxFirebaseProps}>
      {props.children}
    </DefaultReactReduxFirebaseProvider>
  </Provider>
);

export default ReactReduxFirebaseProvider;
