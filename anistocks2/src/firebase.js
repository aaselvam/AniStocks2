import firebase from 'firebase';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDhUFLdhG2FsrqHbnRqKViBha0Ui4mjlQ4",
    authDomain: "anistocks2.firebaseapp.com",
    projectId: "anistocks2",
    storageBucket: "anistocks2.appspot.com",
    messagingSenderId: "133880812371",
    appId: "1:133880812371:web:9a65ad3edc3d46e65d87a6",
    measurementId: "G-ZLN40C8BBZ"
};

var fire = firebase.initializeApp(firebaseConfig);
export const firestore = fire.firestore()
export default fire;