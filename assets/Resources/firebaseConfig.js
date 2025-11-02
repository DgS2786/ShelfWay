// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCoNitL2qLU8CpspHAeV2XoI98qqMbSK9s",
    authDomain: "test-8a848.firebaseapp.com",
    databaseURL: "https://test-8a848-default-rtdb.firebaseio.com",
    projectId: "test-8a848",
    storageBucket: "test-8a848.firebasestorage.app",
    messagingSenderId: "377363493558",
    appId: "1:377363493558:web:d579d62c45ec5ed188ac17"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa servicios que vas a usar
export const auth = getAuth(app);    // <-- exporta auth
export const db = getFirestore(app); // <-- exporta firestore
