import firebase from "firebase";

// const initFirebase = () => {
firebase.initializeApp({
  apiKey: "AIzaSyAY51xRKdVdFlrXc1CtMHg2sSN6b4uIE9Y",
  authDomain: "dwf-m6-desafio.firebaseapp.com",
  databaseURL: "https://dwf-m6-desafio-default-rtdb.firebaseio.com/",
  storageBucket: "dwf-m6-desafio.appspot.com",
});
// };

const rtdb = firebase.database();
// export { rtdb, initFirebase };
export { rtdb };
