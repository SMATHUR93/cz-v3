import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAst16fVklGUvnXuJGoIAnbjUknP_wA_gc",
    authDomain: "shrek-test-project.firebaseapp.com",
    projectId: "shrek-test-project",
    storageBucket: "shrek-test-project.firebasestorage.app",
    messagingSenderId: "334046816611",
    appId: "1:334046816611:web:f2871bb15470f7c8fe8b56"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);