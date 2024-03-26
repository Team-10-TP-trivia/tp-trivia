import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// To handle the Firebase config, we need to parse the JSON string(if we are using .env file) to an object

//const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

const firebaseConfig = {
    "apiKey":"AIzaSyD7MXwWyTsKXkhV1kx2scGX1BVG9TxeB5I","authDomain":"tppt-trivia.firebaseapp.com","projectId":"tppt-trivia","storageBucket":"tppt-trivia.appspot.com","messagingSenderId":"141133927850","appId":"1:141133927850:web:457df4ba375fc85587c7d3","databaseURL":"https://tppt-trivia-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);