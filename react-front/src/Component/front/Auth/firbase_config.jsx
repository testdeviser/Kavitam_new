import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfDuX1kUdF9zSMBhhAlWWGwgz-NO8z0PI",
  authDomain: "auth-8488b.firebaseapp.com",
  projectId: "auth-8488b",
  storageBucket: "auth-8488b.appspot.com",
  messagingSenderId: "835684764152",
  appId: "1:835684764152:web:73cdbf2a7c2d2d44fdae0d",
  measurementId: "G-D26H13V6P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
