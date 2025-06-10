// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_l7koOjCYTFhxAL46KSzS0fkFXe30ii0",
    authDomain: "katkol-lab3.firebaseapp.com",
    projectId: "katkol-lab3",
    storageBucket: "katkol-lab3.appspot.com",
    messagingSenderId: "494364547414",
    appId: "1:494364547414:web:c018a17205499d1f3fdef7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;