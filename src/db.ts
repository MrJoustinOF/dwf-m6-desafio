import firebase from "firebase";

// Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAY51xRKdVdFlrXc1CtMHg2sSN6b4uIE9Y",
  authDomain: "dwf-m6-desafio.firebaseapp.com",
  projectId: "dwf-m6-desafio",
  storageBucket: "dwf-m6-desafio.appspot.com",
  messagingSenderId: "680897454436",
  appId: "1:680897454436:web:996881433d99655aee9a71",
});

const db = firebase.firestore();
const rtdb = firebase.database();

export { db, rtdb };
