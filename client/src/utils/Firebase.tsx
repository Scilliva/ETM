import firebase from 'firebase';
import keys from '../data/keys.json';

firebase.initializeApp(keys.FIREBASE);

export default firebase;
