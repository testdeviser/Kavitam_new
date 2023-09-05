import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB24PCT-aOcD4sWvdqhHprnaRW-UnUNeWI",
    authDomain: "kavitam-f583c.firebaseapp.com",
    databaseURL: "https://kavitam-f583c-default-rtdb.firebaseio.com",
    projectId: "kavitam-f583c",
    storageBucket: "kavitam-f583c.appspot.com",
    messagingSenderId: "41954438926",
    appId: "1:41954438926:web:f010162141b77ce975b15f",
    measurementId: "G-WRRBLXSV06"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

export default database;